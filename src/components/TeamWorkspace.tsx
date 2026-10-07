import React, { useState } from 'react';
import { User, Team, UserRole, AIProjectIdea } from '../types';
import { BadgePill } from './BadgePill';
import { KanbanBoard } from './KanbanBoard';
import { AIPitchGenerator } from './AIPitchGenerator';
import { TeamChatSimulator } from './TeamChatSimulator';
import { 
  Presentation, 
  MessageSquare, 
  LayoutGrid, 
  Sparkles, 
  Users, 
  Plus, 
  Cpu, 
  Lightbulb, 
  Zap, 
  ChevronRight,
  Star
} from 'lucide-react';
import { renderAvatar } from '../utils/avatars';

interface TeamWorkspaceProps {
  currentUser: User;
  allUsers: User[];
  activeTeam: Team | null;
  onCreateTeam: (newTeam: Omit<Team, 'id' | 'createdAt'>) => void;
  onNavigateToDiscoveryWithRole: (role: UserRole) => void;
  onSendFeedback: (feedback: { senderId: string; senderName: string; receiverId: string; teamId: string; rating: number; comment: string; tags: string[] }) => Promise<void>;
}

export const TeamWorkspace: React.FC<TeamWorkspaceProps> = ({
  currentUser,
  allUsers,
  activeTeam,
  onCreateTeam,
  onNavigateToDiscoveryWithRole,
  onSendFeedback
}) => {
  const [workspaceTab, setWorkspaceTab] = useState<'overview' | 'kanban' | 'pitch' | 'chat' | 'feedback'>('overview');
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [hackathonName, setHackathonName] = useState('AI Innovations Global Hackathon 2026');
  const [description, setDescription] = useState('');

  // Teammate Feedback Endorsement States
  const [selectedReviewee, setSelectedReviewee] = useState<User | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState<boolean>(false);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReviewee || !activeTeam) return;
    setIsSubmittingFeedback(true);
    try {
      await onSendFeedback({
        senderId: currentUser.id,
        senderName: currentUser.name,
        receiverId: selectedReviewee.id,
        teamId: activeTeam.id,
        rating: feedbackRating,
        comment: feedbackComment,
        tags: selectedTags
      });
      setSelectedReviewee(null);
      setFeedbackComment('');
      setSelectedTags([]);
      setFeedbackRating(5);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // AI Project Generator State
  const [aiIdeas, setAiIdeas] = useState<AIProjectIdea[]>([]);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);

  // Get full member objects
  const teamMembersWithUsers = activeTeam ? activeTeam.members.map(m => ({
    member: m,
    user: allUsers.find(u => u.id === m.userId) || currentUser
  })) : [];

  const teamUsersOnly = teamMembersWithUsers.map(tm => tm.user);

  // Determine Missing Roles
  const currentRolesInTeam = teamMembersWithUsers.map(tm => tm.user.role);
  const missingCoreRoles = ['Frontend Developer', 'Backend Developer', 'AI/ML Engineer', 'UI/UX Designer'].filter(
    r => !currentRolesInTeam.includes(r as UserRole)
  );

  // Generate AI Project Ideas using Gemini endpoint
  const handleGenerateProjectIdeas = async () => {
    if (!activeTeam) return;
    setIsGeneratingIdeas(true);

    try {
      const teamSummary = teamMembersWithUsers.map(tm => ({
        name: tm.user.name,
        role: tm.user.role,
        skills: tm.user.skills
      }));

      const res = await fetch('/api/ai/project-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hackathonTitle: activeTeam.hackathonName,
          hackathonDomain: 'AI/GenAI & Full Stack',
          teamMembers: teamSummary
        })
      });

      const data = await res.json();
      if (data.ideas && Array.isArray(data.ideas)) {
        setAiIdeas(data.ideas);
      }
    } catch (err) {
      console.error('Failed to generate ideas:', err);
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName) return;

    onCreateTeam({
      name: teamName,
      hackathonId: 'hack-1',
      hackathonName,
      description,
      leaderId: currentUser.id,
      members: [
        {
          userId: currentUser.id,
          role: currentUser.role,
          joinedAt: new Date().toISOString().split('T')[0],
          isLeader: true
        }
      ],
      lookingForRoles: missingCoreRoles as UserRole[]
    });

    setShowCreateTeam(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            Team Workspace & AI Suite
            <Sparkles size={22} className="text-purple-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Sprint board, AI pitch deck generator, squad chat co-pilot, and skill balance matrix.
          </p>
        </div>

        {!activeTeam && (
          <button
            onClick={() => setShowCreateTeam(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg glow-cyan cursor-pointer shrink-0"
          >
            <Plus size={16} />
            <span>Create New Team</span>
          </button>
        )}
      </div>

      {/* ACTIVE TEAM WORKSPACE */}
      {activeTeam ? (
        <div className="space-y-6">
          
          {/* Team Header Banner */}
          <div className="nixtio-card p-6 sm:p-8 text-white space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase px-3.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                  Active Squad Workspace
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                  {activeTeam.name}
                </h2>
                <p className="text-xs text-purple-200/80 mt-1 font-medium">
                  Participating in: <strong>{activeTeam.hackathonName}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 bg-[#0b0813] px-5 py-2.5 rounded-full border border-white/10 text-xs font-bold text-white">
                <Users size={16} className="text-purple-400" />
                <span>{activeTeam.members.length} Members Active</span>
              </div>
            </div>

            {/* Sub-Tab Navigation Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-purple-500/10">
              <button
                onClick={() => setWorkspaceTab('overview')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  workspaceTab === 'overview'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-[#0b0813] text-slate-300 border border-white/10 hover:border-purple-400/40'
                }`}
              >
                <Users size={14} />
                Overview & Matrix
              </button>

              <button
                onClick={() => setWorkspaceTab('kanban')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  workspaceTab === 'kanban'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-[#0b0813] text-slate-300 border border-white/10 hover:border-purple-400/40'
                }`}
              >
                <LayoutGrid size={14} />
                Sprint Kanban Board
              </button>

              <button
                onClick={() => setWorkspaceTab('pitch')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  workspaceTab === 'pitch'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-[#0b0813] text-slate-300 border border-white/10 hover:border-purple-400/40'
                }`}
              >
                <Presentation size={14} />
                AI Pitch & README Generator
              </button>

              <button
                onClick={() => setWorkspaceTab('chat')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  workspaceTab === 'chat'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-[#0b0813] text-slate-300 border border-white/10 hover:border-purple-400/40'
                }`}
              >
                <MessageSquare size={14} />
                Squad Chat & AI Co-Pilot
              </button>

              <button
                onClick={() => setWorkspaceTab('feedback')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  workspaceTab === 'feedback'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-[#0b0813] text-slate-300 border border-white/10 hover:border-purple-400/40'
                }`}
              >
                <Star size={14} />
                Endorse Teammates
              </button>
            </div>
          </div>

          {/* TAB 1: OVERVIEW & MATRIX */}
          {workspaceTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Col (2 cols): Members Roster */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <Users size={18} className="text-cyan-400" />
                      <span>Team Roster & Verified Badges</span>
                    </h3>
                    <span className="text-xs text-slate-400">
                      {teamMembersWithUsers.length} Active Members
                    </span>
                  </div>

                  <div className="space-y-4">
                    {teamMembersWithUsers.map(({ member, user }) => (
                      <div key={user.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-0.5 bg-slate-950 shrink-0">
                              {renderAvatar(user.avatar, "w-full h-full")}
                            </div>
                            <div>
                              <div className="font-bold text-white text-sm flex items-center gap-2">
                                {user.name}
                                {member.isLeader && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                    Leader
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-cyan-400 font-semibold">
                                {user.role} • {user.college}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Verified Badges list */}
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-900">
                          {user.skills.map(sk => (
                            <div key={sk.id} className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800 text-xs font-semibold">
                              <span className="text-slate-300">{sk.name}</span>
                              <BadgePill level={sk.badgeLevel} scorePercent={sk.scorePercent} size="sm" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Project Idea Generator */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="font-bold text-white text-base flex items-center gap-2">
                        <Sparkles size={18} className="text-purple-400" />
                        <span>AI Project Concept Generator</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Tailored concepts based on team verified skill badges.
                      </p>
                    </div>

                    <button
                      onClick={handleGenerateProjectIdeas}
                      disabled={isGeneratingIdeas}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md glow-purple disabled:opacity-50 shrink-0 cursor-pointer"
                    >
                      <Cpu size={15} />
                      <span>{isGeneratingIdeas ? 'Synthesizing Ideas...' : 'Generate Project Concepts'}</span>
                    </button>
                  </div>

                  {aiIdeas.length > 0 ? (
                    <div className="space-y-4">
                      {aiIdeas.map((idea, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-purple-950/40 border border-purple-800/60 space-y-3 glow-purple">
                          <div className="flex items-start justify-between">
                            <h4 className="font-extrabold text-white text-sm">
                              💡 {idea.title}
                            </h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-900 text-purple-300 border border-purple-700">
                              {idea.complexity}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed">
                            {idea.description}
                          </p>

                          <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-purple-900">
                            <div className="flex flex-wrap gap-1">
                              {idea.techStack.map(ts => (
                                <span key={ts} className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-purple-300 border border-purple-800">
                                  {ts}
                                </span>
                              ))}
                            </div>
                            <span className="text-[11px] font-semibold text-slate-400 mt-1 sm:mt-0">
                              {idea.impact}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-slate-950/60 rounded-2xl border border-dashed border-slate-800 text-xs text-slate-400 space-y-2">
                      <Lightbulb size={24} className="mx-auto text-purple-400" />
                      <p>Click "Generate Project Concepts" to synthesize Gemini AI ideas using your team's skills.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Col: Skill Balance Matrix */}
              <div className="space-y-6">
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Zap size={16} className="text-amber-400" />
                    <span>Team Skill Balance Matrix</span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    {['Frontend Developer', 'Backend Developer', 'AI/ML Engineer', 'UI/UX Designer', 'DevOps Engineer'].map(role => {
                      const coveredMember = teamMembersWithUsers.find(tm => tm.user.role === role);
                      return (
                        <div key={role} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                          <div>
                            <span className="font-bold text-slate-200 block">
                              {role}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {coveredMember ? coveredMember.user.name : 'Not Covered'}
                            </span>
                          </div>

                          {coveredMember ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                              Covered
                            </span>
                          ) : (
                            <button
                              onClick={() => onNavigateToDiscoveryWithRole(role as UserRole)}
                              className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-bold border border-rose-500/30 transition flex items-center gap-1 cursor-pointer"
                            >
                              <span>Find Candidate</span>
                              <ChevronRight size={12} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SPRINT KANBAN */}
          {workspaceTab === 'kanban' && (
            <KanbanBoard teamMembers={teamUsersOnly} hackathonName={activeTeam.hackathonName} />
          )}

          {/* TAB 3: AI PITCH DECK & README */}
          {workspaceTab === 'pitch' && (
            <AIPitchGenerator team={activeTeam} members={teamUsersOnly} />
          )}

          {/* TAB 4: SQUAD CHAT & CO-PILOT */}
          {workspaceTab === 'chat' && (
            <TeamChatSimulator currentUser={currentUser} team={activeTeam} members={teamUsersOnly} />
          )}

          {/* TAB 5: TEAMMATE FEEDBACK */}
          {workspaceTab === 'feedback' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 animate-fade-in">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Star className="text-amber-400 fill-amber-400 animate-pulse" size={18} />
                  <span>Teammate Feedback & Endorsement Desk</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Rate your squad members to award them XP rewards and increase their global leaderboard ranking.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamMembersWithUsers
                  .filter(tm => tm.user.id !== currentUser.id)
                  .map(({ member, user }) => (
                    <div key={user.id} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-0.5 bg-slate-900 shrink-0">
                          {renderAvatar(user.avatar, "w-full h-full")}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-white text-sm">{user.name}</h4>
                          <p className="text-xs text-purple-400 font-semibold">{user.role}</p>
                          <p className="text-[10px] text-slate-500">{user.college}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-900 pt-3">
                        <div className="flex items-center gap-1.5 text-xs text-purple-300">
                          <Zap size={14} className="text-purple-400" />
                          <span>Level {user.level || 1} • {user.xpPoints || 100} XP</span>
                        </div>

                        <button
                          onClick={() => setSelectedReviewee(user)}
                          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition cursor-pointer"
                        >
                          Endorse Teammate
                        </button>
                      </div>
                    </div>
                  ))}
                
                {teamMembersWithUsers.filter(tm => tm.user.id !== currentUser.id).length === 0 && (
                  <div className="col-span-2 text-center py-8 bg-slate-950/60 rounded-2xl border border-dashed border-slate-800 text-xs text-slate-400">
                    You are the only member in this team right now. Invite developers to unlock endorsements!
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      ) : (
        /* NO TEAM STATE */
        <div className="text-center py-16 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 p-8 space-y-4 max-w-xl mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto text-3xl font-bold border border-cyan-500/30 glow-cyan">
            🚀
          </div>
          <h2 className="text-xl font-bold text-white">
            You are not in a team yet
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Create a team to manage member skill matrices, invite candidates with verified badges, and generate AI hackathon project ideas.
          </p>

          <button
            onClick={() => setShowCreateTeam(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-xs shadow-lg glow-cyan inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            <span>Create New Team</span>
          </button>
        </div>
      )}

      {/* CREATE TEAM MODAL */}
      {showCreateTeam && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-white">
              Create New Hackathon Team
            </h3>

            <form onSubmit={handleCreateTeamSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Team Nexus"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Target Hackathon
                </label>
                <input
                  type="text"
                  value={hackathonName}
                  onChange={(e) => setHackathonName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Team Pitch / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Short outline of your team goals..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateTeam(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 text-xs font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs glow-cyan"
                >
                  Launch Team Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEAMMATE ENDORSEMENT SUBMISSION MODAL */}
      {selectedReviewee && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0915] border border-purple-500/30 rounded-[28px] max-w-md w-full p-6 sm:p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative animate-fade-in">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden border-2 border-purple-500/40 p-0.5 bg-slate-900 flex items-center justify-center">
                {renderAvatar(selectedReviewee.avatar, "w-full h-full")}
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Endorse {selectedReviewee.name}
              </h3>
              <p className="text-xs text-slate-400">
                Provide honest teammate feedback. You earn <strong className="text-purple-400">+50 XP</strong> and they receive <strong className="text-purple-400">+100 XP</strong>!
              </p>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              {/* Star Rating */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-purple-300 uppercase tracking-wider text-center">
                  Teammate Rating ({feedbackRating} Stars)
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className="text-2xl transition cursor-pointer hover:scale-110"
                    >
                      <Star 
                        className={`w-8 h-8 ${
                          star <= feedbackRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Predefined Endorsement Tags */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                  Select Endorsement Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "🚀 Tech Wizard",
                    "🗣️ Great Speaker",
                    "🎨 UI/UX Maestro",
                    "🤝 Super Helpful",
                    "📅 Time Manager",
                    "🎯 Problem Solver"
                  ].map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition cursor-pointer ${
                          isSelected 
                            ? 'bg-purple-600 text-white border-purple-500'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-purple-500/40'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Review Comment */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                  Write Endorsement Comment
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Worked day and night to set up our entire CI/CD and database schema. A real technical powerhouse..."
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedReviewee(null);
                    setFeedbackComment('');
                    setSelectedTags([]);
                    setFeedbackRating(5);
                  }}
                  className="flex-1 py-2.5 rounded-full border border-white/10 hover:bg-white/5 text-xs text-slate-300 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingFeedback}
                  className="flex-1 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-xs text-white font-bold transition cursor-pointer shadow-lg shadow-purple-500/20 disabled:opacity-50"
                >
                  {isSubmittingFeedback ? 'Submitting...' : 'Submit Endorsement'}
                </button>
              </div>
            </form>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedReviewee(null)}
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

