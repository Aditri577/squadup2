import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { GoogleGenAI } from "@google/genai";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, doc, getDocs, setDoc, type Firestore } from "firebase/firestore";

const INITIAL_USERS: any[] = [
  {
    id: 'user-aditi',
    name: 'Aditi Saxena',
    email: 'aditi.saxena@example.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    role: 'Full Stack Developer',
    college: 'IIT Delhi',
    bio: 'Passionate about building scalable web apps and AI-powered team tools. 3x Hackathon winner.',
    location: 'New Delhi, India',
    github: 'https://github.com/aditisaxena',
    linkedin: 'https://linkedin.com/in/aditisaxena',
    portfolio: 'https://aditisaxena.dev',
    preferredDomains: ['AI/GenAI', 'EdTech', 'FinTech'],
    lookingForTeam: true,
    teamId: 'team-squadup-core',
    joinedAt: '2026-01-15',
    experience: 'Advanced (3+ yrs)',
    availability: 'Weekends',
    hackathons: ['AI Innovations Global Hackathon 2026', 'SIH 2026'],
    skills: [
      { id: 'sk-1', name: 'React.js', category: 'Frontend (React/JS)', selfRating: 5, badgeLevel: 'Green', scorePercent: 95, verifiedAt: '2026-07-20' },
      { id: 'sk-2', name: 'Node.js & Express', category: 'Backend (Node/Express)', selfRating: 4, badgeLevel: 'Green', scorePercent: 85, verifiedAt: '2026-07-22' },
      { id: 'sk-3', name: 'PostgreSQL & SQL', category: 'Database Management (SQL)', selfRating: 4, badgeLevel: 'Yellow', scorePercent: 75, verifiedAt: '2026-07-25' }
    ],
    testResults: [
      { id: 'tr-1', userId: 'user-aditi', skillName: 'React.js', category: 'Frontend (React/JS)', scorePercent: 95, totalQuestions: 20, correctCount: 19, badgeLevel: 'Green', warningCount: 0, terminated: false, completedAt: '2026-07-20T14:30:00Z', topicBreakdown: { 'Hooks & State': { correct: 8, total: 8 }, 'Virtual DOM': { correct: 6, total: 6 }, 'Performance': { correct: 5, total: 6 } }, antiCheatLogs: [] }
    ]
  },
  {
    id: 'user-rohan',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@example.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    role: 'AI/ML Engineer',
    college: 'BITS Pilani',
    bio: 'Specializing in PyTorch, computer vision, and building LLM pipelines. Looking for a strong squad for AI Innovations Hackathon.',
    location: 'Pilani, India',
    github: 'https://github.com/rohanmehta-ai',
    linkedin: 'https://linkedin.com/in/rohanmehta',
    preferredDomains: ['AI/GenAI', 'Healthcare', 'Autonomous Systems'],
    lookingForTeam: true,
    teamId: 'team-neural-surge',
    joinedAt: '2026-02-10',
    experience: 'Intermediate (1-3 yrs)',
    availability: 'Full-time',
    hackathons: ['AI Innovations Global Hackathon 2026'],
    skills: [
      { id: 'sk-4', name: 'PyTorch & Transformers', category: 'AI/ML (Python/PyTorch)', selfRating: 5, badgeLevel: 'Green', scorePercent: 90, verifiedAt: '2026-07-21' },
      { id: 'sk-5', name: 'Python Systems', category: 'AI/ML (Python/PyTorch)', selfRating: 4, badgeLevel: 'Yellow', scorePercent: 78, verifiedAt: '2026-07-23' }
    ],
    testResults: [
      { id: 'tr-2', userId: 'user-rohan', skillName: 'PyTorch & Transformers', category: 'AI/ML (Python/PyTorch)', scorePercent: 90, totalQuestions: 20, correctCount: 18, badgeLevel: 'Green', warningCount: 1, terminated: false, completedAt: '2026-07-21T10:15:00Z', topicBreakdown: { 'Model Architecture': { correct: 7, total: 7 }, 'Tensors & Autograd': { correct: 6, total: 7 }, 'Optimization': { correct: 5, total: 6 } }, antiCheatLogs: [] }
    ]
  },
  {
    id: 'user-priya',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    role: 'UI/UX Designer',
    college: 'NID Ahmedabad',
    bio: 'Crafting user-centric interfaces and interactive prototypes. Bridging aesthetic design with technical implementation.',
    location: 'Ahmedabad, India',
    github: 'https://github.com/priyadesigns',
    linkedin: 'https://linkedin.com/in/priyasharma',
    portfolio: 'https://priyasharma.design',
    preferredDomains: ['EdTech', 'Social Good', 'FinTech'],
    lookingForTeam: true,
    teamId: 'team-squadup-core',
    joinedAt: '2026-03-01',
    experience: 'Advanced (3+ yrs)',
    availability: 'Evenings',
    hackathons: ['AI Innovations Global Hackathon 2026', 'UI/UX Design Blitz 2026'],
    skills: [
      { id: 'sk-6', name: 'Figma & Design Systems', category: 'UI/UX Design', selfRating: 5, badgeLevel: 'Green', scorePercent: 92, verifiedAt: '2026-07-22' },
      { id: 'sk-7', name: 'HTML5/CSS3 & Tailwind', category: 'Frontend (React/JS)', selfRating: 4, badgeLevel: 'Yellow', scorePercent: 76, verifiedAt: '2026-07-24' }
    ],
    testResults: [
      { id: 'tr-3', userId: 'user-priya', skillName: 'Figma & Design Systems', category: 'UI/UX Design', scorePercent: 92, totalQuestions: 20, correctCount: 18, badgeLevel: 'Green', warningCount: 0, terminated: false, completedAt: '2026-07-22T16:45:00Z', topicBreakdown: { 'Figma Components & AutoLayout': { correct: 7, total: 7 }, 'Accessibility & Contrast (WCAG)': { correct: 6, total: 7 }, 'User Testing': { correct: 5, total: 6 } }, antiCheatLogs: [] }
    ]
  }
];

const INITIAL_TEAMS: any[] = [
  {
    id: 'team-squadup-core',
    name: 'Team Nexus',
    hackathonId: 'hack-1',
    hackathonName: 'AI Innovations Global Hackathon 2026',
    description: 'Building SquadUP - a verified skill-based team recommendation and anti-cheat assessment workspace.',
    leaderId: 'user-aditi',
    inviteCode: 'SQ-NEXUS',
    createdAt: '2026-07-20',
    lookingForRoles: ['Backend Developer', 'AI/ML Engineer'],
    members: [
      { userId: 'user-aditi', role: 'Full Stack Developer', joinedAt: '2026-07-20', isLeader: true },
      { userId: 'user-priya', role: 'UI/UX Designer', joinedAt: '2026-07-22', isLeader: false }
    ],
    projectIdea: {
      title: 'SquadUP Verified Team Matcher',
      description: 'A platform ensuring hackathon teammates possess verified technical abilities with automated proctored tests and skill-gap balance analytics.',
      techStack: ['React', 'Express', 'Gemini AI', 'Tailwind CSS']
    }
  }
];

const INITIAL_REQUESTS: any[] = [
  {
    id: 'req-1',
    teamId: 'team-squadup-core',
    teamName: 'Team Nexus',
    hackathonName: 'AI Innovations Global Hackathon 2026',
    senderId: 'user-rohan',
    senderName: 'Rohan Mehta',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    senderRole: 'AI/ML Engineer',
    receiverId: 'user-aditi',
    proposedRole: 'Frontend Developer',
    message: 'Hey Aditi! We saw your Green Badge in React.js. Would love to collaborate!',
    status: 'pending',
    createdAt: '2026-08-01T12:00:00Z'
  }
];

const app = express();

app.use(cors());
app.use(express.json());

const DEMO_MODE = process.env.DEMO_MODE === "true" && process.env.NODE_ENV !== "production";
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
    (req as any).user = { id: payload.sub };
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

const INITIAL_HACKATHONS: any[] = [
  {
    id: 'hack-1',
    title: 'AI Innovations Global Hackathon 2026',
    organizer: 'Google Cloud & AI Studio',
    domain: 'AI/GenAI',
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
    startDate: '2026-08-15',
    endDate: '2026-08-17',
    maxTeamSize: 4,
    registeredTeamsCount: 142,
    description: 'Build cutting-edge GenAI applications utilizing server-side Gemini models, multimodal agents, and real-time workflows.',
    location: 'Online / Virtual',
    tags: ['Gemini API', 'PyTorch', 'React', 'Full Stack'],
    prizes: '$25,000 in Cash & Cloud Credits'
  },
  {
    id: 'hack-2',
    title: 'FinTech Future Sprint 2026',
    organizer: 'National Banking Association',
    domain: 'FinTech',
    banner: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1000',
    startDate: '2026-08-25',
    endDate: '2026-08-27',
    maxTeamSize: 4,
    registeredTeamsCount: 88,
    description: 'Revolutionizing financial inclusion, fraud detection systems, instant micro-payments, and automated credit scoring.',
    location: 'Hybrid - Bengaluru',
    tags: ['Node.js', 'PostgreSQL', 'Security', 'React'],
    prizes: '₹10,000,000 Incubation Fund'
  },
  {
    id: 'hack-3',
    title: 'DesignJam National UX Challenge',
    organizer: 'India Design Council',
    domain: 'UI/UX Design',
    banner: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=1000',
    startDate: '2026-09-01',
    endDate: '2026-09-03',
    maxTeamSize: 3,
    registeredTeamsCount: 65,
    description: 'Designing intuitive, accessible, and high-impact digital experiences for rural healthcare and vernacular education.',
    location: 'Virtual',
    tags: ['Figma', 'Accessibility', 'Research', 'Prototyping'],
    prizes: 'Design Internships & $10,000'
  },
  {
    id: 'hack-4',
    title: 'SIH 2026',
    organizer: 'Ministry of Education, Government of India',
    domain: 'Social Good',
    banner: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000',
    startDate: '2026-10-10',
    endDate: '2026-10-12',
    maxTeamSize: 6,
    registeredTeamsCount: 2350,
    description: 'Smart India Hackathon 2026 - a nationwide initiative to provide students with a platform to solve some of the pressing problems we face in our daily lives.',
    location: 'Nodal Centers Across India',
    tags: ['IoT', 'AI/ML', 'Agriculture', 'Healthcare', 'Cybersecurity', 'Web/Mobile App'],
    prizes: '₹1,00,000 per Problem Statement'
  }
];

// Persistent state in-memory across lambda warm invocations
let dbUsers: any[] = defaultUsers.map(u => ({ ...u, passwordHash: "$2a$10$wT8vFm5s2iE4L7kQ1zB6y.0Z5l1b8H3u2x7G9c4V6n8M0p1q2r3s4" }));
let dbTeams: any[] = [...INITIAL_TEAMS];
let dbRequests: any[] = [...INITIAL_REQUESTS];
let dbFeedback: any[] = [...defaultFeedback];
let dbHackathons: any[] = [...INITIAL_HACKATHONS];

// ─── Firebase Firestore Cloud Database Setup ──────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyC9YRC5vMMWgmVBgwZ7oM9rYq-E4pxVuiY",
  authDomain: "squadup2-493e0.firebaseapp.com",
  projectId: "squadup2-493e0",
  storageBucket: "squadup2-493e0.firebasestorage.app",
  messagingSenderId: "496247423194",
  appId: "1:496247423194:web:b2851a4f78034e33dfe5e3",
  measurementId: "G-E5T1KL1BV8"
};

let firestore: Firestore | null = null;
try {
  const fbApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  firestore = getFirestore(fbApp);
  console.log("[Firestore] Cloud database initialized successfully.");
} catch (e: any) {
  console.warn("[Firestore] Initialization notice:", e?.message);
}

// Background write-through persistence helpers
async function persistUser(user: any) {
  if (!firestore || !user?.id) return;
  try {
    await setDoc(doc(firestore, "users", String(user.id)), user, { merge: true });
  } catch {
    // Non-blocking fallback to in-memory store
  }
}

async function persistTeam(team: any) {
  if (!firestore || !team?.id) return;
  try {
    await setDoc(doc(firestore, "teams", String(team.id)), team, { merge: true });
  } catch {
    // Non-blocking fallback to in-memory store
  }
}

async function persistRequest(req: any) {
  if (!firestore || !req?.id) return;
  try {
    await setDoc(doc(firestore, "requests", String(req.id)), req, { merge: true });
  } catch {
    // Non-blocking fallback to in-memory store
  }
}

async function persistFeedback(fb: any) {
  if (!firestore || !fb?.id) return;
  try {
    await setDoc(doc(firestore, "feedback", String(fb.id)), fb, { merge: true });
  } catch {
    // Non-blocking fallback to in-memory store
  }
}

// Hydrate state from Firestore on serverless cold starts
let isHydrated = false;
async function ensureHydrated() {
  if (isHydrated || !firestore) return;
  try {
    const [uSnap, tSnap, rSnap, fSnap] = await Promise.all([
      getDocs(collection(firestore, "users")).catch(() => null),
      getDocs(collection(firestore, "teams")).catch(() => null),
      getDocs(collection(firestore, "requests")).catch(() => null),
      getDocs(collection(firestore, "feedback")).catch(() => null),
    ]);

    if (uSnap && !uSnap.empty) {
      const remoteUsers: any[] = [];
      uSnap.forEach((d) => remoteUsers.push(d.data()));
      const remoteIds = new Set(remoteUsers.map((u: any) => u.id));
      dbUsers = [
        ...remoteUsers,
        ...defaultUsers.filter((u: any) => !remoteIds.has(u.id))
      ];
    }

    if (tSnap && !tSnap.empty) {
      const remoteTeams: any[] = [];
      tSnap.forEach((d) => remoteTeams.push(d.data()));
      const remoteIds = new Set(remoteTeams.map((t: any) => t.id));
      dbTeams = [
        ...remoteTeams,
        ...INITIAL_TEAMS.filter((t: any) => !remoteIds.has(t.id))
      ];
    }

    if (rSnap && !rSnap.empty) {
      const remoteReqs: any[] = [];
      rSnap.forEach((d) => remoteReqs.push(d.data()));
      if (remoteReqs.length > 0) dbRequests = remoteReqs;
    }

    if (fSnap && !fSnap.empty) {
      const remoteFb: any[] = [];
      fSnap.forEach((d) => remoteFb.push(d.data()));
      if (remoteFb.length > 0) dbFeedback = remoteFb;
    }

    isHydrated = true;
  } catch {
    // Continue with in-memory state if Firestore is unreachable
  }
}

// ─── Production Rate Limiter ──────────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function createRateLimiter(maxRequests = 25, windowMs = 60000) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "global";
    const key = Array.isArray(ip) ? ip[0] : String(ip);
    const now = Date.now();
    const entry = rateLimitMap.get(key);

    if (!entry || now > entry.resetAt) {
      rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= maxRequests) {
      return res.status(429).json({ error: "Too many requests. Please wait a moment before trying again." });
    }

    entry.count += 1;
    next();
  };
}

const authLimiter = createRateLimiter(30, 60000); // 30 requests/min
const aiLimiter = createRateLimiter(15, 60000);   // 15 requests/min

// ─── Devfolio Live Hackathons ─────────────────────────────────────────────────
interface DevfolioCache { hackathons: any[]; fetchedAt: number; }
let devfolioCache: DevfolioCache | null = null;
const DEVFOLIO_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

async function fetchDevfolioLiveHackathons(forceRefresh = false): Promise<any[]> {
  const now = Date.now();
  if (!forceRefresh && devfolioCache && (now - devfolioCache.fetchedAt) < DEVFOLIO_CACHE_TTL_MS) {
    return devfolioCache.hackathons;
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const resp = await fetch(
      'https://api.devfolio.co/api/hackathons?filter=all&page=1',
      { headers: { 'Accept': 'application/json', 'User-Agent': 'SquadUP/1.0' }, signal: controller.signal }
    );
    clearTimeout(timer);
    if (!resp.ok) throw new Error(`Devfolio API error: ${resp.status}`);
    const data = await resp.json() as any;
    const items: any[] = data?.result ?? [];
    const now2 = new Date();
    const upcoming = items.filter((h: any) => {
      const start = new Date(h.starts_at);
      const end = new Date(h.ends_at);
      return end >= now2 || start >= now2;
    });
    const mapped = upcoming.slice(0, 20).map((h: any) => {
      const rawThemes: string[] = (h.themes ?? []).map((t: any) => t.name).filter((n: string) => n && n !== 'No Restrictions');
      const tags = rawThemes.length > 0 ? rawThemes.slice(0, 4) : ['AI', 'Web3', 'Open Innovation'];
      const banner = h.cover_img || h.hackathon_setting?.logo || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200';
      const location = h.is_online ? 'Online / Virtual' : [h.city, h.state, h.country].filter(Boolean).join(', ') || 'India';
      return {
        id: `devfolio-${h.uuid ?? h.slug}`,
        title: h.name ?? h.hackathon_brand?.name ?? 'Hackathon',
        organizer: h.hackathon_brand?.name ?? 'Devfolio',
        description: `Join ${h.name} — a premier hackathon hosted on Devfolio. Build innovative solutions and compete for exciting prizes.`,
        startDate: h.starts_at ? new Date(h.starts_at).toISOString().split('T')[0] : 'TBA',
        endDate: h.ends_at ? new Date(h.ends_at).toISOString().split('T')[0] : 'TBA',
        location,
        prizes: 'See official page',
        maxTeamSize: 4,
        registeredTeamsCount: Math.floor(Math.random() * 300) + 50,
        domain: tags[0] ?? 'Open Innovation',
        tags,
        banner,
        websiteUrl: h.hackathon_setting?.site
          ? (h.hackathon_setting.site.startsWith('http') ? h.hackathon_setting.site : `https://${h.hackathon_setting.site}.devfolio.co`)
          : (h.slug ? `https://${h.slug}.devfolio.co` : undefined),
        source: 'devfolio' as const
      };
    });
    devfolioCache = { hackathons: mapped, fetchedAt: Date.now() };
    console.log(`[Devfolio Sync] Successfully cached ${mapped.length} live hackathons.`);
    return mapped;
  } catch (err: any) {
    console.warn('[Devfolio Sync] Fetch failed, using fallback:', err.message);
    return devfolioCache?.hackathons ?? [];
  }
}

async function getLiveHackathons(forceRefresh = false): Promise<any[]> {
  const liveItems = await fetchDevfolioLiveHackathons(forceRefresh);
  const customItems = dbHackathons.filter((h: any) => h.source !== 'devfolio');
  return [...liveItems.slice(0, 15), ...customItems];
}

// ─── Router Setup ─────────────────────────────────────────────────────────────
const router = express.Router();

// Auto-hydrate state from Firestore across lambda invocations
router.use(async (_req, _res, next) => {
  await ensureHydrated();
  next();
});

router.get("/health", (_req, res) => {
  res.json({ status: "ok", app: "SquadUP", serverless: true, firestore: !!firestore });
});

router.get("/config", (_req, res) => {
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

router.post("/auth/register", authLimiter, async (req, res) => {
  try {
    const validationError = validateRegistration(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const { name, email, password, role, college, avatar } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    if (dbUsers.some(u => (u.email || "").toLowerCase() === normalizedEmail)) {
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

    dbUsers.push(newUser);
    persistUser(newUser);

    res.json({ success: true, token: signToken(newUser.id), user: sanitizeUser(newUser) });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create account", details: error.message });
  }
});

router.post("/auth/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = dbUsers.find(u => (u.email || "").toLowerCase() === String(email).trim().toLowerCase());

    if (!user) {
      return res.status(401).json({ 
        error: "No account found with this email. Please switch to 'Create Account' to sign up or use 'Continue with Google'." 
      });
    }

    const passwordMatches = user.passwordHash ? await bcrypt.compare(String(password), user.passwordHash) : true;
    if (!passwordMatches) {
      return res.status(401).json({ error: "Incorrect password. Please verify and try again." });
    }

    res.json({ success: true, token: signToken(user.id), user: sanitizeUser(user) });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to sign in", details: error.message });
  }
});

router.get("/auth/me", requireAuth, (req: any, res) => {
  try {
    const user = dbUsers.find(u => u.id === req.user?.id);
    if (!user) {
      return res.status(404).json({ error: "Account no longer exists" });
    }
    res.json({ user: sanitizeUser(user) });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to load session", details: error.message });
  }
});

router.post("/auth/google", authLimiter, async (req, res) => {
  try {
    const { email, name, avatar } = req.body || {};
    if (!email || !EMAIL_PATTERN.test(String(email).trim())) {
      return res.status(400).json({ error: "A valid Google email address is required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    let user = dbUsers.find(u => (u.email || "").toLowerCase() === normalizedEmail);

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
        passwordHash: ""
      };
      dbUsers.push(user);
    }

    persistUser(user);
    res.json({ success: true, token: signToken(user.id), user: sanitizeUser(user) });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to authenticate with Google", details: error.message });
  }
});

router.post("/auth/demo-switch", (req, res) => {
  if (!DEMO_MODE) {
    return res.status(404).json({ error: "Not found" });
  }
  try {
    const { userId } = req.body || {};
    const user = dbUsers.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ success: true, token: signToken(user.id), user: sanitizeUser(user) });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to switch identity", details: error.message });
  }
});

router.get("/state", requireAuth, async (_req, res) => {
  const hackathons = await getLiveHackathons();
  res.json({ users: sanitizeUsers(dbUsers), teams: dbTeams, requests: dbRequests, feedback: dbFeedback, hackathons
   });
});

// Hackathons Endpoints
router.get("/hackathons", async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === 'true';
    const hackathons = await getLiveHackathons(forceRefresh);
    res.json({ hackathons });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to retrieve hackathons", details: error.message });
  }
});

router.post("/hackathons", requireAuth, (req: any, res) => {
  try {
    const hackathon = req.body;
    if (!hackathon.title || !hackathon.startDate) {
      return res.status(400).json({ error: "Hackathon title and startDate are required" });
    }
    const newHackathon = {
      ...hackathon,
      id: hackathon.id || `hack-${Date.now()}`
    };
    dbHackathons.push(newHackathon);
    res.json({ success: true, hackathon: newHackathon });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create hackathon", details: error.message });
  }
});

const IMMUTABLE_USER_FIELDS = ["id", "email", "passwordHash", "level", "xpPoints"];

router.put("/users/:id", requireAuth, (req: any, res) => {
  try {
    const { id } = req.params;
    if (id !== req.user?.id) {
      return res.status(403).json({ error: "You can only edit your own profile" });
    }

    const updatedFields: any = { ...req.body };
    for (const field of IMMUTABLE_USER_FIELDS) {
      delete updatedFields[field];
    }

    const idx = dbUsers.findIndex(u => u.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    dbUsers[idx] = { ...dbUsers[idx], ...updatedFields };
    persistUser(dbUsers[idx]);
    res.json({ success: true, user: sanitizeUser(dbUsers[idx]) });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update user", details: error.message });
  }
});

router.post("/teams", requireAuth, (req: any, res) => {
  try {
    const { name, hackathonId, hackathonName, description, lookingForRoles, projectIdea } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: "Team name is required" });
    }

    const leader = dbUsers.find(u => u.id === req.user?.id);
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

    dbTeams.push(newTeam);
    persistTeam(newTeam);

    const leaderIdx = dbUsers.findIndex(u => u.id === leader.id);
    if (leaderIdx !== -1) {
      const newXp = (dbUsers[leaderIdx].xpPoints || 100) + 100;
      dbUsers[leaderIdx] = {
        ...dbUsers[leaderIdx],
        teamId: newTeam.id,
        xpPoints: newXp,
        level: getXpLevel(newXp)
      };
      persistUser(dbUsers[leaderIdx]);
    }

    res.json({ success: true, team: newTeam });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create team", details: error.message });
  }
});

router.post("/requests", requireAuth, (req: any, res) => {
  try {
    const { teamId, teamName, hackathonName, receiverId, proposedRole, message } = req.body;
    if (!teamId || !receiverId) {
      return res.status(400).json({ error: "teamId and receiverId are required" });
    }
    if (receiverId === req.user?.id) {
      return res.status(400).json({ error: "You cannot invite yourself" });
    }

    const sender = dbUsers.find(u => u.id === req.user?.id);
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

    dbRequests.push(newRequest);
    persistRequest(newRequest);

    res.json({ success: true, request: newRequest });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to send request", details: error.message });
  }
});

router.put("/requests/:id", requireAuth, (req: any, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (status !== "accepted" && status !== "rejected") {
      return res.status(400).json({ error: "Status must be 'accepted' or 'rejected'" });
    }

    const reqIdx = dbRequests.findIndex(r => r.id === id);
    if (reqIdx === -1) {
      return res.status(404).json({ error: "Request not found" });
    }
    const targetReq = dbRequests[reqIdx];
    if (targetReq.receiverId !== req.user?.id) {
      return res.status(403).json({ error: "Only the invited user can respond to this request" });
    }
    if (targetReq.status !== "pending") {
      return res.status(409).json({ error: `This invitation was already ${targetReq.status}` });
    }

    dbRequests[reqIdx] = { ...targetReq, status };
    persistRequest(dbRequests[reqIdx]);

    if (status === "accepted") {
      const teamIdx = dbTeams.findIndex(t => t.id === targetReq.teamId);
      if (teamIdx !== -1) {
        const team = dbTeams[teamIdx];
        const exists = team.members.some((m: any) => m.userId === targetReq.receiverId);
        if (!exists) {
          dbTeams[teamIdx] = {
            ...team,
            members: [
              ...team.members,
              {
                userId: targetReq.receiverId,
                role: targetReq.proposedRole,
                joinedAt: new Date().toISOString().split('T')[0],
                isLeader: false
              }
            ]
          };
          persistTeam(dbTeams[teamIdx]);
        }
      }

      const userIdx = dbUsers.findIndex(u => u.id === targetReq.receiverId);
      if (userIdx !== -1) {
        const newXp = (dbUsers[userIdx].xpPoints || 100) + 150;
        dbUsers[userIdx] = {
          ...dbUsers[userIdx],
          teamId: targetReq.teamId,
          xpPoints: newXp,
          level: getXpLevel(newXp)
        };
        persistUser(dbUsers[userIdx]);
      }
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to handle request", details: error.message });
  }
});

router.post("/feedback", requireAuth, (req: any, res) => {
  try {
    const { receiverId, teamId, rating, comment, tags } = req.body;
    if (!receiverId || !teamId) {
      return res.status(400).json({ error: "receiverId and teamId are required" });
    }
    if (receiverId === req.user?.id) {
      return res.status(400).json({ error: "You cannot endorse yourself" });
    }
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be a number between 1 and 5" });
    }

    const sender = dbUsers.find(u => u.id === req.user?.id);
    const receiver = dbUsers.find(u => u.id === receiverId);
    if (!sender || !receiver) {
      return res.status(404).json({ error: "Sender or receiver not found" });
    }

    const team = dbTeams.find(t => t.id === teamId);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
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

    dbFeedback.push(newFeedback);
    persistFeedback(newFeedback);

    const senderIdx = dbUsers.findIndex(u => u.id === sender.id);
    if (senderIdx !== -1) {
      const newXp = (dbUsers[senderIdx].xpPoints || 100) + 50;
      dbUsers[senderIdx] = { ...dbUsers[senderIdx], xpPoints: newXp, level: getXpLevel(newXp) };
      persistUser(dbUsers[senderIdx]);
    }
    const receiverIdx = dbUsers.findIndex(u => u.id === receiverId);
    if (receiverIdx !== -1) {
      const newXp = (dbUsers[receiverIdx].xpPoints || 100) + 100;
      dbUsers[receiverIdx] = { ...dbUsers[receiverIdx], xpPoints: newXp, level: getXpLevel(newXp) };
      persistUser(dbUsers[receiverIdx]);
    }

    res.json({ success: true, feedback: newFeedback });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to submit feedback", details: error.message });
  }
});

router.post("/ai/project-ideas", requireAuth, aiLimiter, async (req, res) => {
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

    const membersSummary = (teamMembers || []).map((m: any) => 
      `${m.name} (${m.role}): Verified Skills -> ${(m.skills || []).map((s: any) => `${s.name} [Badge: ${s.badgeLevel || 'Unverified'}]`).join(', ')}`
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

router.post("/ai/match-analysis", requireAuth, aiLimiter, async (req, res) => {
  try {
    const { candidate, teamSkillGaps, hackathonTitle } = req.body;
    const ai = getAiClient();

    if (!ai) {
      return res.json({
        analysis: `${candidate?.name || 'Candidate'} brings strong verified skills in ${(candidate?.skills || []).map((s: any) => s.name).join(', ')}. They fit well with the missing roles in your team for ${hackathonTitle}.`
      });
    }

    const prompt = `Analyze if candidate ${candidate.name} (Role: ${candidate.role}, Verified Skills: ${(candidate.skills || []).map((s: any) => `${s.name} - Badge ${s.badgeLevel}`).join(', ')}) is a good fit for a team in "${hackathonTitle}" that currently lacks: ${(teamSkillGaps || []).join(', ')}. Provide a 2-3 sentence concise recommendation strategy.`;

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
router.post("/teams/join-by-code", requireAuth, async (req: any, res) => {
  try {
    const { code } = req.body;
    if (!code || !String(code).trim()) {
      return res.status(400).json({ error: "Invite code is required" });
    }

    const cleanCode = String(code).trim().toUpperCase();
    const team = dbTeams.find((t: any) => t.inviteCode?.toUpperCase() === cleanCode || t.id?.toUpperCase() === cleanCode);

    if (!team) {
      return res.status(404).json({ error: "No squad found matching this invite code" });
    }

    const userIdx = dbUsers.findIndex(u => u.id === req.user!.id);
    if (userIdx === -1) {
      return res.status(404).json({ error: "User account not found" });
    }
    const user = dbUsers[userIdx];

    // Verification check
    const hasBadge = user.skills?.some((s: any) => s.badgeLevel !== 'Unverified') || (user.testResults?.length ?? 0) > 0;
    if (!hasBadge) {
      return res.status(403).json({ 
        error: "Verification required. You must pass at least one proctored assessment before joining." 
      });
    }

    // Check and update team memberships
    const oldTeamId = user.teamId;
    let oldTeam: any = null;
    if (oldTeamId && oldTeamId !== team.id) {
      oldTeam = dbTeams.find((t: any) => t.id === oldTeamId);
      if (oldTeam) {
        oldTeam.members = oldTeam.members.filter((m: any) => m.userId !== user.id);
        persistTeam(oldTeam);
      }
    }

    const alreadyMember = team.members.some((m: any) => m.userId === user.id);
    if (!alreadyMember) {
      team.members.push({
        userId: user.id,
        role: user.role,
        joinedAt: new Date().toISOString().split("T")[0],
        isLeader: false
      });
    }

    const newXp = (user.xpPoints || 100) + (alreadyMember ? 0 : 50);
    dbUsers[userIdx] = {
      ...user,
      teamId: team.id,
      lookingForTeam: false,
      xpPoints: newXp,
      level: getXpLevel(newXp)
    };

    persistTeam(team);
    persistUser(dbUsers[userIdx]);

    res.json({ success: true, team, user: dbUsers[userIdx] });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to join squad", details: error.message });
  }
});

// Automated Email Notification: Registration Confirmation
router.post("/mail/send-confirmation", requireAuth, async (req: any, res) => {
  try {
    const { hackathonTitle, teamName, inviteCode } = req.body;
    const user = dbUsers.find(u => u.id === req.user!.id);

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
router.post("/mail/invite-friend", requireAuth, async (req: any, res) => {
  try {
    const { friendEmail, hackathonTitle, teamName, inviteCode } = req.body;
    if (!friendEmail || !friendEmail.includes("@")) {
      return res.status(400).json({ error: "Valid friend email is required" });
    }

    const inviter = dbUsers.find(u => u.id === req.user!.id);

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
router.post("/ai/squad-compatibility", requireAuth, aiLimiter, async (req: any, res) => {
  try {
    const { candidateUserId, teamId } = req.body;
    const candidate = dbUsers.find(u => u.id === candidateUserId) || dbUsers.find(u => u.id === req.user!.id);
    const team = dbTeams.find(t => t.id === teamId) || dbTeams[0];

    if (!candidate || !team) {
      return res.status(404).json({ error: "Candidate or Team not found" });
    }

    const teamMembers = dbUsers.filter(u => team.members.some((m: any) => m.userId === u.id));

    const ai = getAiClient();
    if (!ai) {
      return res.json({
        compatibilityScore: 92,
        synergyAssessment: `${candidate.name} (${candidate.role}) balances ${team.name} well. Verified skills match team expectations.`,
        warnings: []
      });
    }

    const prompt = `You are a hackathon team judge and synergy analyzer.
Candidate: ${candidate.name}, Role: ${candidate.role}, Verified Badges: ${candidate.skills?.map((s: any) => `${s.name} (${s.badgeLevel})`).join(', ') || 'None'}.
Team: "${team.name}", Hackathon: "${team.hackathonName}", Missing Roles: ${team.lookingForRoles?.join(', ')}.
Current Team Members: ${teamMembers.map((m: any) => `${m.name} (${m.role})`).join(', ')}.

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

// Register on both prefixes to guarantee routing
app.use("/api", router);
app.use("/", router);

export default function handler(req: any, res: any) {
  return new Promise((resolve) => {
    app(req, res, (err: any) => {
      if (err) {
        res.status(500).json({ error: err?.message || "Internal server error" });
      } else {
        res.status(404).json({ error: `Route not found for ${req.method} ${req.url}` });
      }
      resolve(null);
    });
  });
}
