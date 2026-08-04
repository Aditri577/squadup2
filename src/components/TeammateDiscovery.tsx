import React, { useState } from 'react';
import { User, UserRole, BadgeLevel, TeamRequest } from '../types';
import { BadgePill } from './BadgePill';
import { 
  Search, 
  Filter, 
  UserPlus, 
  Sparkles, 
  ExternalLink, 
  MapPin, 
  GraduationCap, 
  ShieldCheck, 
  Send, 
  X, 
  Check, 
  UserCheck,
  Star,
  Zap,
  Info
} from 'lucide-react';

interface TeammateDiscoveryProps {
  currentUser: User;
  allUsers: User[];
  onSelectUser: (user: User) => void;
  onSendTeamRequest: (request: Omit<TeamRequest, 'id' | 'createdAt' | 'status'>) => void;
  activeTeamName?: string;
  activeHackathonName?: string;
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

export const TeammateDiscovery: React.FC<TeammateDiscoveryProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
  onSendTeamRequest,
  activeTeamName = 'Team Nexus',
  activeHackathonName = 'AI Innovations Global Hackathon 2026'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [badgeFilter, setBadgeFilter] = useState<string>('all');
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [onlyLookingForTeam, setOnlyLookingForTeam] = useState(true);

  // Invitation Modal State
  const [inviteUser, setInviteUser] = useState<User | null>(null);
  const [proposedRole, setProposedRole] = useState<UserRole>('Backend Developer');
  const [inviteMessage, setInviteMessage] = useState('');
  const [aiMatchAnalysis, setAiMatchAnalysis] = useState<string | null>(null);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);

  // Filter users
  const filteredUsers = allUsers.filter(u => {
    if (u.id === currentUser.id) return false; // Don't show self in discovery

    if (onlyLookingForTeam && !u.lookingForTeam) return false;

    // Search query
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchCollege = u.college.toLowerCase().includes(q);
      const matchRole = u.role.toLowerCase().includes(q);
      const matchSkill = u.skills.some(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
      if (!matchName && !matchCollege && !matchRole && !matchSkill) return false;
    }

    // Role Filter
    if (selectedRole !== 'all' && u.role !== selectedRole) return false;

    // Badge Filter
    if (badgeFilter === 'green') {
      const hasGreen = u.skills.some(s => s.badgeLevel === 'Green');
      if (!hasGreen) return false;
    } else if (badgeFilter === 'yellow_plus') {
      const hasYellowOrGreen = u.skills.some(s => s.badgeLevel === 'Green' || s.badgeLevel === 'Yellow');
      if (!hasYellowOrGreen) return false;
    }

    // Domain Filter
    if (domainFilter !== 'all' && !u.preferredDomains.includes(domainFilter)) return false;

    return true;
  });

  // Calculate compatibility score (heuristic based on complementary skills & badges)
  const calculateMatchScore = (u: User) => {
    let score = 65; // Base score
    // Bonus for verified Green badges
    const greenCount = u.skills.filter(s => s.badgeLevel === 'Green').length;
    score += greenCount * 10;

    // Bonus for complementary role
    if (u.role !== currentUser.role) score += 10;

    // Shared domain
    const sharedDomains = u.preferredDomains.filter(d => currentUser.preferredDomains.includes(d));
    score += sharedDomains.length * 5;

    return Math.min(99, score);
  };

  // Trigger AI Match Analysis endpoint for invitation modal
  const handleFetchAiMatchAnalysis = async (candidate: User) => {
    setIsAnalyzingAi(true);
    setAiMatchAnalysis(null);

    try {
      const res = await fetch('/api/ai/match-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate,
          teamSkillGaps: [proposedRole],
          hackathonTitle: activeHackathonName
        })
      });
      const data = await res.json();
      setAiMatchAnalysis(data.analysis || 'High compatibility candidate for your team.');
    } catch (err) {
      setAiMatchAnalysis(`${candidate.name} is a strong candidate with verified badges in ${candidate.skills.map(s => s.name).join(', ')}.`);
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  const openInviteModal = (candidate: User) => {
    setInviteUser(candidate);
    setProposedRole(candidate.role);
    setInviteMessage(`Hey ${candidate.name.split(' ')[0]}! We saw your verified skills on SquadUP and would love to have you on ${activeTeamName} for ${activeHackathonName}.`);
    handleFetchAiMatchAnalysis(candidate);
  };

  const handleSendInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteUser) return;

    onSendTeamRequest({
      teamId: currentUser.teamId || 'team-squadup-core',
      teamName: activeTeamName,
      hackathonName: activeHackathonName,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role,
      receiverId: inviteUser.id,
      proposedRole,
      message: inviteMessage
    });

    alert(`Team Invitation sent to ${inviteUser.name}!`);
    setInviteUser(null);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title & Stats Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Discover Verified Teammates
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Find hackers with proven, proctored skill badges rather than self-claimed ratings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>{allUsers.reduce((acc, u) => acc + u.skills.filter(s => s.badgeLevel === 'Green').length, 0)} Green Badges Verified</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        
        <div className="flex flex-col lg:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by candidate name, college, or skill (e.g. React, PyTorch, SQL)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Role Dropdown */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            <option value="all">All Roles</option>
            {ROLES.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {/* Badge Filter */}
          <select
            value={badgeFilter}
            onChange={(e) => setBadgeFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            <option value="all">All Verification Levels</option>
            <option value="green">🟢 Green Badge Only (Advanced 80%+)</option>
            <option value="yellow_plus">🟡 Yellow+ Badge (70%+)</option>
          </select>

          {/* Domain Filter */}
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            <option value="all">All Domains</option>
            <option value="AI/GenAI">AI / GenAI</option>
            <option value="FinTech">FinTech</option>
            <option value="HealthTech">HealthTech</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="EdTech">EdTech</option>
            <option value="Web3">Web3</option>
          </select>

        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">
            <input
              type="checkbox"
              checked={onlyLookingForTeam}
              onChange={(e) => setOnlyLookingForTeam(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Show candidates currently looking for a team</span>
          </label>

          <span className="text-slate-400 font-medium">
            Showing {filteredUsers.length} available teammates
          </span>
        </div>

      </div>

      {/* Teammate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => {
          const matchScore = calculateMatchScore(user);
          const greenBadges = user.skills.filter(s => s.badgeLevel === 'Green');

          return (
            <div
              key={user.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5 relative group"
            >
              {/* Compatibility Match Badge */}
              <div className="absolute top-5 right-5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold">
                <Zap size={12} className="text-amber-500 fill-amber-500" />
                <span>{matchScore}% Match</span>
              </div>

              {/* User Identity & Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/20 shrink-0"
                  />
                  <div>
                    <h3 
                      onClick={() => onSelectUser(user)}
                      className="font-bold text-slate-900 dark:text-white text-base hover:text-indigo-600 cursor-pointer transition-colors"
                    >
                      {user.name}
                    </h3>
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {user.role}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <GraduationCap size={13} />
                      {user.college}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {user.bio}
                </p>

                {/* Verified Skills Section */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <span>Verified Skill Badges</span>
                    <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">
                      {greenBadges.length} Proctored
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {user.skills.map(sk => (
                      <div key={sk.id} className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 px-1">
                          {sk.name}
                        </span>
                        <BadgePill level={sk.badgeLevel} scorePercent={sk.scorePercent} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preferred Domains tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {user.preferredDomains.map(dom => (
                    <span key={dom} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                      #{dom}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                <button
                  onClick={() => onSelectUser(user)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors text-center"
                >
                  View Profile
                </button>

                <button
                  onClick={() => openInviteModal(user)}
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <UserPlus size={14} />
                  <span>Invite to Team</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <div className="text-4xl">🔍</div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            No matching candidates found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Try resetting your search query or selecting "All Verification Levels" to broaden your search.
          </p>
        </div>
      )}

      {/* TEAM INVITATION MODAL */}
      {inviteUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img src={inviteUser.avatar} alt={inviteUser.name} className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Invite {inviteUser.name}
                  </h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                    To Join {activeTeamName}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setInviteUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* AI Strategic Recommendation Box */}
            <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800 text-xs space-y-2">
              <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-200 font-bold">
                <Sparkles size={15} className="text-indigo-600" />
                <span>AI Teammate Fit Advisor</span>
              </div>
              {isAnalyzingAi ? (
                <div className="text-slate-500 animate-pulse">Analyzing candidate skill matrix...</div>
              ) : (
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {aiMatchAnalysis}
                </p>
              )}
            </div>

            <form onSubmit={handleSendInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Proposed Team Role
                </label>
                <select
                  value={proposedRole}
                  onChange={(e) => setProposedRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  {ROLES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Custom Pitch Message
                </label>
                <textarea
                  rows={3}
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setInviteUser(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-500/20"
                >
                  <Send size={14} />
                  <span>Send Official Invitation</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
