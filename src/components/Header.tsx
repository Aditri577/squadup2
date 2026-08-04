import React from 'react';
import { User, TeamRequest } from '../types';
import { 
  Users, 
  Award, 
  UserCheck, 
  Layers, 
  Trophy, 
  Bell, 
  ChevronDown,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'discovery' | 'assessment' | 'profile' | 'teams' | 'hackathons';
  setActiveTab: (tab: 'discovery' | 'assessment' | 'profile' | 'teams' | 'hackathons') => void;
  currentUser: User;
  allUsers: User[];
  onSwitchUser: (user: User) => void;
  pendingRequestsCount: number;
  onOpenRequestsModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  allUsers,
  onSwitchUser,
  pendingRequestsCount,
  onOpenRequestsModal
}) => {
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('discovery')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-emerald-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-500/20 ring-1 ring-white/20">
              SQ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 dark:from-white dark:via-indigo-200 dark:to-blue-300 bg-clip-text text-transparent">
                  SquadUP
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Verified Teams
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden md:block">
                Build the Right Team. Build Better Ideas.
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={() => setActiveTab('discovery')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'discovery'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users size={15} />
              <span>Discover Teammates</span>
            </button>

            <button
              onClick={() => setActiveTab('assessment')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'assessment'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Award size={15} />
              <span>Skill Verification</span>
            </button>

            <button
              onClick={() => setActiveTab('teams')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'teams'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers size={15} />
              <span>Teams & Workspace</span>
            </button>

            <button
              onClick={() => setActiveTab('hackathons')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'hackathons'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Trophy size={15} />
              <span>Hackathons</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserCheck size={15} />
              <span>My Profile</span>
            </button>
          </nav>

          {/* Right Actions: Requests Bell & User Switcher */}
          <div className="flex items-center gap-3">
            
            {/* Team Invitations Bell */}
            <button
              onClick={onOpenRequestsModal}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/80 dark:border-slate-700/80"
              title="Team Invitations & Requests"
            >
              <Bell size={18} />
              {pendingRequestsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center animate-pulse">
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            {/* Profile Selector / Identity Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/30"
                />
                <div className="text-left hidden lg:block pr-1">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-none">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {currentUser.role}
                  </div>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {/* User Switcher Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch User Identity (Review Demo)
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Select a user to test profiles, team invites, and verification tests:
                    </p>
                  </div>

                  <div className="max-h-64 overflow-y-auto py-1">
                    {allUsers.map((u) => {
                      const isCurrent = u.id === currentUser.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            onSwitchUser(u);
                            setShowUserDropdown(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
                            isCurrent ? 'bg-indigo-50/70 dark:bg-indigo-950/40' : ''
                          }`}
                        >
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                              {u.name} {isCurrent && <span className="text-indigo-600 dark:text-indigo-400 text-[10px] font-semibold">(Active)</span>}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {u.role} • {u.college}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Tab bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveTab('discovery')}
            className={`flex flex-col items-center gap-0.5 p-1 ${activeTab === 'discovery' ? 'text-indigo-600 font-bold' : ''}`}
          >
            <Users size={16} />
            <span>Discover</span>
          </button>
          <button
            onClick={() => setActiveTab('assessment')}
            className={`flex flex-col items-center gap-0.5 p-1 ${activeTab === 'assessment' ? 'text-indigo-600 font-bold' : ''}`}
          >
            <Award size={16} />
            <span>Test</span>
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`flex flex-col items-center gap-0.5 p-1 ${activeTab === 'teams' ? 'text-indigo-600 font-bold' : ''}`}
          >
            <Layers size={16} />
            <span>Teams</span>
          </button>
          <button
            onClick={() => setActiveTab('hackathons')}
            className={`flex flex-col items-center gap-0.5 p-1 ${activeTab === 'hackathons' ? 'text-indigo-600 font-bold' : ''}`}
          >
            <Trophy size={16} />
            <span>Hacks</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-0.5 p-1 ${activeTab === 'profile' ? 'text-indigo-600 font-bold' : ''}`}
          >
            <UserCheck size={16} />
            <span>Profile</span>
          </button>
        </div>

      </div>
    </header>
  );
};
