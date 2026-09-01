import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import mysql from "mysql2/promise";
import { INITIAL_USERS, INITIAL_TEAMS, INITIAL_REQUESTS } from "./src/data/mockData";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI client on the server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const DB_FILE = path.join(process.cwd(), "db.json");

// Helper to calculate Level from XP
function getXpLevel(xp: number): number {
  if (xp < 200) return 1;
  if (xp < 400) return 2;
  if (xp < 700) return 3;
  if (xp < 1000) return 4;
  return 5;
}

// Map mock users to include XP and Level
const defaultUsers = INITIAL_USERS.map(u => ({
  ...u,
  xpPoints: u.id === 'user-aditi' ? 450 : u.id === 'user-rohan' ? 380 : 150,
  level: u.id === 'user-aditi' ? 3 : u.id === 'user-rohan' ? 2 : 1
}));

// Default mock feedback rows
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

let useMysql = false;
let pool: mysql.Pool | null = null;

// Initialize Database Connection
async function initDb() {
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

      // Test connection
      const conn = await pool.getConnection();
      console.log("Database: Connected to MySQL successfully.");
      conn.release();

      // Create Tables
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
          hackathons JSON
        )
      `);

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

      // Seed data if empty
      const [userRows]: any = await pool.query("SELECT COUNT(*) as count FROM users");
      if (userRows[0].count === 0) {
        for (const u of defaultUsers) {
          await pool.query(
            "INSERT INTO users (id, name, email, avatar, role, college, bio, location, github, linkedin, portfolio, preferredDomains, lookingForTeam, teamId, joinedAt, xpPoints, level, skills, testResults, experience, availability, hackathons) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [u.id, u.name, u.email, u.avatar, u.role, u.college, u.bio, u.location, u.github, u.linkedin, u.portfolio, JSON.stringify(u.preferredDomains), u.lookingForTeam ? 1 : 0, u.teamId || null, u.joinedAt, u.xpPoints, u.level, JSON.stringify(u.skills), JSON.stringify(u.testResults), u.experience || null, u.availability || null, JSON.stringify(u.hackathons || [])]
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
        console.log("Database: MySQL seeded with initial mock data.");
      }

      useMysql = true;
    } catch (err) {
      console.warn("Database: MySQL initialization failed, falling back to JSON local file database.", err);
      useMysql = false;
    }
  } else {
    console.log("Database: No MySQL environment variables. Using JSON local file database.");
    useMysql = false;
  }

  if (!useMysql) {
    // Initialize file-based DB
    if (!fs.existsSync(DB_FILE)) {
      const initialDbData = {
        users: defaultUsers,
        teams: INITIAL_TEAMS,
        requests: INITIAL_REQUESTS,
        feedback: defaultFeedback
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDbData, null, 2), "utf8");
      console.log("Database: Created local db.json file with seeded mock data.");
    }
  }
}

// Read/Write wrappers
async function getUsers(): Promise<any[]> {
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
  } else {
    const data = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    return data.users || [];
  }
}

async function saveUsers(users: any[]): Promise<void> {
  if (useMysql && pool) {
    for (const u of users) {
      await pool.query(
        "INSERT INTO users (id, name, email, avatar, role, college, bio, location, github, linkedin, portfolio, preferredDomains, lookingForTeam, teamId, joinedAt, xpPoints, level, skills, testResults, experience, availability, hackathons) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=?, email=?, avatar=?, role=?, college=?, bio=?, location=?, github=?, linkedin=?, portfolio=?, preferredDomains=?, lookingForTeam=?, teamId=?, xpPoints=?, level=?, skills=?, testResults=?, experience=?, availability=?, hackathons=?",
        [
          u.id, u.name, u.email, u.avatar, u.role, u.college, u.bio, u.location, u.github, u.linkedin, u.portfolio, JSON.stringify(u.preferredDomains), u.lookingForTeam ? 1 : 0, u.teamId || null, u.joinedAt, u.xpPoints, u.level, JSON.stringify(u.skills), JSON.stringify(u.testResults), u.experience || null, u.availability || null, JSON.stringify(u.hackathons || []),
          u.name, u.email, u.avatar, u.role, u.college, u.bio, u.location, u.github, u.linkedin, u.portfolio, JSON.stringify(u.preferredDomains), u.lookingForTeam ? 1 : 0, u.teamId || null, u.xpPoints, u.level, JSON.stringify(u.skills), JSON.stringify(u.testResults), u.experience || null, u.availability || null, JSON.stringify(u.hackathons || [])
        ]
      );
    }
  } else {
    const data = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    data.users = users;
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  }
}

async function getTeams(): Promise<any[]> {
  if (useMysql && pool) {
    const [rows]: any = await pool.query("SELECT * FROM teams");
    return rows.map((r: any) => ({
      ...r,
      members: typeof r.members === 'string' ? JSON.parse(r.members) : r.members,
      lookingForRoles: typeof r.lookingForRoles === 'string' ? JSON.parse(r.lookingForRoles) : r.lookingForRoles,
      projectIdea: r.projectIdea ? (typeof r.projectIdea === 'string' ? JSON.parse(r.projectIdea) : r.projectIdea) : undefined
    }));
  } else {
    const data = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    return data.teams || [];
  }
}

async function saveTeams(teams: any[]): Promise<void> {
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
    const data = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    data.teams = teams;
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  }
}

async function getRequests(): Promise<any[]> {
  if (useMysql && pool) {
    const [rows]: any = await pool.query("SELECT * FROM requests");
    return rows;
  } else {
    const data = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    return data.requests || [];
  }
}

async function saveRequests(requests: any[]): Promise<void> {
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
    const data = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    data.requests = requests;
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  }
}

async function getFeedback(): Promise<any[]> {
  if (useMysql && pool) {
    const [rows]: any = await pool.query("SELECT * FROM feedback");
    return rows.map((r: any) => ({
      ...r,
      tags: typeof r.tags === 'string' ? JSON.parse(r.tags) : r.tags
    }));
  } else {
    const data = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    return data.feedback || [];
  }
}

async function saveFeedback(feedbacks: any[]): Promise<void> {
  if (useMysql && pool) {
    for (const f of feedbacks) {
      await pool.query(
        "INSERT INTO feedback (id, senderId, senderName, receiverId, teamId, rating, comment, tags, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE rating=?, comment=?, tags=?",
        [f.id, f.senderId, f.senderName, f.receiverId, f.teamId, f.rating, f.comment, JSON.stringify(f.tags), f.createdAt, f.rating, f.comment, JSON.stringify(f.tags)]
      );
    }
  } else {
    const data = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    data.feedback = feedbacks;
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  }
}

// Call database initializer
initDb().catch(e => console.error("Database initialization failed:", e));

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "SquadUP" });
});

// Endpoint: Fetch complete state
app.get("/api/state", async (_req, res) => {
  try {
    const users = await getUsers();
    const teams = await getTeams();
    const requests = await getRequests();
    const feedback = await getFeedback();
    res.json({ users, teams, requests, feedback });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to retrieve state", details: error.message });
  }
});

// Endpoint: Create a new user (Signup / Custom Google auth)
app.post("/api/users", async (req, res) => {
  try {
    const newUser = req.body;
    const users = await getUsers();
    newUser.xpPoints = newUser.xpPoints || 100;
    newUser.level = getXpLevel(newUser.xpPoints);
    users.push(newUser);
    await saveUsers(users);
    res.json({ success: true, user: newUser });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create user", details: error.message });
  }
});

// Endpoint: Update profile or user attributes
app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;
    let users = await getUsers();
    let userFound = false;

    users = users.map(u => {
      if (u.id === id) {
        userFound = true;
        const finalXp = updatedFields.xpPoints !== undefined ? updatedFields.xpPoints : (u.xpPoints || 100);
        return {
          ...u,
          ...updatedFields,
          xpPoints: finalXp,
          level: getXpLevel(finalXp)
        };
      }
      return u;
    });

    if (!userFound) {
      return res.status(404).json({ error: "User not found" });
    }

    await saveUsers(users);
    const updated = users.find(u => u.id === id);
    res.json({ success: true, user: updated });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update user", details: error.message });
  }
});

// Endpoint: Create team
app.post("/api/teams", async (req, res) => {
  try {
    const newTeam = req.body;
    const teams = await getTeams();
    teams.push(newTeam);
    await saveTeams(teams);

    // Award +100 XP to leader
    let users = await getUsers();
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

// Endpoint: Send team invite request
app.post("/api/requests", async (req, res) => {
  try {
    const newRequest = req.body;
    const requests = await getRequests();
    requests.push(newRequest);
    await saveRequests(requests);
    res.json({ success: true, request: newRequest });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to send request", details: error.message });
  }
});

// Endpoint: Accept/reject request
app.put("/api/requests/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'accepted' | 'rejected'
    let requests = await getRequests();
    let targetReq = requests.find(r => r.id === id);
    if (!targetReq) {
      return res.status(404).json({ error: "Request not found" });
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
          const newXp = (u.xpPoints || 100) + 150; // +150 XP for joining team
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

// Endpoint: Submit teammate feedback
app.post("/api/feedback", async (req, res) => {
  try {
    const newFeedback = req.body;
    newFeedback.id = `fb-${Date.now()}`;
    newFeedback.createdAt = new Date().toISOString();

    const feedbacks = await getFeedback();
    feedbacks.push(newFeedback);
    await saveFeedback(feedbacks);

    // +50 XP for giving feedback, +100 XP for receiving positive feedback
    let users = await getUsers();
    users = users.map(u => {
      if (u.id === newFeedback.senderId) {
        const newXp = (u.xpPoints || 100) + 50;
        return {
          ...u,
          xpPoints: newXp,
          level: getXpLevel(newXp)
        };
      }
      if (u.id === newFeedback.receiverId) {
        const newXp = (u.xpPoints || 100) + 100;
        return {
          ...u,
          xpPoints: newXp,
          level: getXpLevel(newXp)
        };
      }
      return u;
    });
    await saveUsers(users);

    res.json({ success: true, feedback: newFeedback });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to submit feedback", details: error.message });
  }
});

// Endpoint: Generate AI Project Ideas based on Team Verified Skills
app.post("/api/ai/project-ideas", async (req, res) => {
  try {
    const { hackathonTitle, hackathonDomain, teamMembers } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        ideas: [
          {
            title: "SmartHack AI Team Builder",
            description: "A automated system matching developers based on skill tests and project goals.",
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
      model: "gemini-3.5-flash",
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

// Endpoint: AI Teammate Match Analysis
app.post("/api/ai/match-analysis", async (req, res) => {
  try {
    const { candidate, teamSkillGaps, hackathonTitle } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        analysis: `${candidate.name} brings strong verified skills in ${candidate.skills.map((s: any) => s.name).join(', ')}. They fit well with the missing roles in your team for ${hackathonTitle}.`
      });
    }

    const prompt = `Analyze if candidate ${candidate.name} (Role: ${candidate.role}, Verified Skills: ${candidate.skills.map((s: any) => `${s.name} - Badge ${s.badgeLevel}`).join(', ')}) is a good fit for a team in "${hackathonTitle}" that currently lacks: ${teamSkillGaps.join(', ')}. Provide a 2-3 sentence concise recommendation strategy.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error("AI Match analysis error:", error);
    res.status(500).json({ error: "Failed to analyze match" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
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

startServer();
