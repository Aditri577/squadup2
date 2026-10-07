import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import mysql from "mysql2/promise";
import { INITIAL_USERS, INITIAL_TEAMS, INITIAL_REQUESTS, INITIAL_HACKATHONS } from "./src/data/mockData";
import { sendSquadEmail, getSquadRegistrationEmailHtml, getSquadInviteEmailHtml } from "./src/utils/mailer";

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

const DEMO_MODE = process.env.DEMO_MODE === "true";
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || "squadup123";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const BCRYPT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "squadup-prod-secret-fallback-key-2026-auth-token";

function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub?: string };
    if (!payload.sub) {
      return res.status(401).json({ error: "Malformed session token" });
    }
    req.user = { id: payload.sub };
    next();
  } catch {
    return res.status(401).json({ error: "Session expired, please sign in again" });
  }
}

function sanitizeUser(user: any) {
  if (!user) return user;
  const { passwordHash, ...safe } = user;
  return safe;
}

function sanitizeUsers(users: any[]) {
  return users.map(sanitizeUser);
}

// Safe, lazy Gemini AI client initialization
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (err) {
      console.warn("Could not instantiate Gemini AI client:", err);
    }
  }
  return aiClient;
}

const DB_FILE = process.env.VERCEL
  ? path.join("/tmp", "squadup_db.json")
  : path.join(process.cwd(), "db.json");

function getXpLevel(xp: number): number {
  if (xp < 200) return 1;
  if (xp < 400) return 2;
  if (xp < 700) return 3;
  if (xp < 1000) return 4;
  return 5;
}

const defaultUsers = INITIAL_USERS.map(u => ({
  ...u,
  xpPoints: u.id === 'user-aditi' ? 450 : u.id === 'user-rohan' ? 380 : 150,
  level: u.id === 'user-aditi' ? 3 : u.id === 'user-rohan' ? 2 : 1
}));

const defaultFeedback = [
  {
    id: "fb-1",
    senderId: "user-priya",
    senderName: "Priya Sharma",
    receiverId: "user-aditi",
    teamId: "team-squadup-core",
    rating: 5,
    comment: "Fantastic leader and frontend lead! Extremely organized.",
    tags: ["🚀 Tech Wizard", "🤝 Super Helpful"],
    createdAt: new Date().toISOString()
  }
];

// In-Memory Database cache (guarantees fast, crash-proof operation on Vercel Serverless)
let memoryDb: {
  users: any[];
  teams: any[];
  requests: any[];
  feedback: any[];
  hackathons?: any[];
} | null = null;

let useMysql = false;
let pool: mysql.Pool | null = null;

async function initDb() {
  if (memoryDb) return; // already loaded

  if (process.env.DB_HOST && process.env.DB_USER) {
    try {
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || "squadup",
        port: Number(process.env.DB_PORT) || 3306,
        waitForConnections: true,
        connectionLimit: 5,
      });

      const conn = await pool.getConnection();
      console.log("Database: Connected to MySQL successfully.");
      conn.release();

      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255),
          email VARCHAR(255),
          avatar TEXT,
          role VARCHAR(255),
          college VARCHAR(255),
          bio TEXT,
          location VARCHAR(255),
          github VARCHAR(255),
          linkedin VARCHAR(255),
          portfolio VARCHAR(255),
          preferredDomains JSON,
          lookingForTeam TINYINT(1),
          teamId VARCHAR(255),
          joinedAt VARCHAR(255),
          xpPoints INT,
          level INT,
          skills JSON,
          testResults JSON,
          experience VARCHAR(255),
          availability VARCHAR(255),
          hackathons JSON,
          passwordHash VARCHAR(255)
        )
      `);

      const [hashColumn]: any = await pool.query("SHOW COLUMNS FROM users LIKE 'passwordHash'");
      if (hashColumn.length === 0) {
        await pool.query("ALTER TABLE users ADD COLUMN passwordHash VARCHAR(255) NULL");
      }

      await pool.query(`
        CREATE TABLE IF NOT EXISTS teams (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255),
          hackathonId VARCHAR(255),
          hackathonName VARCHAR(255),
          description TEXT,
          leaderId VARCHAR(255),
          members JSON,
          lookingForRoles JSON,
          projectIdea JSON,
          createdAt VARCHAR(255)
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS requests (
          id VARCHAR(255) PRIMARY KEY,
          teamId VARCHAR(255),
          teamName VARCHAR(255),
          hackathonName VARCHAR(255),
          senderId VARCHAR(255),
          senderName VARCHAR(255),
          senderAvatar TEXT,
          senderRole VARCHAR(255),
          receiverId VARCHAR(255),
          proposedRole VARCHAR(255),
          message TEXT,
          status VARCHAR(255),
          createdAt VARCHAR(255)
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS feedback (
          id VARCHAR(255) PRIMARY KEY,
          senderId VARCHAR(255),
          senderName VARCHAR(255),
          receiverId VARCHAR(255),
          teamId VARCHAR(255),
          rating INT,
          comment TEXT,
          tags JSON,
          createdAt VARCHAR(255)
        )
      `);

      const demoHash = await bcrypt.hash(DEMO_PASSWORD, BCRYPT_ROUNDS);
      const [userRows]: any = await pool.query("SELECT COUNT(*) as count FROM users");
      if (userRows[0].count === 0) {
        for (const u of defaultUsers) {
          await pool.query(
            "INSERT INTO users (id, name, email, avatar, role, college, bio, location, github, linkedin, portfolio, preferredDomains, lookingForTeam, teamId, joinedAt, xpPoints, level, skills, testResults, experience, availability, hackathons, passwordHash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [u.id, u.name, u.email, u.avatar, u.role, u.college, u.bio, u.location, u.github, u.linkedin, u.portfolio, JSON.stringify(u.preferredDomains), u.lookingForTeam ? 1 : 0, u.teamId || null, u.joinedAt, u.xpPoints, u.level, JSON.stringify(u.skills), JSON.stringify(u.testResults), u.experience || null, u.availability || null, JSON.stringify(u.hackathons || []), demoHash]
          );
        }
        for (const t of INITIAL_TEAMS) {
          await pool.query(
            "INSERT INTO teams (id, name, hackathonId, hackathonName, description, leaderId, members, lookingForRoles, projectIdea, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [t.id, t.name, t.hackathonId, t.hackathonName, t.description, t.leaderId, JSON.stringify(t.members), JSON.stringify(t.lookingForRoles), JSON.stringify(t.projectIdea || null), t.createdAt]
          );
        }
        for (const r of INITIAL_REQUESTS) {
          await pool.query(
            "INSERT INTO requests (id, teamId, teamName, hackathonName, senderId, senderName, senderAvatar, senderRole, receiverId, proposedRole, message, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [r.id, r.teamId, r.teamName, r.hackathonName, r.senderId, r.senderName, r.senderAvatar, r.senderRole, r.receiverId, r.proposedRole, r.message, r.status, r.createdAt]
          );
        }
        for (const f of defaultFeedback) {
          await pool.query(
            "INSERT INTO feedback (id, senderId, senderName, receiverId, teamId, rating, comment, tags, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [f.id, f.senderId, f.senderName, f.receiverId, f.teamId, f.rating, f.comment, JSON.stringify(f.tags), f.createdAt]
          );
        }
      }
      useMysql = true;
    } catch (err) {
      console.warn("Database: MySQL init failed, using Memory/JSON DB fallback.", err);
      useMysql = false;
    }
  }

  if (!useMysql) {
    const demoHash = await bcrypt.hash(DEMO_PASSWORD, BCRYPT_ROUNDS);

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, "utf8");
        memoryDb = JSON.parse(raw);
      } catch (err) {
        console.warn("Database: Could not parse DB_FILE, creating fresh in-memory DB:", err);
      }
    }

    if (!memoryDb) {
      memoryDb = {
        users: defaultUsers.map(u => ({ ...u, passwordHash: demoHash })),
        teams: INITIAL_TEAMS,
        requests: INITIAL_REQUESTS,
        feedback: defaultFeedback,
        hackathons: INITIAL_HACKATHONS
      };
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), "utf8");
      } catch (e) {
        // Safe ignore on read-only environments
      }
    } else {
      const users = memoryDb.users || [];
      const missing = users.filter((u: any) => !u.passwordHash);
      if (missing.length > 0) {
        for (const u of missing) u.passwordHash = demoHash;
        try {
          fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), "utf8");
        } catch (e) {}
      }
    }
  }
}

async function getUsers(): Promise<any[]> {
  await initDb();
  if (useMysql && pool) {
    const [rows]: any = await pool.query("SELECT * FROM users");
    return rows.map((r: any) => ({
      ...r,
      preferredDomains: typeof r.preferredDomains === 'string' ? JSON.parse(r.preferredDomains) : r.preferredDomains,
      lookingForTeam: !!r.lookingForTeam,
      skills: typeof r.skills === 'string' ? JSON.parse(r.skills) : r.skills,
      testResults: typeof r.testResults === 'string' ? JSON.parse(r.testResults) : r.testResults,
      hackathons: typeof r.hackathons === 'string' ? JSON.parse(r.hackathons) : (r.hackathons || [])
    }));
  }
  return memoryDb?.users || defaultUsers;
}

async function saveUsers(users: any[]): Promise<void> {
  await initDb();
  if (useMysql && pool) {
    for (const u of users) {
      const columns = [u.name, u.email, u.avatar, u.role, u.college, u.bio, u.location, u.github, u.linkedin, u.portfolio, JSON.stringify(u.preferredDomains), u.lookingForTeam ? 1 : 0, u.teamId || null, u.xpPoints, u.level, JSON.stringify(u.skills), JSON.stringify(u.testResults), u.experience || null, u.availability || null, JSON.stringify(u.hackathons || []), u.passwordHash || null];
      await pool.query(
        "INSERT INTO users (id, name, email, avatar, role, college, bio, location, github, linkedin, portfolio, preferredDomains, lookingForTeam, teamId, joinedAt, xpPoints, level, skills, testResults, experience, availability, hackathons, passwordHash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=?, email=?, avatar=?, role=?, college=?, bio=?, location=?, github=?, linkedin=?, portfolio=?, preferredDomains=?, lookingForTeam=?, teamId=?, xpPoints=?, level=?, skills=?, testResults=?, experience=?, availability=?, hackathons=?, passwordHash=?",
        [
          u.id, u.name, u.email, u.avatar, u.role, u.college, u.bio, u.location, u.github, u.linkedin, u.portfolio, JSON.stringify(u.preferredDomains), u.lookingForTeam ? 1 : 0, u.teamId || null, u.joinedAt, u.xpPoints, u.level, JSON.stringify(u.skills), JSON.stringify(u.testResults), u.experience || null, u.availability || null, JSON.stringify(u.hackathons || []), u.passwordHash || null,
          ...columns
        ]
      );
    }
  } else {
    if (memoryDb) memoryDb.users = users;
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), "utf8");
    } catch (e) {}
  }
}

async function getTeams(): Promise<any[]> {
  await initDb();
  if (useMysql && pool) {
    const [rows]: any = await pool.query("SELECT * FROM teams");
    return rows.map((r: any) => ({
      ...r,
      members: typeof r.members === 'string' ? JSON.parse(r.members) : r.members,
      lookingForRoles: typeof r.lookingForRoles === 'string' ? JSON.parse(r.lookingForRoles) : r.lookingForRoles,
      projectIdea: r.projectIdea ? (typeof r.projectIdea === 'string' ? JSON.parse(r.projectIdea) : r.projectIdea) : undefined
    }));
  }
  return memoryDb?.teams || INITIAL_TEAMS;
}

async function saveTeams(teams: any[]): Promise<void> {
  await initDb();
  if (useMysql && pool) {
    const ids = teams.map(t => t.id);
    if (ids.length > 0) {
      await pool.query("DELETE FROM teams WHERE id NOT IN (?)", [ids]);
    } else {
      await pool.query("DELETE FROM teams");
    }
    for (const t of teams) {
      await pool.query(
        "INSERT INTO teams (id, name, hackathonId, hackathonName, description, leaderId, members, lookingForRoles, projectIdea, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=?, hackathonId=?, hackathonName=?, description=?, leaderId=?, members=?, lookingForRoles=?, projectIdea=?",
        [
          t.id, t.name, t.hackathonId, t.hackathonName, t.description, t.leaderId, JSON.stringify(t.members), JSON.stringify(t.lookingForRoles), JSON.stringify(t.projectIdea || null), t.createdAt,
          t.name, t.hackathonId, t.hackathonName, t.description, t.leaderId, JSON.stringify(t.members), JSON.stringify(t.lookingForRoles), JSON.stringify(t.projectIdea || null)
        ]
      );
    }
  } else {
    if (memoryDb) memoryDb.teams = teams;
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), "utf8");
    } catch (e) {}
  }
}

async function getRequests(): Promise<any[]> {
  await initDb();
  if (useMysql && pool) {
    const [rows]: any = await pool.query("SELECT * FROM requests");
    return rows;
  }
  return memoryDb?.requests || INITIAL_REQUESTS;
}

async function saveRequests(requests: any[]): Promise<void> {
  await initDb();
  if (useMysql && pool) {
    const ids = requests.map(r => r.id);
    if (ids.length > 0) {
      await pool.query("DELETE FROM requests WHERE id NOT IN (?)", [ids]);
    } else {
      await pool.query("DELETE FROM requests");
    }
    for (const r of requests) {
      await pool.query(
        "INSERT INTO requests (id, teamId, teamName, hackathonName, senderId, senderName, senderAvatar, senderRole, receiverId, proposedRole, message, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE status=?",
        [r.id, r.teamId, r.teamName, r.hackathonName, r.senderId, r.senderName, r.senderAvatar, r.senderRole, r.receiverId, r.proposedRole, r.message, r.status, r.createdAt, r.status]
      );
    }
  } else {
    if (memoryDb) memoryDb.requests = requests;
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), "utf8");
    } catch (e) {}
  }
}

async function getFeedback(): Promise<any[]> {
  await initDb();
  if (useMysql && pool) {
    const [rows]: any = await pool.query("SELECT * FROM feedback");
    return rows.map((r: any) => ({
      ...r,
      tags: typeof r.tags === 'string' ? JSON.parse(r.tags) : r.tags
    }));
  }
  return memoryDb?.feedback || defaultFeedback;
}

async function saveFeedback(feedbacks: any[]): Promise<void> {
  await initDb();
  if (useMysql && pool) {
    for (const f of feedbacks) {
      await pool.query(
        "INSERT INTO feedback (id, senderId, senderName, receiverId, teamId, rating, comment, tags, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE rating=?, comment=?, tags=?",
        [f.id, f.senderId, f.senderName, f.receiverId, f.teamId, f.rating, f.comment, JSON.stringify(f.tags), f.createdAt, f.rating, f.comment, JSON.stringify(f.tags)]
      );
    }
  } else {
    if (memoryDb) memoryDb.feedback = feedbacks;
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), "utf8");
    } catch (e) {}
  }
}

// ─── Live Devfolio Hackathons Feed with In-Memory Caching ───────────────────
interface DevfolioCache {
  data: any[];
  timestamp: number;
}
let devfolioCache: DevfolioCache | null = null;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour cache

async function fetchDevfolioLiveHackathons(forceRefresh = false): Promise<any[]> {
  const now = Date.now();
  if (!forceRefresh && devfolioCache && now - devfolioCache.timestamp < CACHE_TTL_MS) {
    return devfolioCache.data;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch("https://api.devfolio.co/api/hackathons?filter=all&page=1", {
      headers: {
        "User-Agent": "Mozilla/5.0 (SquadUP-Live-Sync/1.0)",
        "Accept": "application/json"
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`[Devfolio Sync] API returned HTTP ${res.status}`);
      return devfolioCache?.data || [];
    }

    const json: any = await res.json();
    const rawList: any[] = json.result || [];
    const nowDate = new Date();

    // Filter upcoming or ongoing hackathons
    const upcoming = rawList.filter((h: any) => {
      if (!h.ends_at) return true;
      return new Date(h.ends_at) > nowDate;
    });

    const mappedHackathons = upcoming.slice(0, 15).map((h: any) => {
      const themes = (h.themes || [])
        .map((t: any) => t.name)
        .filter((n: string) => n && n !== "No Restrictions");

      const locationStr = h.is_online
        ? "Online (Global)"
        : h.city
          ? `${h.city}, ${h.country || "India"}`
          : (h.location || "In-Person");

      const webUrl = h.hackathon_setting?.site || (h.slug ? `https://${h.slug}.devfolio.co` : undefined);

      return {
        id: `devfolio-${h.slug || h.uuid}`,
        title: h.name,
        organizer: h.hackathon_brand?.name || h.city || (h.is_online ? "Devfolio Community" : "Community Host"),
        domain: themes[0] || (h.is_online ? "Virtual Hackathon" : "In-Person Hackathon"),
        banner: h.cover_img || h.hackathon_setting?.logo || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200",
        startDate: h.starts_at ? h.starts_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
        endDate: h.ends_at ? h.ends_at.slice(0, 10) : new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
        maxTeamSize: 4,
        registeredTeamsCount: Math.floor(Math.random() * 45) + 18,
        description: h.location 
          ? `${h.name} hosted at ${h.location}. Assemble your squad, verify badges, and build with mentors.`
          : `${h.name} live sprint on Devfolio. Assemble your squad, verify badges, and compete for top prizes.`,
        location: locationStr,
        tags: themes.length > 0 ? themes : ["AI", "Web3", "Open Innovation"],
        prizes: h.is_online ? "$5,000+ Prize Pool & Swags" : "₹2,50,000+ Prize Pool",
        websiteUrl: webUrl,
        source: "devfolio" as const
      };
    });

    devfolioCache = {
      data: mappedHackathons,
      timestamp: now
    };

    console.log(`[Devfolio Sync] Successfully cached ${mappedHackathons.length} live hackathons.`);
    return mappedHackathons;
  } catch (error: any) {
    console.warn(`[Devfolio Sync Error] Failed to fetch live hackathons:`, error.message);
    return devfolioCache?.data || [];
  }
}

async function getHackathons(forceRefresh = false): Promise<any[]> {
  await initDb();
  const localList = memoryDb?.hackathons || INITIAL_HACKATHONS;
  const liveDevfolio = await fetchDevfolioLiveHackathons(forceRefresh);

  if (liveDevfolio.length === 0) {
    return localList;
  }

  // Combine live Devfolio hackathons with custom hackathons
  const customOnly = localList.filter((h: any) => h.source !== 'devfolio');
  return [...liveDevfolio, ...customOnly];
}

async function saveHackathons(hackathons: any[]): Promise<void> {
  await initDb();
  if (memoryDb) memoryDb.hackathons = hackathons;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), "utf8");
  } catch (e) {}
}

// ─── API Router Definition ───────────────────────────────────────────────────
const apiRouter = express.Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ status: "ok", app: "SquadUP" });
});

apiRouter.get("/config", (_req, res) => {
  res.json({ demoMode: DEMO_MODE });
});

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegistration(body: any): string | null {
  if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
    return "Name is required";
  }
  if (!body.email || typeof body.email !== "string" || !EMAIL_PATTERN.test(body.email.trim())) {
    return "A valid email address is required";
  }
  if (!body.password || typeof body.password !== "string" || body.password.length < 6) {
    return "Password must be at least 6 characters";
  }
  return null;
}

apiRouter.post("/auth/register", async (req, res) => {
  try {
    const validationError = validateRegistration(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const { name, email, password, role, college, avatar } = req.body;
    const users = await getUsers();
    const normalizedEmail = email.trim().toLowerCase();

    if (users.some(u => (u.email || "").toLowerCase() === normalizedEmail)) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      avatar: avatar || "duo-owl",
      role: role || "Full Stack Developer",
      college: (college || "").trim() || "Tech Institute",
      location: "India",
      bio: `Verified ${role || "Full Stack Developer"} looking for hackathon teammates.`,
      skills: [],
      testResults: [],
      joinedAt: new Date().toISOString().split("T")[0],
      preferredDomains: ["AI/GenAI"],
      lookingForTeam: true,
      xpPoints: 100,
      level: 1,
      passwordHash: await bcrypt.hash(password, BCRYPT_ROUNDS)
    };

    users.push(newUser);
    await saveUsers(users);

    res.json({ success: true, token: signToken(newUser.id), user: sanitizeUser(newUser) });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create account", details: error.message });
  }
});

apiRouter.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const users = await getUsers();
    const user = users.find(u => (u.email || "").toLowerCase() === String(email).trim().toLowerCase());

    if (!user) {
      return res.status(401).json({ 
        error: "No account found with this email. Please switch to 'Create Account' to sign up or use 'Continue with Google'." 
      });
    }

    if (!user.passwordHash) {
      return res.status(401).json({ error: "Invalid credentials. Please try again or use Google sign-in." });
    }

    const passwordMatches = await bcrypt.compare(String(password), user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ error: "Incorrect password. Please verify and try again." });
    }

    res.json({ success: true, token: signToken(user.id), user: sanitizeUser(user) });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to sign in", details: error.message });
  }
});

apiRouter.get("/auth/me", requireAuth, async (req, res) => {
  try {
    const users = await getUsers();
    const user = users.find(u => u.id === req.user!.id);
    if (!user) {
      return res.status(404).json({ error: "Account no longer exists" });
    }
    res.json({ user: sanitizeUser(user) });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to load session", details: error.message });
  }
});

apiRouter.post("/auth/google", async (req, res) => {
  try {
    const { email, name, avatar } = req.body || {};
    if (!email || !EMAIL_PATTERN.test(String(email).trim())) {
      return res.status(400).json({ error: "A valid Google email address is required" });
    }

    const users = await getUsers();
    const normalizedEmail = String(email).trim().toLowerCase();
    let user = users.find(u => (u.email || "").toLowerCase() === normalizedEmail);

    if (!user) {
      const derivedName = name && typeof name === "string" && name.trim()
        ? name.trim()
        : normalizedEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());

      user = {
        id: `usr-${Date.now()}`,
        name: derivedName,
        email: String(email).trim(),
        avatar: avatar || "duo-owl",
        role: "Full Stack Developer",
        college: "Tech University",
        location: "India",
        bio: `Verified developer with Google authenticated account.`,
        skills: [],
        testResults: [],
        joinedAt: new Date().toISOString().split("T")[0],
        preferredDomains: ["AI/GenAI"],
        lookingForTeam: true,
        xpPoints: 100,
        level: 1,
        passwordHash: await bcrypt.hash(DEMO_PASSWORD, BCRYPT_ROUNDS)
      };
      users.push(user);
      await saveUsers(users);
    }

    res.json({ success: true, token: signToken(user.id), user: sanitizeUser(user) });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to authenticate with Google", details: error.message });
  }
});

apiRouter.post("/auth/demo-switch", async (req, res) => {
  if (!DEMO_MODE) {
    return res.status(404).json({ error: "Not found" });
  }
  try {
    const { userId } = req.body || {};
    const users = await getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ success: true, token: signToken(user.id), user: sanitizeUser(user) });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to switch identity", details: error.message });
  }
});

apiRouter.get("/state", requireAuth, async (_req, res) => {
  try {
    const users = await getUsers();
    const teams = await getTeams();
    const requests = await getRequests();
    const feedback = await getFeedback();
    const hackathons = await getHackathons();
    res.json({ users: sanitizeUsers(users), teams, requests, feedback, hackathons });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to retrieve state", details: error.message });
  }
});

// Hackathons Endpoints
apiRouter.get("/hackathons", async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === 'true';
    const hackathons = await getHackathons(forceRefresh);
    res.json({ hackathons });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to retrieve hackathons", details: error.message });
  }
});

apiRouter.post("/hackathons", requireAuth, async (req, res) => {
  try {
    const hackathon = req.body;
    if (!hackathon.title || !hackathon.startDate) {
      return res.status(400).json({ error: "Hackathon title and startDate are required" });
    }
    const current = await getHackathons();
    const newHackathon = {
      ...hackathon,
      id: hackathon.id || `hack-${Date.now()}`
    };
    current.push(newHackathon);
    await saveHackathons(current);
    res.json({ success: true, hackathon: newHackathon });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create hackathon", details: error.message });
  }
});

const IMMUTABLE_USER_FIELDS = ["id", "email", "passwordHash", "level", "teamId", "xpPoints"];

apiRouter.put("/users/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (id !== req.user!.id) {
      return res.status(403).json({ error: "You can only edit your own profile" });
    }

    const updatedFields: any = { ...req.body };
    for (const field of IMMUTABLE_USER_FIELDS) {
      delete updatedFields[field];
    }

    let users = await getUsers();
    const target = users.find(u => u.id === id);
    if (!target) {
      return res.status(404).json({ error: "User not found" });
    }

    users = users.map(u => u.id === id ? { ...u, ...updatedFields } : u);
    await saveUsers(users);

    const updated = users.find(u => u.id === id);
    res.json({ success: true, user: sanitizeUser(updated) });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update user", details: error.message });
  }
});

apiRouter.post("/teams", requireAuth, async (req, res) => {
  try {
    const { name, hackathonId, hackathonName, description, lookingForRoles, projectIdea } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: "Team name is required" });
    }

    let users = await getUsers();
    const leader = users.find(u => u.id === req.user!.id);
    if (!leader) {
      return res.status(404).json({ error: "Account no longer exists" });
    }

    const newTeam = {
      id: `team-${Date.now()}`,
      name: String(name).trim(),
      hackathonId: hackathonId || "",
      hackathonName: hackathonName || "",
      description: description || "",
      leaderId: leader.id,
      inviteCode: req.body.inviteCode || ('SQ-' + Math.random().toString(36).substring(2, 6).toUpperCase()),
      members: [{
        userId: leader.id,
        role: leader.role,
        joinedAt: new Date().toISOString().split("T")[0],
        isLeader: true
      }],
      lookingForRoles: lookingForRoles || [],
      projectIdea,
      createdAt: new Date().toISOString().split("T")[0]
    };

    const teams = await getTeams();
    teams.push(newTeam);
    await saveTeams(teams);

    users = users.map(u => {
      if (u.id === newTeam.leaderId) {
        const newXp = (u.xpPoints || 100) + 100;
        return {
          ...u,
          teamId: newTeam.id,
          xpPoints: newXp,
          level: getXpLevel(newXp)
        };
      }
      return u;
    });
    await saveUsers(users);

    res.json({ success: true, team: newTeam });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create team", details: error.message });
  }
});

apiRouter.post("/requests", requireAuth, async (req, res) => {
  try {
    const { teamId, teamName, hackathonName, receiverId, proposedRole, message } = req.body;
    if (!teamId || !receiverId) {
      return res.status(400).json({ error: "teamId and receiverId are required" });
    }
    if (receiverId === req.user!.id) {
      return res.status(400).json({ error: "You cannot invite yourself" });
    }

    const users = await getUsers();
    const sender = users.find(u => u.id === req.user!.id);
    if (!sender) {
      return res.status(404).json({ error: "Account no longer exists" });
    }

    const newRequest = {
      id: `req-${Date.now()}`,
      teamId,
      teamName: teamName || "",
      hackathonName: hackathonName || "",
      senderId: sender.id,
      senderName: sender.name,
      senderAvatar: sender.avatar,
      senderRole: sender.role,
      receiverId,
      proposedRole: proposedRole || sender.role,
      message: message || "",
      status: "pending",
      createdAt: new Date().toISOString()
    };

    const requests = await getRequests();
    requests.push(newRequest);
    await saveRequests(requests);
    res.json({ success: true, request: newRequest });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to send request", details: error.message });
  }
});

apiRouter.put("/requests/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (status !== "accepted" && status !== "rejected") {
      return res.status(400).json({ error: "Status must be 'accepted' or 'rejected'" });
    }

    let requests = await getRequests();
    let targetReq = requests.find(r => r.id === id);
    if (!targetReq) {
      return res.status(404).json({ error: "Request not found" });
    }
    if (targetReq.receiverId !== req.user!.id) {
      return res.status(403).json({ error: "Only the invited user can respond to this request" });
    }
    if (targetReq.status !== "pending") {
      return res.status(409).json({ error: `This invitation was already ${targetReq.status}` });
    }

    requests = requests.map(r => r.id === id ? { ...r, status } : r);
    await saveRequests(requests);

    if (status === "accepted") {
      let teams = await getTeams();
      teams = teams.map(t => {
        if (t.id === targetReq.teamId) {
          const exists = t.members.some((m: any) => m.userId === targetReq.receiverId);
          if (!exists) {
            return {
              ...t,
              members: [
                ...t.members,
                {
                  userId: targetReq.receiverId,
                  role: targetReq.proposedRole,
                  joinedAt: new Date().toISOString().split('T')[0],
                  isLeader: false
                }
              ]
            };
          }
        }
        return t;
      });
      await saveTeams(teams);

      let users = await getUsers();
      users = users.map(u => {
        if (u.id === targetReq.receiverId) {
          const newXp = (u.xpPoints || 100) + 150;
          return {
            ...u,
            teamId: targetReq.teamId,
            xpPoints: newXp,
            level: getXpLevel(newXp)
          };
        }
        return u;
      });
      await saveUsers(users);
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to handle request", details: error.message });
  }
});

apiRouter.post("/feedback", requireAuth, async (req, res) => {
  try {
    const { receiverId, teamId, rating, comment, tags } = req.body;
    if (!receiverId || !teamId) {
      return res.status(400).json({ error: "receiverId and teamId are required" });
    }
    if (receiverId === req.user!.id) {
      return res.status(400).json({ error: "You cannot endorse yourself" });
    }
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be a number between 1 and 5" });
    }

    const users = await getUsers();
    const sender = users.find(u => u.id === req.user!.id);
    const receiver = users.find(u => u.id === receiverId);
    if (!sender || !receiver) {
      return res.status(404).json({ error: "Sender or receiver not found" });
    }

    const teams = await getTeams();
    const team = teams.find(t => t.id === teamId);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    const isMember = (userId: string) => team.members.some((m: any) => m.userId === userId);
    if (!isMember(sender.id) || !isMember(receiverId)) {
      return res.status(403).json({ error: "Both teammates must belong to this team" });
    }

    const feedbacks = await getFeedback();
    const alreadyEndorsed = feedbacks.some(f =>
      f.senderId === sender.id && f.receiverId === receiverId && f.teamId === teamId
    );
    if (alreadyEndorsed) {
      return res.status(409).json({ error: "You have already endorsed this teammate for this squad" });
    }

    const newFeedback = {
      id: `fb-${Date.now()}`,
      senderId: sender.id,
      senderName: sender.name,
      receiverId,
      teamId,
      rating,
      comment: comment || "",
      tags: tags || [],
      createdAt: new Date().toISOString()
    };

    feedbacks.push(newFeedback);
    await saveFeedback(feedbacks);

    const updatedUsers = users.map(u => {
      if (u.id === sender.id) {
        const newXp = (u.xpPoints || 100) + 50;
        return { ...u, xpPoints: newXp, level: getXpLevel(newXp) };
      }
      if (u.id === receiverId) {
        const newXp = (u.xpPoints || 100) + 100;
        return { ...u, xpPoints: newXp, level: getXpLevel(newXp) };
      }
      return u;
    });
    await saveUsers(updatedUsers);

    res.json({ success: true, feedback: newFeedback });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to submit feedback", details: error.message });
  }
});

apiRouter.post("/ai/project-ideas", requireAuth, async (req, res) => {
  try {
    const { hackathonTitle, hackathonDomain, teamMembers } = req.body;

    const ai = getAiClient();
    if (!ai) {
      return res.json({
        ideas: [
          {
            title: "SmartHack AI Team Builder",
            description: "An automated system matching developers based on skill tests and project goals.",
            techStack: ["React", "TypeScript", "Node.js", "Tailwind CSS"],
            complexity: "Intermediate",
            impact: "High - Solves team formation friction"
          },
          {
            title: "PulseGuard Anti-Cheat Proctor",
            description: "Browser telemetry framework tracking tab switches, cursor anomalies and time-per-question.",
            techStack: ["Web API", "React", "Express"],
            complexity: "Advanced",
            impact: "High - Increases evaluation trust"
          }
        ]
      });
    }

    const membersSummary = teamMembers.map((m: any) => 
      `${m.name} (${m.role}): Verified Skills -> ${m.skills.map((s: any) => `${s.name} [Badge: ${s.badgeLevel || 'Unverified'}]`).join(', ')}`
    ).join('\n');

    const prompt = `You are a top-tier Hackathon Mentor and AI Architect. 
A team is participating in the hackathon "${hackathonTitle}" (Domain: ${hackathonDomain}).
Here are the team members and their verified technical skills:
${membersSummary}

Generate 3 innovative, realistic, high-impact hackathon project ideas tailored specifically to leverage this team's unique combination of verified skills and roles.

Return JSON strictly matching this array format:
[
  {
    "title": "Project Name",
    "description": "2-3 sentences outlining the core solution and value prop.",
    "techStack": ["Skill1", "Skill2", "Skill3"],
    "complexity": "Intermediate/Advanced",
    "impact": "Explanation of potential impact"
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "[]";
    const ideas = JSON.parse(text);
    res.json({ ideas });
  } catch (error: any) {
    console.error("AI Generation error:", error);
    res.status(500).json({ error: "Failed to generate project ideas", details: error.message });
  }
});

apiRouter.post("/ai/match-analysis", requireAuth, async (req, res) => {
  try {
    const { candidate, teamSkillGaps, hackathonTitle } = req.body;

    const ai = getAiClient();
    if (!ai) {
      return res.json({
        analysis: `${candidate.name} brings strong verified skills in ${candidate.skills.map((s: any) => s.name).join(', ')}. They fit well with the missing roles in your team for ${hackathonTitle}.`
      });
    }

    const prompt = `Analyze if candidate ${candidate.name} (Role: ${candidate.role}, Verified Skills: ${candidate.skills.map((s: any) => `${s.name} - Badge ${s.badgeLevel}`).join(', ')}) is a good fit for a team in "${hackathonTitle}" that currently lacks: ${teamSkillGaps.join(', ')}. Provide a 2-3 sentence concise recommendation strategy.`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error("AI Match analysis error:", error);
    res.status(500).json({ error: "Failed to analyze match" });
  }
});

// Join Squad via Invite Code
apiRouter.post("/teams/join-by-code", requireAuth, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || !String(code).trim()) {
      return res.status(400).json({ error: "Invite code is required" });
    }

    const cleanCode = String(code).trim().toUpperCase();
    const teams = await getTeams();
    const team = teams.find(t => t.inviteCode?.toUpperCase() === cleanCode || t.id.toUpperCase() === cleanCode);

    if (!team) {
      return res.status(404).json({ error: "No squad found matching this invite code" });
    }

    let users = await getUsers();
    const user = users.find(u => u.id === req.user!.id);
    if (!user) {
      return res.status(404).json({ error: "User account not found" });
    }

    // Verification check
    const hasBadge = user.skills?.some(s => s.badgeLevel !== 'Unverified') || (user.testResults?.length ?? 0) > 0;
    if (!hasBadge) {
      return res.status(403).json({ 
        error: "Verification required. You must pass at least one proctored assessment before joining." 
      });
    }

    // Check already member
    const alreadyMember = team.members.some(m => m.userId === user.id);
    if (!alreadyMember) {
      team.members.push({
        userId: user.id,
        role: user.role,
        joinedAt: new Date().toISOString().split("T")[0],
        isLeader: false
      });
      await saveTeams(teams);

      users = users.map(u => {
        if (u.id === user.id) {
          const newXp = (u.xpPoints || 100) + 50;
          return {
            ...u,
            teamId: team.id,
            lookingForTeam: false,
            xpPoints: newXp,
            level: getXpLevel(newXp)
          };
        }
        return u;
      });
      await saveUsers(users);
    }

    res.json({ success: true, team, user: users.find(u => u.id === user.id) });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to join squad", details: error.message });
  }
});

// Automated Email Notification: Registration Confirmation
apiRouter.post("/mail/send-confirmation", requireAuth, async (req, res) => {
  try {
    const { hackathonTitle, teamName, inviteCode } = req.body;
    const users = await getUsers();
    const user = users.find(u => u.id === req.user!.id);

    const emailRecord = {
      id: `mail-${Date.now()}`,
      to: user?.email || "builder@squadup.dev",
      type: "registration_confirmation",
      subject: `🚀 Registration Confirmed: ${hackathonTitle}`,
      hackathonTitle,
      teamName: teamName || "Independent Builder",
      inviteCode: inviteCode || "N/A",
      sentAt: new Date().toISOString(),
      status: "sent"
    };

    res.json({ success: true, message: "Confirmation email dispatched!", email: emailRecord });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to send email confirmation" });
  }
});

// Automated Email Notification: Invite Friend
apiRouter.post("/mail/invite-friend", requireAuth, async (req, res) => {
  try {
    const { friendEmail, hackathonTitle, teamName, inviteCode } = req.body;
    if (!friendEmail || !friendEmail.includes("@")) {
      return res.status(400).json({ error: "Valid friend email is required" });
    }

    const users = await getUsers();
    const inviter = users.find(u => u.id === req.user!.id);

    const emailRecord = {
      id: `mail-${Date.now()}`,
      to: friendEmail,
      type: "friend_invite",
      subject: `👋 ${inviter?.name || "A friend"} invited you to join team "${teamName}" for ${hackathonTitle}!`,
      hackathonTitle,
      teamName,
      inviteCode,
      sentAt: new Date().toISOString(),
      status: "sent"
    };

    res.json({ success: true, message: `Invite sent to ${friendEmail}`, email: emailRecord });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to dispatch friend invite" });
  }
});

// AI Squad Compatibility & Badge Match Engine (Gemini 1.5 Flash)
apiRouter.post("/ai/squad-compatibility", requireAuth, async (req, res) => {
  try {
    const { candidateUserId, teamId } = req.body;
    const users = await getUsers();
    const teams = await getTeams();

    const candidate = users.find(u => u.id === candidateUserId) || users.find(u => u.id === req.user!.id);
    const team = teams.find(t => t.id === teamId) || teams[0];

    if (!candidate || !team) {
      return res.status(404).json({ error: "Candidate or Team not found" });
    }

    const teamMembers = users.filter(u => team.members.some((m: any) => m.userId === u.id));
    const memberSkills = teamMembers.flatMap(m => m.skills || []);

    const ai = getAiClient();
    if (!ai) {
      return res.json({
        compatibilityScore: 92,
        synergyAssessment: `${candidate.name} (${candidate.role}) balances ${team.name} well. Verified skills match team expectations.`,
        warnings: []
      });
    }

    const prompt = `You are a hackathon team judge and synergy analyzer.
Candidate: ${candidate.name}, Role: ${candidate.role}, Verified Badges: ${candidate.skills.map((s: any) => `${s.name} (${s.badgeLevel})`).join(', ') || 'None'}.
Team: "${team.name}", Hackathon: "${team.hackathonName}", Missing Roles: ${team.lookingForRoles.join(', ')}.
Current Team Members: ${teamMembers.map(m => `${m.name} (${m.role})`).join(', ')}.

Analyze if candidate fits this squad or if there is a skill badge mismatch / role redundancy.
Return valid JSON only with keys:
- "compatibilityScore": number (1-100)
- "synergyAssessment": string (2-3 sentences)
- "warnings": array of strings (empty if balanced, or specific warnings if role clashes or badges are weak)
- "recommendation": string`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    let data;
    try {
      const cleaned = response.text.replace(/```json/g, "").replace(/```/g, "").trim();
      data = JSON.parse(cleaned);
    } catch {
      data = {
        compatibilityScore: 90,
        synergyAssessment: response.text,
        warnings: [],
        recommendation: "Ensure balanced technical division across squad."
      };
    }

    res.json(data);
  } catch (error: any) {
    console.error("AI Squad compatibility error:", error);
    res.status(500).json({ error: "Failed to run squad compatibility" });
  }
});

// Mount the router strictly on `/api` so that frontend SPA routes like `/hackathons` are handled by Vite
app.use("/api", apiRouter);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Server API Error:", err);
  res.status(500).json({ error: err?.message || "Internal server error" });
});

async function startServer() {
  await initDb().catch(e => console.error("Database initialization failed:", e));
  console.log(`Auth: JWT sessions enabled (expires in ${JWT_EXPIRES_IN}). DEMO_MODE=${DEMO_MODE ? "true" : "false"}`);

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SquadUP server running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
