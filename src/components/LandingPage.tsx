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
  Star,
  Brain,
  Palette,
  Briefcase,
  LineChart,
  Megaphone
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  const navigate = useNavigate();

  // Orbital Nodes Data for Center Interactive Graphic
  const orbitRoles = [
    { label: 'Developer', icon: Code2, pos: 'top-0 left-1/2 -translate-x-1/2 -translate-y-6', color: 'from-blue-500 to-indigo-600' },
    { label: 'AI/ML Engineer', icon: Brain, pos: 'top-1/4 right-0 translate-x-6 sm:translate-x-10', color: 'from-cyan-500 to-blue-600' },
    { label: 'Product Manager', icon: Briefcase, pos: 'bottom-1/4 right-0 translate-x-6 sm:translate-x-10', color: 'from-amber-500 to-orange-600' },
    { label: 'Marketing', icon: Megaphone, pos: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-6', color: 'from-emerald-500 to-teal-600' },
    { label: 'Data Analyst', icon: LineChart, pos: 'bottom-1/4 left-0 -translate-x-6 sm:-translate-x-10', color: 'from-purple-500 to-indigo-600' },
    { label: 'Designer', icon: Palette, pos: 'top-1/4 left-0 -translate-x-6 sm:-translate-x-10', color: 'from-pink-500 to-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-[#05030a] text-slate-100 font-sans selection:bg-purple-600 selection:text-white overflow-x-hidden relative">
      
      {/* ─── Glowing Blue Energy Waves & Cosmic Particles ────────────────────── */}
      <div className="absolute top-0 left-0 w-full h-[1000px] pointer-events-none -z-10 overflow-hidden">
        {/* Main Neon Blue Orbital Wave Arc */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] rounded-[100%] border border-cyan-500/30 shadow-[0_0_90px_rgba(6,182,212,0.35)] opacity-80 animate-pulse pointer-events-none" />
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[950px] h-[550px] rounded-[100%] border border-blue-500/25 shadow-[0_0_70px_rgba(59,130,246,0.3)] pointer-events-none" />
        
        {/* Intense Radial Blue & Cyan Glow Flares */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-gradient-to-tr from-cyan-600/25 via-blue-600/20 to-purple-600/15 blur-[140px] rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-[450px] h-[300px] bg-cyan-500/20 blur-[120px] rounded-full animate-aurora-slow" />
        <div className="absolute bottom-10 right-0 w-[600px] h-[350px] bg-blue-900/20 blur-[150px] rounded-full" />

        {/* Ambient Grid Background Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b15_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

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
      <section className="relative pt-12 sm:pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <Reveal className="space-y-6">
              
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold backdrop-blur-md shadow-inner">
                <Sparkles size={14} className="text-purple-400 animate-pulse" />
                <span>AI Matchmaking + Anti-Cheat Proctored Skill Verification</span>
              </div>

              {/* Main Huge Title */}
              <h1 className="text-4xl sm:text-6xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] font-display">
                Find <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">Verified Teammates.</span><br />
                Build Winning Hackathon Squads.
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-lg text-purple-200/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                No more unvetted teammates or ghosting in 48-hour jams. SquadUP pairs developers using <strong className="text-white">anti-cheat skill badges</strong>, Gemini AI compatibility scoring, and live team workspaces.
              </p>

              {/* Hero CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold uppercase tracking-wider shadow-[0_0_35px_rgba(168,85,247,0.45)] hover:shadow-purple-500/60 transition-all cursor-pointer flex items-center justify-center gap-2"
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
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 text-xs text-purple-200/60 font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-400" /> Free 15-min Skill Assessment</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-400" /> Smart India Hackathon (SIH 2026) Ready</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-400" /> Instant Gemini AI Match Analysis</span>
              </div>

            </Reveal>
          </div>

          {/* Hero Right Central Orbital Graphic with Blue Lasers */}
          <div className="lg:col-span-5 relative h-[380px] sm:h-[420px] flex items-center justify-center">
            <Reveal delay={0.2} className="w-full h-full flex items-center justify-center relative">
              
              {/* Blue Concentric Glowing Energy Rings */}
              <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.3)] animate-[spin_25s_linear_infinite] pointer-events-none" />
              <div className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border border-dashed border-blue-500/40 animate-[spin_18s_linear_infinite_reverse] pointer-events-none" />
              
              {/* Center Glow Burst */}
              <div className="absolute w-44 h-44 rounded-full bg-cyan-500/30 blur-3xl pointer-events-none" />

              {/* Floating Orbiting Nodes */}
              {orbitRoles.map((role, i) => {
                const Icon = role.icon;
                return (
                  <motion.div
                    key={role.label}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
                    className={`absolute ${role.pos} z-20 flex flex-col items-center gap-1.5 cursor-pointer group`}
                  >
                    <div className="p-3 rounded-2xl bg-[#120d24]/90 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-xl group-hover:scale-110 group-hover:border-cyan-400 transition-all">
                      <div className={`p-2 rounded-xl bg-gradient-to-tr ${role.color} text-white`}>
                        <Icon size={18} />
                      </div>
                    </div>
                    <span className="text-[10px] font-bold tracking-wider text-purple-200 bg-[#090714]/90 px-2.5 py-0.5 rounded-full border border-cyan-500/30 shadow-md">
                      {role.label}
                    </span>
                  </motion.div>
                );
              })}

              {/* Center Brand Core */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-[3px] shadow-[0_0_60px_rgba(6,182,212,0.6)] z-10"
              >
                <div className="w-full h-full bg-[#0b0818] rounded-full flex flex-col items-center justify-center border border-cyan-400/40">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-200 to-purple-300">
                    S
                  </span>
                  <span className="text-[11px] font-black tracking-tight text-white mt-0.5">
                    Squad<span className="text-cyan-400">UP</span>
                  </span>
                </div>
              </motion.div>

            </Reveal>
          </div>

        </div>

        {/* ─── Big Live Metrics Row ─────────────────────────────────────────── */}
        <Reveal delay={0.2} className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-16 max-w-4xl mx-auto">
          <div className="bg-[#120d22]/90 border border-purple-500/20 rounded-[28px] p-6 space-y-1 backdrop-blur-xl shadow-xl hover:border-cyan-500/40 transition-all">
            <CountUp value={192} suffix="k+" className="text-4xl font-extrabold text-white tracking-tight font-display" />
            <div className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">Verified Skill Badges Earned</div>
          </div>

          <div className="bg-[#120d22]/90 border border-purple-500/20 rounded-[28px] p-6 space-y-1 backdrop-blur-xl shadow-xl hover:border-cyan-500/40 transition-all">
            <CountUp value={34} suffix="+" className="text-4xl font-extrabold text-white tracking-tight font-display" />
            <div className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">Winning Squads Formed</div>
          </div>

          <div className="bg-[#120d22]/90 border border-purple-500/20 rounded-[28px] p-6 space-y-1 backdrop-blur-xl shadow-xl hover:border-cyan-500/40 transition-all">
            <CountUp value={98} suffix="%" className="text-4xl font-extrabold text-cyan-300 tracking-tight font-display" />
            <div className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">AI Skill-Gap Match Precision</div>
          </div>
        </Reveal>
      </section>

      {/* ─── Core Features (Bento Grid) ────────────────────────────────────────── */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Why SquadUP Works</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Built from Ground Up for Competitive Hackathons
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/70">
            Eliminating resume fluff with empirical proof of skill, automated anti-cheat telemetry, and real-time sprint collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Anti-Cheat Proctoring */}
          <div className="md:col-span-2 nixtio-card p-8 rounded-[32px] space-y-5 bg-gradient-to-br from-[#151026] via-[#100c1e] to-[#0d091a] border border-purple-500/25 relative overflow-hidden group hover:border-cyan-500/50 transition-all">
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
          <div className="nixtio-card p-8 rounded-[32px] space-y-5 bg-[#120d22] border border-purple-500/20 flex flex-col justify-between hover:border-cyan-500/40 transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Cpu size={26} />
              </div>
              <h3 className="text-xl font-extrabold text-white">Gemini AI Synergy</h3>
              <p className="text-xs text-purple-200/70 leading-relaxed">
                Our AI analyzes candidate skill badges against your squad's missing roles to calculate compatibility scores and generate customized hackathon pitch concepts.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 text-[11px] text-cyan-300 font-mono">
              ⚡ 98% Compatibility Detected
            </div>
          </div>

          {/* Card 3: Hackathon Demo Day */}
          <div className="nixtio-card p-8 rounded-[32px] space-y-4 bg-[#120d22] border border-purple-500/20 hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Trophy size={26} />
            </div>
            <h3 className="text-xl font-extrabold text-white">Live Demo Day Showcase</h3>
            <p className="text-xs text-purple-200/70 leading-relaxed">
              Showcase final prototypes to judges and peers with live upvoting, GitHub repositories, and interactive demo URLs.
            </p>
          </div>

          {/* Card 4: Team Sprint Workspace */}
          <div className="md:col-span-2 nixtio-card p-8 rounded-[32px] space-y-5 bg-gradient-to-br from-[#151026] to-[#0c0915] border border-purple-500/25 hover:border-cyan-500/50 transition-all">
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
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Simple 3-Step Process</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            From Solo Hacker to Ready Squad
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          <div className="p-8 rounded-[28px] bg-[#120d22] border border-white/10 space-y-4 relative hover:border-cyan-500/40 transition-all">
            <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-black flex items-center justify-center text-sm shadow-lg shadow-purple-600/40">
              1
            </div>
            <h3 className="text-lg font-extrabold text-white">Take 15-Min Skill Test</h3>
            <p className="text-xs text-purple-200/70 leading-relaxed">
              Complete a randomized 20-MCQ test in your domain. Earn a Green Badge (80%+) or Yellow Badge (70%+) attached to your profile.
            </p>
          </div>

          <div className="p-8 rounded-[28px] bg-[#120d22] border border-white/10 space-y-4 relative hover:border-cyan-500/40 transition-all">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-lg shadow-blue-600/40">
              2
            </div>
            <h3 className="text-lg font-extrabold text-white">Discover & Match Teammates</h3>
            <p className="text-xs text-purple-200/70 leading-relaxed">
              Filter developers by role, verified badge level, and specific hackathon event. Send instant invites with AI compatibility analysis.
            </p>
          </div>

          <div className="p-8 rounded-[28px] bg-[#120d22] border border-white/10 space-y-4 relative hover:border-cyan-500/40 transition-all">
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
        <div className="rounded-[36px] bg-gradient-to-r from-purple-900/90 via-indigo-950/90 to-blue-950/90 border-2 border-cyan-500/40 p-8 sm:p-14 text-center space-y-6 shadow-[0_0_70px_rgba(6,182,212,0.35)] backdrop-blur-2xl">
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