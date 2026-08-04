import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

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

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "SquadUP" });
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
      model: "gemini-3.6-flash",
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
      model: "gemini-3.6-flash",
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
