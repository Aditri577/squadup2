import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Mail, 
  User as UserIcon, 
  GraduationCap, 
  Zap,
  CheckCircle2
} from 'lucide-react';
import { renderAvatar, CUTE_AVATARS } from '../utils/avatars';

interface AuthViewProps {
  onLoginSuccess: (user: User) => void;
  allUsers: User[];
  onRegisterUser: (newUser: User) => void;
}

const ROLES: UserRole[] = [
  'Frontend Developer',
  'Backend Developer',
  'AI/ML Engineer',
  'UI/UX Designer',
  'Full Stack Developer',
  'Data Scientist',
  'DevOps Engineer'
];

const GoogleIcon = () => (
  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

export const AuthView: React.FC<AuthViewProps> = ({
  onLoginSuccess,
  allUsers,
  onRegisterUser
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // Google Authentication States
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [showGoogleCustomEmail, setShowGoogleCustomEmail] = useState(false);

  const handleGoogleUserSelect = (user: User) => {
    setShowGoogleChooser(false);
    triggerLoginSuccess(user);
  };

  const handleGoogleCustomEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmailInput.trim()) return;

    const emailStr = googleEmailInput.trim();
    const existing = allUsers.find(u => u.email.toLowerCase() === emailStr.toLowerCase());
    
    if (existing) {
      setShowGoogleChooser(false);
      triggerLoginSuccess(existing);
    } else {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: emailStr.split('@')[0] || 'Google Developer',
        email: emailStr,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
        role: 'Full Stack Developer',
        college: 'Google Auth User',
        location: 'India',
        bio: 'Signed in via Google authentication.',
        skills: [],
        testResults: [],
        joinedAt: new Date().toISOString().split('T')[0],
        preferredDomains: ['AI/GenAI'],
        lookingForTeam: true
      };
      onRegisterUser(newUser);
      setShowGoogleChooser(false);
      triggerLoginSuccess(newUser);
    }
  };
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Sign-up State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Full Stack Developer');
  const [college, setCollege] = useState('');
  const [signupAvatar, setSignupAvatar] = useState('duo-owl');

  // Login success popup state
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [targetUser, setTargetUser] = useState<User | null>(null);

  const triggerLoginSuccess = (user: User) => {
    setTargetUser(user);
    setShowLoginPopup(true);
    setTimeout(() => {
      onLoginSuccess(user);
    }, 1500);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError('Please enter your email address');
      return;
    }

    // Match existing user or create instant session
    const existing = allUsers.find(u => u.email.toLowerCase() === loginEmail.toLowerCase().trim());
    if (existing) {
      triggerLoginSuccess(existing);
    } else {
      // Create user session for new email
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: loginEmail.split('@')[0] || 'Hackathon Developer',
        email: loginEmail,
        avatar: 'duo-owl',
        role: 'Full Stack Developer',
        college: 'IIT Delhi',
        location: 'New Delhi, India',
        bio: 'Passionate developer building high-impact hackathon projects.',
        skills: [],
        testResults: [],
        joinedAt: new Date().toISOString().split('T')[0],
        preferredDomains: ['AI/GenAI', 'Web3'],
        lookingForTeam: true,
        xpPoints: 100,
        level: 1
      };
      onRegisterUser(newUser);
      triggerLoginSuccess(newUser);
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setLoginError('Please fill out all required fields');
      return;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      avatar: signupAvatar,
      role: role,
      college: college.trim() || 'Tech Institute',
      location: 'India',
      bio: `Verified ${role} looking for hackathon teammates.`,
      skills: [],
      testResults: [],
      joinedAt: new Date().toISOString().split('T')[0],
      preferredDomains: ['AI/GenAI', 'FinTech'],
      lookingForTeam: true,
      xpPoints: 100,
      level: 1
    };

    onRegisterUser(newUser);
    triggerLoginSuccess(newUser);
  };

  const handleQuickDemoLogin = (demoUser: User) => {
    onLoginSuccess(demoUser);
  };

  return (
    <div className="min-h-screen nixtio-bg flex items-center justify-center p-4 sm:p-6 font-sans">
      
      {/* Background ambient lighting */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-600/15 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Side: Hero Brand & Feature Showcase */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="text-4xl font-light text-purple-400 font-sans">&#125;</span>
            <span className="font-extrabold text-3xl tracking-tight text-white font-sans">
              SquadUP
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
            The Premier AI Teammate & Verification Portal
          </h1>

          <p className="text-sm text-purple-200/80 leading-relaxed max-w-md">
            Stop relying on self-claimed ratings. Authenticate to access proctored skill tests, 98% AI synergy team matchmaking, and sprint Kanban boards.
          </p>

          {/* Key Value Bullets */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs font-semibold text-purple-100">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                <ShieldCheck size={14} />
              </div>
              <span>Anti-Cheat Proctored MCQ Skill Engine</span>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold text-purple-100">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                <Zap size={14} />
              </div>
              <span>AI Compatibility Synergy Matchmaker</span>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold text-purple-100">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                <Sparkles size={14} />
              </div>
              <span>Gemini AI Pitch Deck & README Generator</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card Container */}
        <div className="lg:col-span-6">
          <div className="nixtio-card p-8 sm:p-10 space-y-6 shadow-[0_25px_70px_rgba(0,0,0,0.8)]">
            
            {/* Auth Mode Tabs */}
            <div className="flex items-center p-1 rounded-full bg-[#0b0813] border border-white/10">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setLoginError(''); }}
                className={`flex-1 py-2.5 rounded-full text-xs font-bold transition text-center cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-purple-300/70 hover:text-white'
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setLoginError(''); }}
                className={`flex-1 py-2.5 rounded-full text-xs font-bold transition text-center cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-purple-300/70 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {loginError && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                {loginError}
              </div>
            )}

            {/* LOGIN FORM */}
            {authMode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-purple-300 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                    <input
                      type="email"
                      required
                      placeholder="aditi.saxena@bits.ac.in"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-full bg-[#0b0813] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-purple-300 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-full bg-[#0b0813] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-purple-300/70 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-purple-800 text-purple-500 bg-[#0b0813]" />
                    <span>Remember session</span>
                  </label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Demo password reset link sent to email!'); }} className="hover:text-white transition">Forgot password?</a>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-wider uppercase transition shadow-xl hover:shadow-purple-500/40 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Sign In To SquadUP</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            ) : (

              /* SIGN UP FORM */
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-purple-300 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aditi Saxena"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-full bg-[#0b0813] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-purple-300 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                    <input
                      type="email"
                      required
                      placeholder="name@college.edu"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-full bg-[#0b0813] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-purple-300 uppercase tracking-wider mb-1.5">
                    Primary Role
                  </label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as UserRole)}
                    className="w-full px-4 py-3 rounded-full bg-[#0b0813] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400 font-semibold cursor-pointer"
                  >
                    {ROLES.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-purple-300 uppercase tracking-wider mb-1.5">
                    College / University
                  </label>
                  <div className="relative">
                    <GraduationCap size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                    <input
                      type="text"
                      placeholder="e.g. BITS Pilani / IIT Bombay"
                      value={college}
                      onChange={e => setCollege(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-full bg-[#0b0813] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                {/* Cute Avatar Doodle Chooser */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-purple-300 uppercase tracking-wider">
                    Select Your Cute Doodle Avatar
                  </label>
                  <div className="flex flex-wrap gap-2.5 justify-center py-2 bg-black/30 rounded-2xl border border-white/5">
                    {CUTE_AVATARS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setSignupAvatar(av.id)}
                        className={`w-11 h-11 p-1 rounded-xl bg-slate-900 border transition cursor-pointer hover:border-purple-400 ${
                          signupAvatar === av.id ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-slate-800'
                        }`}
                        title={av.name}
                      >
                        {av.render("w-full h-full")}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-wider uppercase transition shadow-xl hover:shadow-purple-500/40 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Create Account & Launch</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}

            {/* OR Divider & Continue with Google */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-4 text-slate-500 text-[10px] font-bold tracking-widest uppercase">Or</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <button
              type="button"
              onClick={() => setShowGoogleChooser(true)}
              className="w-full py-3 rounded-full bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>

          </div>
        </div>

      </div>

      {/* LOGIN SUCCESS GLOWING POPUP MODAL */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="nixtio-card p-8 sm:p-10 max-w-sm w-full text-center space-y-4 shadow-[0_0_80px_rgba(168,85,247,0.4)] animate-bounce-short">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 border-2 border-purple-400 flex items-center justify-center mx-auto text-purple-300 shadow-lg">
              <CheckCircle2 size={36} className="text-purple-400 fill-purple-950" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                You have been logged in successfully!
              </h3>
              <p className="text-xs text-purple-200/80">
                Welcome back, <strong>{targetUser?.name || 'Developer'}</strong>. Launching portal...
              </p>
            </div>

            <div className="w-full bg-purple-950/60 rounded-full h-1.5 overflow-hidden">
              <div className="bg-purple-400 h-full w-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* GOOGLE CHOOSE ACCOUNT MODAL */}
      {showGoogleChooser && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f0c1b] border border-white/10 rounded-[28px] max-w-md w-full p-6 sm:p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
            
            {/* Google Header */}
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Choose an account
              </h3>
              <p className="text-xs text-slate-400">
                to continue to <strong className="text-purple-400">SquadUP</strong>
              </p>
            </div>

            {!showGoogleCustomEmail ? (
              <div className="space-y-3">
                {/* Account list */}
                <div className="max-h-60 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleGoogleUserSelect(u)}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-purple-500/30 transition text-left cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 group-hover:border-purple-400 flex items-center justify-center p-0.5 bg-slate-900 shrink-0">
                        {renderAvatar(u.avatar, "w-full h-full")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{u.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{u.email}</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 font-semibold group-hover:bg-purple-500 group-hover:text-white transition">
                        {u.role.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowGoogleCustomEmail(true)}
                    className="w-full py-2.5 rounded-full border border-white/10 hover:border-purple-500/30 hover:bg-white/5 text-xs text-white font-medium transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <UserIcon size={14} className="text-slate-400" />
                    <span>Use another Google account</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGoogleCustomEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-1.5">
                    Google Email Address
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                    <input
                      type="email"
                      required
                      placeholder="username@gmail.com"
                      value={googleEmailInput}
                      onChange={e => setGoogleEmailInput(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-full bg-black/40 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowGoogleCustomEmail(false);
                      setGoogleEmailInput('');
                    }}
                    className="flex-1 py-2.5 rounded-full border border-white/10 hover:bg-white/5 text-xs text-slate-300 font-bold transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-xs text-white font-bold transition cursor-pointer shadow-lg shadow-purple-500/20"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}

            <div className="text-[10px] text-slate-500 text-center leading-normal max-w-[280px] mx-auto pt-2">
              To continue, Google will share your name, email address, language preference, and profile picture with SquadUP.
            </div>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => {
                setShowGoogleChooser(false);
                setShowGoogleCustomEmail(false);
                setGoogleEmailInput('');
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
};


