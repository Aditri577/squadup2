import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { GoogleGenAI } from "@google/genai";

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

// Persistent state in-memory across lambda warm invocations
let dbUsers: any[] = defaultUsers.map(u => ({ ...u, passwordHash: "$2a$10$wT8vFm5s2iE4L7kQ1zB6y.0Z5l1b8H3u2x7G9c4V6n8M0p1q2r3s4" }));
let dbTeams: any[] = [...INITIAL_TEAMS];
let dbRequests: any[] = [...INITIAL_REQUESTS];
let dbFeedback: any[] = [...defaultFeedback];

// ─── Router Setup ─────────────────────────────────────────────────────────────
const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok", app: "SquadUP", serverless: true });
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

router.post("/auth/register", async (req, res) => {
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
    res.json({ success: true, token: signToken(newUser.id), user: sanitizeUser(newUser) });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create account", details: error.message });
  }
});

router.post("/auth/login", async (req, res) => {
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

router.post("/auth/google", async (req, res) => {
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

router.get("/state", requireAuth, (_req, res) => {
  res.json({ users: sanitizeUsers(dbUsers), teams: dbTeams, requests: dbRequests, feedback: dbFeedback });
});

const IMMUTABLE_USER_FIELDS = ["id", "email", "passwordHash", "level", "teamId", "xpPoints"];

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

    const leaderIdx = dbUsers.findIndex(u => u.id === leader.id);
    if (leaderIdx !== -1) {
      const newXp = (dbUsers[leaderIdx].xpPoints || 100) + 100;
      dbUsers[leaderIdx] = {
        ...dbUsers[leaderIdx],
        teamId: newTeam.id,
        xpPoints: newXp,
        level: getXpLevel(newXp)
      };
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

    const senderIdx = dbUsers.findIndex(u => u.id === sender.id);
    if (senderIdx !== -1) {
      const newXp = (dbUsers[senderIdx].xpPoints || 100) + 50;
      dbUsers[senderIdx] = { ...dbUsers[senderIdx], xpPoints: newXp, level: getXpLevel(newXp) };
    }
    const receiverIdx = dbUsers.findIndex(u => u.id === receiverId);
    if (receiverIdx !== -1) {
      const newXp = (dbUsers[receiverIdx].xpPoints || 100) + 100;
      dbUsers[receiverIdx] = { ...dbUsers[receiverIdx], xpPoints: newXp, level: getXpLevel(newXp) };
    }

    res.json({ success: true, feedback: newFeedback });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to submit feedback", details: error.message });
  }
});

router.post("/ai/project-ideas", requireAuth, async (req, res) => {
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

router.post("/ai/match-analysis", requireAuth, async (req, res) => {
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
