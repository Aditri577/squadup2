import React, { useState } from 'react';
import { User } from '../types';
import { 
  Bell, 
  ChevronDown, 
  LogOut, 
  User as UserIcon, 
  Zap,
  Search,
  Compass,
  Briefcase,
  Trophy,
  Sparkles,
  Layers
} from 'lucide-react';
import { renderAvatar } from '../utils/avatars';

interface HeaderProps {
  activeTab: 'discovery' | 'assessment' | 'profile' | 'teams' | 'hackathons' | 'leaderboard';
  setActiveTab: (tab: 'discovery' | 'assessment' | 'profile' | 'teams' | 'hackathons' | 'leaderboard') => void;
  currentUser: User;
  allUsers: User[];
  onSwitchUser: (user: User) => void;
  pendingRequestsCount: number;
  onOpenRequestsModal: () => void;
  onLogout: () => void;
  onOpenCommandPalette?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  allUsers,
  onSwitchUser,
  pendingRequestsCount,
  onOpenRequestsModal,
  onLogout,
  onOpenCommandPalette
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showXPPopover, setShowXPPopover] = useState(false);
  const [showExploreDropdown, setShowExploreDropdown] = useState(false);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);

  const currentLevel = currentUser.level || 1;
  const currentXP = currentUser.xpPoints || 150;
  const nextLevelXP = currentLevel * 500;
  const progressPercent = Math.min(100, Math.round((currentXP / nextLevelXP) * 100));

  return (
    <header className="sticky top-0 z-40 bg-[#0a0714]/90 backdrop-blur-2xl border-b border-purple-500/15 transition-all">
      <div className="max-w-[1536px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20 gap-6">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group shrink-0" 
            onClick={() => setActiveTab('discovery')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-purple-400 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform">
              &#125;
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white font-sans flex items-center gap-2">
                SquadUP
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" title="System Online"></span>
              </span>
              <span className="text-[9px] uppercase font-bold text-purple-400 tracking-[0.2em] -mt-1">
                Hackathon Engine
              </span>
            </div>
          </div>

          {/* Center Navigation Links - Spacious & Clean Lines */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            
            {/* EXPLORE GROUP DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setShowExploreDropdown(!showExploreDropdown)}
                className={`py-2 text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 cursor-pointer relative ${
                  activeTab === 'discovery' || activeTab === 'hackathons'
                    ? 'text-white border-b-2 border-purple-400 text-shadow-glow'
                    : 'text-slate-400 hover:text-purple-300'
                }`}
              >
                <Compass size={15} className={activeTab === 'discovery' || activeTab === 'hackathons' ? 'text-purple-400' : ''} />
                <span>EXPLORE</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${showExploreDropdown ? 'rotate-180 text-purple-400' : 'text-slate-500'}`} />
              </button>

              {showExploreDropdown && (
                <div 
                  className="absolute top-full left-0 mt-3 w-56 bg-[#120a24]/95 border border-purple-500/30 rounded-2xl shadow-2xl py-2.5 z-50 backdrop-blur-2xl animate-fade-in"
                  onMouseLeave={() => setShowExploreDropdown(false)}
                >
                  <button
                    onClick={() => {
                      setActiveTab('discovery');
                      setShowExploreDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-left text-xs font-bold text-slate-200 hover:bg-purple-950/50 hover:text-white transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <UserIcon size={15} className="text-purple-400" />
                      <span>Teammate Discovery</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                      7
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('hackathons');
                      setShowExploreDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-left text-xs font-bold text-slate-200 hover:bg-purple-950/50 hover:text-white transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Trophy size={15} className="text-amber-400" />
                      <span>Hackathons Hub</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                      35
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* WORKSPACE & SQUADS */}
            <button
              onClick={() => setActiveTab('teams')}
              className={`py-2 text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'teams'
                  ? 'text-white border-b-2 border-purple-400'
                  : 'text-slate-400 hover:text-purple-300'
              }`}
            >
              <Briefcase size={15} className={activeTab === 'teams' ? 'text-purple-400' : ''} />
              <span>WORKSPACE</span>
              <sup className="text-[10px] text-purple-400 font-extrabold ml-0.5">9</sup>
            </button>

            {/* SKILL ENGINE & QUIZ */}
            <button
              onClick={() => setActiveTab('assessment')}
              className={`py-2 text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'assessment'
                  ? 'text-white border-b-2 border-purple-400'
                  : 'text-slate-400 hover:text-purple-300'
              }`}
            >
              <Sparkles size={15} className={activeTab === 'assessment' ? 'text-purple-400' : ''} />
              <span>SKILL ENGINE</span>
            </button>

            {/* LEADERBOARD */}
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`py-2 text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'leaderboard'
                  ? 'text-white border-b-2 border-purple-400'
                  : 'text-slate-400 hover:text-purple-300'
              }`}
            >
              <Trophy size={15} className={activeTab === 'leaderboard' ? 'text-purple-400' : ''} />
              <span>LEADERBOARD</span>
            </button>

            {/* MY PROFILE */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 text-xs uppercase tracking-widest font-bold transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'text-white border-b-2 border-purple-400'
                  : 'text-slate-400 hover:text-purple-300'
              }`}
            >
              <span>PROFILE</span>
            </button>
          </nav>

          {/* Right Actions & Controls - Well Spaced */}
          <div className="flex items-center gap-3.5 xl:gap-5 shrink-0">
            
            {/* Global Cmd + K Search Trigger Button */}
            {onOpenCommandPalette && (
              <button
                onClick={onOpenCommandPalette}
                className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#120a24] border border-purple-500/25 hover:border-purple-400/50 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer shadow-md"
                title="Open Command Palette (Cmd + K)"
              >
                <Search size={14} className="text-purple-400" />
                <span className="hidden xl:inline">Search...</span>
                <kbd className="px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-500/30 text-[10px] text-purple-300 font-mono">
                  ⌘K
                </kbd>
              </button>
            )}

            {/* Team Invitations Pill Button */}
            <button
              onClick={onOpenRequestsModal}
              className="relative px-4 py-2 rounded-full bg-[#120a24] border border-purple-500/25 hover:border-purple-400/50 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-2 shadow-md"
            >
              <Bell size={14} className="text-purple-400" />
              <span className="hidden sm:inline">INVITES</span>
              {pendingRequestsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-purple-500/40">
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            {/* Level & XP Status Widget with Popover */}
            <div className="relative hidden xl:block">
              <button
                onClick={() => setShowXPPopover(!showXPPopover)}
                className="flex items-center gap-2 bg-purple-950/40 border border-purple-500/30 hover:border-purple-400/60 px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer shadow-md"
              >
                <Zap size={14} className="text-purple-400 fill-purple-400" />
                <span className="text-purple-300">Lvl {currentLevel}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-200">{currentXP} XP</span>
              </button>

              {/* XP Progress Popover */}
              {showXPPopover && (
                <div 
                  className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#140e24] border border-purple-500/30 shadow-2xl p-4 z-50 backdrop-blur-2xl"
                  onMouseLeave={() => setShowXPPopover(false)}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                    <span>Rank Progress</span>
                    <span className="text-purple-400">Level {currentLevel}</span>
                  </div>
                  <div className="w-full bg-purple-950/60 rounded-full h-2 overflow-hidden mb-2 border border-purple-500/20">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-indigo-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>{currentXP} XP</span>
                    <span>{nextLevelXP} XP (Level {currentLevel + 1})</span>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1.5 rounded-full border border-purple-500/30 bg-[#140e24] hover:border-purple-400/60 transition cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-500/30 flex items-center justify-center p-0.5 bg-slate-950 shrink-0">
                  {renderAvatar(currentUser.avatar, "w-full h-full")}
                </div>
                <div className="text-left hidden xl:block pr-1">
                  <div className="text-xs font-bold text-white leading-none truncate max-w-[90px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[9px] text-purple-300 font-medium mt-0.5 truncate max-w-[90px]">
                    {currentUser.role}
                  </div>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {/* Profile Menu Dropdown */}
              {showUserDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-3xl bg-[#140e24] border border-purple-500/30 shadow-2xl py-2 z-50 backdrop-blur-2xl"
                  onMouseLeave={() => setShowUserDropdown(false)}
                >
                  <div className="px-4 py-3 border-b border-purple-500/15">
                    <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-purple-300 font-medium truncate mt-0.5">
                      {currentUser.role} • {currentUser.college || 'SquadUP Member'}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-slate-200 hover:bg-purple-950/40 hover:text-white transition"
                    >
                      <UserIcon size={14} className="text-purple-400" />
                      <span>My Profile & Skills</span>
                    </button>

                    <div className="px-4 py-2 border-t border-purple-500/10">
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">Switch Identity Demo</p>
                      <div className="space-y-1">
                        {allUsers.slice(0, 3).map((u) => (
                          <button
                            key={u.id}
                            onClick={() => {
                              onSwitchUser(u);
                              setShowUserDropdown(false);
                            }}
                            className={`w-full text-left px-2 py-1 rounded text-[11px] flex items-center justify-between transition ${
                              u.id === currentUser.id ? 'bg-purple-950/60 text-purple-300 font-bold' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <span>{u.name} ({u.role.split(' ')[0]})</span>
                            {u.id === currentUser.id && <span className="text-[9px] text-emerald-400 font-bold">Active</span>}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-rose-400 hover:bg-rose-950/30 transition border-t border-purple-500/10 mt-1"
                    >
                      <LogOut size={14} />
                      <span>Logout Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};



