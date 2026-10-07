import React, { useState } from 'react';
import { Team, User } from '../types';
import { Sparkles, Copy, Check, FileText, Code2, Rocket, Presentation, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface AIPitchGeneratorProps {
  team: Team;
  members: User[];
}

export const AIPitchGenerator: React.FC<AIPitchGeneratorProps> = ({ team, members }) => {
  const [activeSubTab, setActiveSubTab] = useState<'pitch' | 'readme'>('pitch');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const defaultPitchContent = `# ${team.projectIdea?.title || team.name} - Hackathon Pitch Deck

## 🚀 Problem Statement
Hackathon teams often face friction in team formation, unverified skill representations, and disorganized submission deliverables under 48-hour time limits.

## 💡 The Solution
**${team.projectIdea?.title || team.name}**: An AI-accelerated hackathon workspace featuring proctored skill-verification tests, real-time AI synergy matchmaking, sprint kanban boards, and automated pitch generation.

## 🛠️ System Architecture & Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS 4, Framer Motion
- **Backend API**: Node.js & Express API Gateway
- **AI Models**: Google Gemini 3.6 Flash via @google/genai SDK
- **Skill Engine**: Anti-cheat event telemetry proctoring engine

## 🎯 Key Highlights for Judges
1. **Empirically Verified Badges**: Replaces self-reported claims with anti-cheat quiz results.
2. **AI Squad Matchmaking**: Real-time synergy scoring to balance team role gaps.
3. **End-to-End Submission Pipeline**: Integrated pitch and markdown doc generator.

## 🎤 2-Minute Demo Presentation Script
- **0:00 - 0:30**: Introduce the core problem statement & live target demo.
- **0:30 - 1:15**: Showcase AI Teammate Matchmaker & Proctored Skill Quiz in action.
- **1:15 - 1:45**: Highlight real-time Sprint Kanban & Gemini Pitch Deck generator.
- **1:45 - 2:00**: Summarize futuristic roadmap & thank the hackathon judges.
`;

  const defaultReadmeContent = `# ${team.projectIdea?.title || team.name} 🏆

> ${team.projectIdea?.description || team.description}

![Hackathon Banner](https://img.shields.io/badge/Hackathon-${encodeURIComponent(team.hackathonName)}-blueviolet?style=for-the-badge)
![Build Status](https://img.shields.io/badge/Build-Passing-emerald?style=for-the-badge)
![Gemini AI](https://img.shields.io/badge/Powered%20By-Gemini%203.6%20Flash-4285F4?style=for-the-badge)

## 🌟 Key Features
- **Anti-Cheat Skill Verification**: Tab-switch monitoring and anti-cheat event telemetry.
- **AI Synergy Matchmaker**: Automated matching based on missing team roles and skill matrices.
- **Live Sprint Kanban**: Track hackathon deliverables in real time.
- **AI Co-Pilot Workspace**: Instant AI pitch and architectural assistance.

## 🛠️ Tech Stack & Dependencies
- **Core**: React 19 + TypeScript + Vite
- **AI**: @google/genai SDK (Gemini Flash)
- **Styling**: Tailwind CSS v4 + Framer Motion
- **Backend**: Express.js Node server

## 👥 Team Members & Credits
${members.map(m => `- **${m.name}** (${m.role}) - ${m.college}`).join('\n')}

## ⚡ Quick Start & Installation

\`\`\`bash
# 1. Clone the repository
git clone https://github.com/squadup/${team.name.toLowerCase().replace(/\s+/g, '-')}.git

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
\`\`\`
`;

  const [pitchText, setPitchText] = useState(defaultPitchContent);
  const [readmeText, setReadmeText] = useState(defaultReadmeContent);

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/project-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hackathonTitle: team.hackathonName,
          hackathonDomain: 'AI/GenAI',
          teamMembers: members
        })
      });
      const data = await response.json();
      if (data.ideas && data.ideas.length > 0) {
        const topIdea = data.ideas[0];
        setPitchText(`# ${topIdea.title} - AI Generated Hackathon Pitch

## 🚀 Problem & Solution
${topIdea.description}

## 🛠️ Recommended Tech Stack
${topIdea.techStack.map((tech: string) => `- ${tech}`).join('\n')}

## 💡 Complexity & Impact
- **Complexity**: ${topIdea.complexity}
- **Impact**: ${topIdea.impact}
`);
      }
    } catch (e) {
      console.log('Using default client generation');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = activeSubTab === 'pitch' ? pitchText : readmeText;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 border border-purple-500/30 text-purple-400">
              AI Deliverables Engine
            </span>
            <span className="text-slate-400 text-sm">Powered by Gemini</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Hackathon Pitch Deck & README Generator</h2>
          <p className="text-slate-400 text-xs mt-0.5">Generate submission-ready slide outlines and GitHub markdown docs in 1 click.</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleGenerateContent}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold rounded-xl transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
            {isGenerating ? 'Refining with Gemini...' : 'Re-Generate with AI'}
          </button>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 text-xs font-bold rounded-xl transition shadow-md glow-cyan cursor-pointer"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Markdown'}
          </button>
        </div>
      </div>

      {/* Sub Tab Buttons */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveSubTab('pitch')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition cursor-pointer ${
            activeSubTab === 'pitch'
              ? 'border-purple-500 text-purple-400 bg-purple-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Presentation size={16} />
          Pitch Deck Outline
        </button>
        <button
          onClick={() => setActiveSubTab('readme')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition cursor-pointer ${
            activeSubTab === 'readme'
              ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 size={16} />
          GitHub README.md
        </button>
      </div>

      {/* Content Editor / Preview */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3 font-mono text-sm">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/80">
          <span className="flex items-center gap-2">
            <FileText size={14} className="text-cyan-400" />
            {activeSubTab === 'pitch' ? 'pitch_deck_outline.md' : 'README.md'}
          </span>
          <span>Markdown Format</span>
        </div>

        <textarea
          value={activeSubTab === 'pitch' ? pitchText : readmeText}
          onChange={(e) => {
            if (activeSubTab === 'pitch') setPitchText(e.target.value);
            else setReadmeText(e.target.value);
          }}
          rows={16}
          className="w-full bg-slate-900/60 text-slate-200 p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500 font-mono text-xs leading-relaxed resize-none"
        />
      </div>
    </div>
  );
};
