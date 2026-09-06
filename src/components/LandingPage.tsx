import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Reveal, CountUp } from './Motion';
import { 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Trophy, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Cpu, 
  Flame, 
  Award, 
  Calendar, 
  MessageSquare, 
  Search,
  Code2,
  ChevronRight,
  Globe,
  Star
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#07050d] text-slate-100 font-sans selection:bg-purple-600 selection:text-white overflow-x-hidden">
      
      {/* ─── Top Public Navbar ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#0b0814]/80 border-b border-purple-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-black text-white text-lg shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-purple-400/30">
              S
            </div>
            <div>
              <span className="text-xl font-extrabold text-white tracking-tight">Squad<span className="text-purple-400">UP</span></span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                v2.0 Verified
              </span>
            </div>
          </div>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-purple-200/70">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#hackathons" className="hover:text-white transition-colors">Hackathons</a>
            <a href="#proctoring" className="hover:text-white transition-colors">Proctoring Engine</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onLogin}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-purple-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/30 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Join Squad</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Hero Section ──────────────────────────────────────────────────────── */}
      <section className="relative pt-16 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Ambient background glow blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/20 blur-[130px] rounded-full pointer-events-none -z-10 animate-aurora"></div>
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[250px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none -z-10 animate-aurora-slow"></div>

        <Reveal className="space-y-6 max-w-4xl mx-auto">
          
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold backdrop-blur-md shadow-inner">
            <Sparkles size={14} className="text-purple-400 animate-pulse" />
            <span>AI Matchmaking + Anti-Cheat Proctored Skill Verification</span>
          </div>

          {/* Main Huge Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.08] font-display">
            Find <span className="text-gradient">Verified Teammates.</span><br />
            Build Winning Hackathon Squads.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-purple-200/80 max-w-2xl mx-auto leading-relaxed">
            No more unvetted teammates or ghosting in 48-hour jams. SquadUP pairs developers using <strong className="text-white">anti-cheat skill badges</strong>, Gemini AI compatibility scoring, and live team workspaces.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold uppercase tracking-wider shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-purple-500/50 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={onLogin}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#141022] hover:bg-[#1a142e] border border-purple-500/30 text-purple-200 hover:text-white text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Sign In with Google</span>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Feature Highlights Pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-6 text-xs text-purple-200/60 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-400" /> Free 15-min Skill Assessment</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-400" /> Smart India Hackathon (SIH 2026) Ready</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-400" /> Instant Gemini AI Match Analysis</span>
          </div>
        </Reveal>

        {/* ─── Big Live Metrics Row ─────────────────────────────────────────── */}
        <Reveal delay={0.2} className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-16 max-w-4xl mx-auto">
          <div className="bg-[#120d22]/90 border border-purple-500/20 rounded-[28px] p-6 space-y-1 backdrop-blur-xl shadow-xl">
            <CountUp value={192} suffix="k+" className="text-4xl font-extrabold text-white tracking-tight font-display" />
            <div className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">Verified Skill Badges Earned</div>
          </div>

          <div className="bg-[#120d22]/90 border border-purple-500/20 rounded-[28px] p-6 space-y-1 backdrop-blur-xl shadow-xl">
            <CountUp value={34} suffix="+" className="text-4xl font-extrabold text-white tracking-tight font-display" />
            <div className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">Winning Squads Formed</div>
          </div>

          <div className="bg-[#120d22]/90 border border-purple-500/20 rounded-[28px] p-6 space-y-1 backdrop-blur-xl shadow-xl">
            <CountUp value={98} suffix="%" className="text-4xl font-extrabold text-purple-300 tracking-tight font-display" />
            <div className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">AI Skill-Gap Match Precision</div>
          </div>
        </Reveal>
      </section>

      {/* ─── Core Features (Bento Grid) ────────────────────────────────────────── */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Why SquadUP Works</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Built from Ground Up for Competitive Hackathons
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/70">
            Eliminating resume fluff with empirical proof of skill, automated anti-cheat telemetry, and real-time sprint collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Anti-Cheat Proctoring */}
          <div className="md:col-span-2 nixtio-card p-8 rounded-[32px] space-y-5 bg-gradient-to-br from-[#151026] via-[#100c1e] to-[#0d091a] border border-purple-500/25 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <ShieldCheck size={26} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-white">Anti-Cheat Proctored Skill Engine</h3>
              <p className="text-xs sm:text-sm text-purple-200/70 leading-relaxed max-w-xl">
                Take a 20-MCQ evaluation under active proctoring telemetry. Tab-switch detection, fullscreen enforcement, and camera presence guarantee your Green or Yellow Badge represents genuine ability.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {['Frontend (React/JS)', 'Backend (Node/Express)', 'AI/ML (PyTorch)', 'System Design', 'SQL & Databases'].map(badge => (
                <span key={badge} className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
                  🛡️ {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Card 2: AI Matchmaking */}
          <div className="nixtio-card p-8 rounded-[32px] space-y-5 bg-[#120d22] border border-purple-500/20 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Cpu size={26} />
              </div>
              <h3 className="text-xl font-extrabold text-white">Gemini AI Synergy</h3>
              <p className="text-xs text-purple-200/70 leading-relaxed">
                Our AI analyzes candidate skill badges against your squad's missing roles to calculate compatibility scores and generate customized hackathon pitch concepts.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 text-[11px] text-purple-300 font-mono">
              ⚡ 98% Compatibility Detected
            </div>
          </div>

          {/* Card 3: Hackathon Demo Day */}
          <div className="nixtio-card p-8 rounded-[32px] space-y-4 bg-[#120d22] border border-purple-500/20">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Trophy size={26} />
            </div>
            <h3 className="text-xl font-extrabold text-white">Live Demo Day Showcase</h3>
            <p className="text-xs text-purple-200/70 leading-relaxed">
              Showcase final prototypes to judges and peers with live upvoting, GitHub repositories, and interactive demo URLs.
            </p>
          </div>

          {/* Card 4: Team Sprint Workspace */}
          <div className="md:col-span-2 nixtio-card p-8 rounded-[32px] space-y-5 bg-gradient-to-br from-[#151026] to-[#0c0915] border border-purple-500/25">
            <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Zap size={26} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-white">Interactive Squad Workspaces & Sprint Kanban</h3>
              <p className="text-xs sm:text-sm text-purple-200/70 leading-relaxed max-w-xl">
                Manage hackathon tasks, brainstorm AI project pitches, and endorse teammates with verified XP points and reputation levels.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-purple-300">
              <span>🚀 +100 XP Team Creation</span>
              <span>🤝 +150 XP Squad Join</span>
              <span>⭐ +50 XP Peer Endorsement</span>
            </div>
          </div>

        </div>
      </section>

      {/* ─── How It Works (3 Steps) ────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Simple 3-Step Process</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            From Solo Hacker to Ready Squad
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          <div className="p-8 rounded-[28px] bg-[#120d22] border border-white/10 space-y-4 relative">
            <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-black flex items-center justify-center text-sm shadow-lg shadow-purple-600/40">
              1
            </div>
            <h3 className="text-lg font-extrabold text-white">Take 15-Min Skill Test</h3>
            <p className="text-xs text-purple-200/70 leading-relaxed">
              Complete a randomized 20-MCQ test in your domain. Earn a Green Badge (80%+) or Yellow Badge (70%+) attached to your profile.
            </p>
          </div>

          <div className="p-8 rounded-[28px] bg-[#120d22] border border-white/10 space-y-4 relative">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-lg shadow-indigo-600/40">
              2
            </div>
            <h3 className="text-lg font-extrabold text-white">Discover & Match Teammates</h3>
            <p className="text-xs text-purple-200/70 leading-relaxed">
              Filter developers by role, verified badge level, and specific hackathon event. Send instant invites with AI compatibility analysis.
            </p>
          </div>

          <div className="p-8 rounded-[28px] bg-[#120d22] border border-white/10 space-y-4 relative">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-sm shadow-lg shadow-emerald-600/40">
              3
            </div>
            <h3 className="text-lg font-extrabold text-white">Build & Win Demo Day</h3>
            <p className="text-xs text-purple-200/70 leading-relaxed">
              Collaborate in your team workspace, track sprint todos, generate AI project architectures, and submit to live Demo Day.
            </p>
          </div>

        </div>
      </section>

      {/* ─── Bottom CTA Banner ─────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-[36px] bg-gradient-to-r from-purple-900/90 via-indigo-950/90 to-purple-950/90 border-2 border-purple-500/40 p-8 sm:p-14 text-center space-y-6 shadow-[0_0_60px_rgba(168,85,247,0.3)] backdrop-blur-2xl">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display max-w-2xl mx-auto">
            Ready to Build Your Next Hackathon Winning Team?
          </h2>
          <p className="text-xs sm:text-base text-purple-200/80 max-w-xl mx-auto">
            Join thousands of developers from IITs, BITS, and global tech universities. Verify your skills and match today.
          </p>
          <div className="pt-2">
            <button
              onClick={onGetStarted}
              className="px-9 py-4 rounded-full bg-white hover:bg-slate-100 text-purple-950 text-sm font-extrabold uppercase tracking-wider shadow-2xl transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Create Free Account</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-purple-500/15 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-purple-300/60">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-white text-xs">S</div>
          <span className="font-bold text-white">SquadUP Protocol</span> — AI Teammate & Verification Platform
        </div>
        <p>© 2026 SquadUP. Built for students, builders & hackathon winners.</p>
      </footer>

    </div>
  );
};
