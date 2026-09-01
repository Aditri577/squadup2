import React, { useState, useEffect } from 'react';
import { User, Hackathon } from '../types';
import { Search, User as UserIcon, Trophy, Sparkles, X, ChevronRight, Zap } from 'lucide-react';
import { renderAvatar } from '../utils/avatars';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  hackathons: Hackathon[];
  onSelectUser: (user: User) => void;
  onNavigateTab: (tab: 'discovery' | 'assessment' | 'profile' | 'teams' | 'hackathons' | 'leaderboard') => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  users,
  hackathons,
  onSelectUser,
  onNavigateTab
}) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut handler (Cmd + K or Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredUsers = query.trim()
    ? users.filter(u =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.role.toLowerCase().includes(query.toLowerCase()) ||
        u.skills.some(s => s.name.toLowerCase().includes(query.toLowerCase())) ||
        u.college?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : users.slice(0, 3);

  const filteredHackathons = query.trim()
    ? hackathons.filter(h =>
        h.title.toLowerCase().includes(query.toLowerCase()) ||
        h.category?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : hackathons.slice(0, 2);

  const navigationCommands = [
    { id: 'discovery', label: 'Explore Teammates & Hackers', icon: UserIcon, tab: 'discovery' as const },
    { id: 'teams', label: 'My Squad Workspace & Kanban', icon: Sparkles, tab: 'teams' as const },
    { id: 'assessment', label: 'Take Skill Quiz & Earn Badges', icon: Zap, tab: 'assessment' as const },
    { id: 'hackathons', label: 'Browse Hackathons Directory', icon: Trophy, tab: 'hackathons' as const },
    { id: 'leaderboard', label: 'Global Leaderboard & XP Ranks', icon: Trophy, tab: 'leaderboard' as const },
  ].filter(c => !query.trim() || c.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-[#120d20] border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-purple-500/20 bg-[#161028]/60">
          <Search size={20} className="text-purple-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hackers, skills (e.g. React, Python), hackathons or commands..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none font-medium"
            autoFocus
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-3 px-2 py-1 bg-purple-950/40 border border-purple-500/20 rounded-md text-[10px] text-slate-400 uppercase font-bold"
          >
            ESC
          </button>
        </div>

        {/* Search Results Container */}
        <div className="overflow-y-auto p-4 space-y-5 custom-scrollbar">
          
          {/* Quick Navigation Commands */}
          {navigationCommands.length > 0 && (
            <div>
              <div className="text-[11px] font-bold tracking-wider text-purple-400 uppercase mb-2 px-2">
                Quick Navigation
              </div>
              <div className="space-y-1">
                {navigationCommands.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        onNavigateTab(cmd.tab);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#1a142e]/40 hover:bg-purple-900/30 border border-transparent hover:border-purple-500/30 text-left transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition">
                          <Icon size={16} />
                        </div>
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                          {cmd.label}
                        </span>
                      </div>
                      <ChevronRight size={14} className="text-slate-500 group-hover:text-purple-400 transition" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matching Hackers / Teammates */}
          {filteredUsers.length > 0 && (
            <div>
              <div className="text-[11px] font-bold tracking-wider text-purple-400 uppercase mb-2 px-2 flex justify-between items-center">
                <span>Hackers & Potential Teammates</span>
                <span className="text-slate-500 font-normal text-[10px]">{filteredUsers.length} found</span>
              </div>
              <div className="space-y-1.5">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      onSelectUser(user);
                      onNavigateTab('discovery');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#1a142e]/30 hover:bg-purple-900/30 border border-transparent hover:border-purple-500/30 text-left transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-purple-500/30 p-0.5 bg-slate-900 shrink-0">
                        {renderAvatar(user.avatar, "w-full h-full")}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{user.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                            {user.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{user.college || 'Engineering'}</span>
                          <span>•</span>
                          <span className="text-purple-300 font-medium">{user.skills.slice(0, 3).map(s => s.name).join(', ')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-400">{user.matchScore || 90}% Match</div>
                      <div className="text-[10px] text-slate-500">View Profile</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Hackathons */}
          {filteredHackathons.length > 0 && (
            <div>
              <div className="text-[11px] font-bold tracking-wider text-purple-400 uppercase mb-2 px-2">
                Hackathons
              </div>
              <div className="space-y-1.5">
                {filteredHackathons.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => {
                      onNavigateTab('hackathons');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#1a142e]/30 hover:bg-purple-900/30 border border-transparent hover:border-purple-500/30 text-left transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                        <Trophy size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{h.title}</div>
                        <div className="text-[10px] text-slate-400">{h.organizer} • Prize: {h.prizePool}</div>
                      </div>
                    </div>
                    <span className="text-xs text-purple-300 font-medium group-hover:translate-x-1 transition">
                      View →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && filteredUsers.length === 0 && filteredHackathons.length === 0 && navigationCommands.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs">
              No hackers, hackathons, or commands found matching "<span className="text-white">{query}</span>"
            </div>
          )}

        </div>

        {/* Footer Hint */}
        <div className="px-5 py-2.5 border-t border-purple-500/20 bg-[#0e0a1a] flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-purple-950 border border-purple-500/30 text-purple-300 font-mono text-[10px]">ESC</kbd>
            <span>Close</span>
          </div>
          <div className="flex items-center gap-1 text-purple-400 font-semibold">
            <Sparkles size={12} />
            <span>SquadUP Command Hub</span>
          </div>
        </div>
      </div>
    </div>
  );
};
