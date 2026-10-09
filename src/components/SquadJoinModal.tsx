import React, { useState } from 'react';
import { User, Team, UserRole } from '../types';
import { BadgePill } from './BadgePill';
import { useToast } from './Toast';
import { api } from '../utils/api';
import { 
  X, 
  Users, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  ShieldAlert,
  Search,
  Check
} from 'lucide-react';

interface SquadJoinModalProps {
  currentUser: User;
  allUsers: User[];
  teams: Team[];
  isOpen: boolean;
  onClose: () => void;
  onJoinTeam: (teamId: string, inviteCode?: string) => Promise<void> | void;
  onNavigateToAssessment: () => void;
  initialCode?: string;
}

export const SquadJoinModal: React.FC<SquadJoinModalProps> = ({
  currentUser,
  allUsers,
  teams,
  isOpen,
  onClose,
  onJoinTeam,
  onNavigateToAssessment,
  initialCode = ''
}) => {
  const toast = useToast();
  const [inviteCodeInput, setInviteCodeInput] = useState(initialCode);
  const [matchedTeam, setMatchedTeam] = useState<Team | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialCode) {
      setInviteCodeInput(initialCode);
    }
  }, [initialCode]);

  if (!isOpen) return null;

  // Check if candidate has ANY verified badge
  const verifiedSkills = currentUser.skills.filter(s => s.badgeLevel !== 'Unverified');
  const hasVerifiedBadge = verifiedSkills.length > 0 || (currentUser.testResults?.length ?? 0) > 0;
  const bestBadge = verifiedSkills.find(s => s.badgeLevel === 'Green') 
    || verifiedSkills.find(s => s.badgeLevel === 'Yellow') 
    || verifiedSkills.find(s => s.badgeLevel === 'Red') 
    || null;

  const handleSearchCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = inviteCodeInput.trim().toUpperCase();
    if (!cleanCode) return;

    setIsSearching(true);
    setErrorMsg(null);

    try {
      // Find team with matching code or team id
      let found = teams.find(t => t.inviteCode?.toUpperCase() === cleanCode) 
        || teams.find(t => t.id.toUpperCase() === cleanCode)
        || teams.find(t => t.id.toLowerCase().includes(cleanCode.toLowerCase()));

      // If not found in current props, fetch fresh teams from backend state
      if (!found) {
        try {
          const fresh = await api<{ teams: Team[] }>('/api/state');
          if (fresh.teams && fresh.teams.length > 0) {
            found = fresh.teams.find(t => t.inviteCode?.toUpperCase() === cleanCode)
              || fresh.teams.find(t => t.id.toUpperCase() === cleanCode)
              || fresh.teams.find(t => t.id.toLowerCase().includes(cleanCode.toLowerCase()));
          }
        } catch {
          // fallback
        }
      }

      if (found) {
        setMatchedTeam(found);
      } else {
        setErrorMsg(`No squad found with code "${cleanCode}". Please check and try again.`);
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Perform AI Compatibility & Badge Matching Analysis
  const performAiAnalysis = (team: Team) => {
    const teamMembers = allUsers.filter(u => team.members.some(m => m.userId === u.id));
    const memberRoles = teamMembers.map(m => m.role);
    const candidateRole = currentUser.role;

    // Redundant role warning
    const roleCount = memberRoles.filter(r => r === candidateRole).length;
    const isRedundantRole = roleCount >= 1;

    // Badges analysis
    const hasGreen = verifiedSkills.some(s => s.badgeLevel === 'Green');
    const hasOnlyRed = verifiedSkills.length > 0 && verifiedSkills.every(s => s.badgeLevel === 'Red');

    if (!hasVerifiedBadge) {
      return {
        type: 'BLOCKED',
        score: 35,
        title: '⚠️ Verification Required: No Skill Badges Found',
        message: 'This hackathon squad enforces anti-cheat verification. You must complete at least one proctored assessment before joining.',
        advice: 'Take the 15-minute proctored assessment for your technical domain to unlock team joining.',
        canJoin: false
      };
    }

    if (hasOnlyRed) {
      return {
        type: 'WARNING',
        score: 65,
        title: '⚠️ AI Warning: Skill Level Improvement Recommended',
        message: 'Your current skill badges are at the Red level (<70% score). This may reduce your squad’s overall hackathon leaderboard rank.',
        advice: 'You can still join, but the squad AI recommends re-assessing to earn a Yellow or Green badge.',
        canJoin: true
      };
    }

    if (isRedundantRole) {
      return {
        type: 'WARNING',
        score: 72,
        title: `⚠️ AI Compatibility Alert: Role Overlap Detected`,
        message: `This team already has ${roleCount} ${candidateRole}(s). Having multiple members in the exact same role may create tech stack imbalance.`,
        advice: `The team is specifically looking for: ${team.lookingForRoles.join(', ') || 'Backend / AI'}. Consider diversifying roles or clarifying division of tasks.`,
        canJoin: true
      };
    }

    return {
      type: 'PERFECT',
      score: hasGreen ? 96 : 88,
      title: '✨ High Synergy Match (96% Compatibility)',
      message: `Your verified ${bestBadge ? bestBadge.name : candidateRole} badge matches this squad’s technical needs perfectly!`,
      advice: 'Squad skills are balanced across Frontend, Backend, and Design. Ready to build and compete!',
      canJoin: true
    };
  };

  const aiAnalysis = matchedTeam ? performAiAnalysis(matchedTeam) : null;

  const handleConfirmJoin = async () => {
    if (!matchedTeam) return;
    if (!hasVerifiedBadge) {
      toast.error('You must earn a verified skill badge before joining this team!');
      onNavigateToAssessment();
      onClose();
      return;
    }
    setIsJoining(true);
    try {
      await onJoinTeam(matchedTeam.id, matchedTeam.inviteCode || matchedTeam.id);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to join squad');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0e0a1a] border border-purple-500/30 rounded-3xl shadow-2xl shadow-purple-950/60 overflow-hidden text-white my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/15 bg-gradient-to-r from-purple-950/40 via-[#140e24] to-purple-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Users size={18} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                Join Squad via Invite Code
              </h2>
              <p className="text-xs text-purple-200/60">
                Enter your friend's 6-character squad code to team up
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">

          {/* CODE ENTRY FORM */}
          <form onSubmit={handleSearchCode} className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-purple-300">
              Enter Squad Invite Code:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inviteCodeInput}
                onChange={(e) => setInviteCodeInput(e.target.value)}
                placeholder="e.g. SQ-9F2A"
                className="flex-1 px-4 py-3 rounded-xl bg-[#140e24] border border-purple-500/40 text-white font-mono font-bold tracking-wider text-sm outline-none focus:border-purple-400 uppercase transition"
              />
              <button
                type="submit"
                disabled={isSearching || !inviteCodeInput.trim()}
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-500/25"
              >
                <Search size={14} />
                <span>{isSearching ? 'Checking…' : 'Inspect Squad'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-purple-300/70 pt-0.5">
              <span>Quick try sample squads:</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => { setInviteCodeInput('SQ-NEXUS'); setErrorMsg(null); }}
                  className="px-2 py-0.5 rounded bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-200 font-mono text-[10px] cursor-pointer"
                >
                  SQ-NEXUS
                </button>
                <button
                  type="button"
                  onClick={() => { setInviteCodeInput('SQ-NEURAL'); setErrorMsg(null); }}
                  className="px-2 py-0.5 rounded bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-200 font-mono text-[10px] cursor-pointer"
                >
                  SQ-NEURAL
                </button>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 font-semibold">{errorMsg}</p>
            )}
          </form>

          {/* SQUAD PREVIEW & AI COMPATIBILITY */}
          {matchedTeam && aiAnalysis && (
            <div className="space-y-5 animate-fade-in border-t border-purple-500/15 pt-5">
              
              {/* Squad Details Card */}
              <div className="p-4 rounded-2xl bg-[#140e24] border border-purple-500/30 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                      {matchedTeam.hackathonName}
                    </span>
                    <h3 className="text-lg font-black text-white">{matchedTeam.name}</h3>
                    <p className="text-xs text-purple-200/70 mt-0.5">{matchedTeam.description}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-bold">
                    {matchedTeam.members.length} Members
                  </span>
                </div>

                {/* Team Members List */}
                <div className="pt-2 border-t border-purple-500/10 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-purple-300/80 block">Current Members:</span>
                  <div className="flex flex-wrap gap-2">
                    {matchedTeam.members.map(m => {
                      const u = allUsers.find(user => user.id === m.userId);
                      return (
                        <div key={m.userId} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-white/5 text-xs text-slate-200">
                          <span>{u ? u.name : 'Teammate'}</span>
                          <span className="text-[10px] text-purple-400">({m.role})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* AI SQUAD COMPATIBILITY & BADGE MATCHING WARNING BANNER */}
              <div className={`p-5 rounded-2xl border space-y-3 ${
                aiAnalysis.type === 'PERFECT'
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                  : aiAnalysis.type === 'WARNING'
                  ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                  : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {aiAnalysis.type === 'PERFECT' ? (
                      <Sparkles size={18} className="text-emerald-400" />
                    ) : (
                      <AlertTriangle size={18} className={aiAnalysis.type === 'WARNING' ? "text-amber-400" : "text-rose-400"} />
                    )}
                    <h4 className="font-extrabold text-sm text-white">{aiAnalysis.title}</h4>
                  </div>
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
                    aiAnalysis.type === 'PERFECT'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : aiAnalysis.type === 'WARNING'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}>
                    {aiAnalysis.score}% Match
                  </span>
                </div>

                <p className="text-xs leading-relaxed opacity-90">
                  {aiAnalysis.message}
                </p>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] space-y-1">
                  <span className="font-bold text-white block">💡 Squad Recommendation:</span>
                  <p className="opacity-80 leading-normal">{aiAnalysis.advice}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>

                {!hasVerifiedBadge ? (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateToAssessment();
                    }}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldAlert size={14} />
                    <span>Take Skill Assessment First</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isJoining}
                    onClick={handleConfirmJoin}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
                  >
                    <Check size={14} />
                    <span>{isJoining ? 'Joining Squad…' : 'Confirm & Team Up'}</span>
                  </button>
                )}
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
