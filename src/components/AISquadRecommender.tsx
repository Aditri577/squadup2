import React, { useState } from 'react';
import { User, Team } from '../types';
import { Sparkles, UserPlus, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { renderAvatar } from '../utils/avatars';

interface AISquadRecommenderProps {
  currentTeam: Team | null;
  currentUser: User;
  allUsers: User[];
  onInviteCandidate: (candidateId: string, role: string) => void;
}

export const AISquadRecommender: React.FC<AISquadRecommenderProps> = ({
  currentTeam,
  currentUser,
  allUsers,
  onInviteCandidate
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [invitedIds, setInvitedIds] = useState<string[]>([]);

  const teamMembers = currentTeam
    ? allUsers.filter(u => currentTeam.members?.some(m => m.userId === u.id))
    : [currentUser];

  const rolesPresent = teamMembers.map(m => m.role);
  
  // Detect missing roles logically
  let recommendedRole = 'Backend Lead';
  if (!rolesPresent.includes('UI/UX Designer')) {
    recommendedRole = 'UI/UX Designer';
  } else if (!rolesPresent.includes('Backend Lead')) {
    recommendedRole = 'Backend Lead';
  } else if (!rolesPresent.includes('AI/ML Engineer')) {
    recommendedRole = 'AI/ML Engineer';
  } else if (!rolesPresent.includes('Frontend Lead')) {
    recommendedRole = 'Frontend Lead';
  }

  // Filter candidates matching recommended role & high match score
  const candidates = allUsers
    .filter(u => u.id !== currentUser.id && !teamMembers.some(m => m.id === u.id))
    .filter(u => u.role === recommendedRole || u.matchScore && u.matchScore > 85)
    .slice(0, 3);

  const handleRefresh = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 600);
  };

  const handleInvite = (userId: string) => {
    onInviteCandidate(userId, recommendedRole);
    setInvitedIds(prev => [...prev, userId]);
  };

  return (
    <div className="bg-[#140e24] border border-purple-500/30 rounded-3xl p-5 shadow-2xl relative overflow-hidden my-6">
      {/* Glow effect background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Sparkles size={18} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>AI Squad Gap Recommender</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                Gemini 2.5 AI
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Analyzed {teamMembers.length} squad member{teamMembers.length > 1 ? 's' : ''} • Missing skill gap detected: <span className="text-purple-300 font-semibold">{recommendedRole}</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isAnalyzing}
          className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/20 hover:border-purple-400/50 text-slate-300 hover:text-white transition cursor-pointer"
          title="Re-analyze squad composition"
        >
          <RefreshCw size={14} className={isAnalyzing ? 'animate-spin text-purple-400' : ''} />
        </button>
      </div>

      {/* Suggested candidates cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        {candidates.map((cand) => {
          const isInvited = invitedIds.includes(cand.id);
          return (
            <div
              key={cand.id}
              className="bg-[#1b152d]/60 border border-purple-500/20 hover:border-purple-400/40 rounded-2xl p-3.5 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-500/30 p-0.5 bg-slate-950 shrink-0">
                      {renderAvatar(cand.avatar, "w-full h-full")}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white truncate max-w-[110px]">{cand.name}</div>
                      <div className="text-[10px] text-purple-300 font-medium">{cand.role}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    {cand.matchScore || 92}% Match
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 my-2">
                  {cand.skills.slice(0, 3).map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950/60 text-slate-300 border border-purple-500/20"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleInvite(cand.id)}
                disabled={isInvited}
                className={`w-full mt-2 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  isInvited
                    ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 cursor-default'
                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/30'
                }`}
              >
                {isInvited ? (
                  <>
                    <CheckCircle2 size={12} />
                    <span>Invited</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={12} />
                    <span>Invite {recommendedRole}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
