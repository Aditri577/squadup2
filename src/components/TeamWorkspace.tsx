import React, { useState } from 'react';
import { User, Team, TeamMember, UserRole, AIProjectIdea } from '../types';
import { BadgePill } from './BadgePill';
import { 
  Layers, 
  Users, 
  Sparkles, 
  CheckSquare, 
  Plus, 
  AlertCircle, 
  ShieldCheck, 
  ChevronRight, 
  Zap, 
  PlusCircle, 
  Trash2,
  CheckCircle2,
  Lightbulb,
  Cpu
} from 'lucide-react';

interface TeamWorkspaceProps {
  currentUser: User;
  allUsers: User[];
  activeTeam: Team | null;
  onCreateTeam: (newTeam: Omit<Team, 'id' | 'createdAt'>) => void;
  onNavigateToDiscoveryWithRole: (role: UserRole) => void;
}

const ALL_ROLES: UserRole[] = [
  'Frontend Developer',
  'Backend Developer',
  'AI/ML Engineer',
  'UI/UX Designer',
  'Full Stack Developer',
  'Data Scientist',
  'DevOps Engineer'
];

export const TeamWorkspace: React.FC<TeamWorkspaceProps> = ({
  currentUser,
  allUsers,
  activeTeam,
  onCreateTeam,
  onNavigateToDiscoveryWithRole
}) => {
  // New Team Modal / Form State
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [hackathonName, setHackathonName] = useState('AI Innovations Global Hackathon 2026');
  const [description, setDescription] = useState('');

  // AI Project Generator State
  const [aiIdeas, setAiIdeas] = useState<AIProjectIdea[]>([]);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);

  // Sprint Todos State
  const [todos, setTodos] = useState<{ id: string; text: string; done: boolean }[]>([
    { id: '1', text: 'Verify team technical badges on SquadUP', done: true },
    { id: '2', text: 'Finalize core hackathon project architecture', done: false },
    { id: '3', text: 'Design high-fidelity UI Figma prototype', done: false },
    { id: '4', text: 'Connect Gemini server endpoint & backend API', done: false }
  ]);
  const [newTodoText, setNewTodoText] = useState('');

  // Get full member objects
  const teamMembersWithUsers = activeTeam ? activeTeam.members.map(m => ({
    member: m,
    user: allUsers.find(u => u.id === m.userId) || currentUser
  })) : [];

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
      // Fallback
      setAiIdeas([
        {
          title: 'SquadUP AI Skill Matcher',
          description: 'Automated hackathon team formation tool with proctored skill tests.',
          techStack: ['React', 'Express', 'Gemini AI'],
          complexity: 'Advanced',
          impact: 'High - Solves team formation trust'
        }
      ]);
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    setTodos(prev => [...prev, { id: Date.now().toString(), text: newTodoText, done: false }]);
    setNewTodoText('');
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
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
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Team Workspace & Skill Balance Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Analyze team skill coverage, detect missing roles, and generate AI project concepts.
          </p>
        </div>

        {!activeTeam && (
          <button
            onClick={() => setShowCreateTeam(true)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-500/20"
          >
            <Plus size={16} />
            <span>Create New Team</span>
          </button>
        )}
      </div>

      {/* ACTIVE TEAM WORKSPACE */}
      {activeTeam ? (
        <div className="space-y-8">
          
          {/* Team Overview Card */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Active Team Workspace
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                  {activeTeam.name}
                </h2>
                <p className="text-xs text-indigo-200 mt-1">
                  Participating in: <strong>{activeTeam.hackathonName}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700/80 text-xs font-semibold">
                <Users size={16} className="text-indigo-400" />
                <span>{activeTeam.members.length} Members Registered</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {activeTeam.description}
            </p>
          </div>

          {/* Team Roster & Skill Balance Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col (2 cols): Members Roster & Verified Badges */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <Users size={18} className="text-indigo-600" />
                    <span>Team Roster & Verified Skills</span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    {teamMembersWithUsers.length} Members
                  </span>
                </div>

                <div className="space-y-4">
                  {teamMembersWithUsers.map(({ member, user }) => (
                    <div key={user.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                              {user.name}
                              {member.isLeader && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                                  Team Leader
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                              {user.role} • {user.college}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Verified Badges list */}
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                        {user.skills.map(sk => (
                          <div key={sk.id} className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
                            <span>{sk.name}</span>
                            <BadgePill level={sk.badgeLevel} scorePercent={sk.scorePercent} size="sm" />
                          </div>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* AI Project Idea Generator Section */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                      <Sparkles size={18} className="text-indigo-600" />
                      <span>AI Project Idea Generator</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Generate winning hackathon concepts tailored specifically to your team's verified skills
                    </p>
                  </div>

                  <button
                    onClick={handleGenerateProjectIdeas}
                    disabled={isGeneratingIdeas}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20 disabled:opacity-50 shrink-0"
                  >
                    <Cpu size={15} />
                    <span>{isGeneratingIdeas ? 'Synthesizing Ideas...' : 'Generate Project Concepts'}</span>
                  </button>
                </div>

                {/* Ideas Output */}
                {aiIdeas.length > 0 ? (
                  <div className="space-y-4">
                    {aiIdeas.map((idea, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/80 space-y-3">
                        <div className="flex items-start justify-between">
                          <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                            💡 {idea.title}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                            {idea.complexity}
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {idea.description}
                        </p>

                        <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-indigo-200/60 dark:border-indigo-800/60">
                          <div className="flex flex-wrap gap-1">
                            {idea.techStack.map(ts => (
                              <span key={ts} className="text-[10px] font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700">
                                {ts}
                              </span>
                            ))}
                          </div>

                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1 sm:mt-0">
                            {idea.impact}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-xs text-slate-500 space-y-2">
                    <Lightbulb size={24} className="mx-auto text-indigo-500 opacity-60" />
                    <p>Click "Generate Project Concepts" to synthesize AI hackathon ideas using your team's verified skills.</p>
                  </div>
                )}
              </div>

            </div>

            {/* Right Col: Skill Gap Matrix & Sprint Todos */}
            <div className="space-y-6">
              
              {/* Skill Balance Matrix & Gap Detector */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Zap size={16} className="text-amber-500" />
                  <span>Team Skill Balance Matrix</span>
                </h3>

                {/* Role Coverage Indicator */}
                <div className="space-y-3 text-xs">
                  {['Frontend Developer', 'Backend Developer', 'AI/ML Engineer', 'UI/UX Designer', 'DevOps Engineer'].map(role => {
                    const coveredMember = teamMembersWithUsers.find(tm => tm.user.role === role);
                    return (
                      <div key={role} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 block">
                            {role}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {coveredMember ? coveredMember.user.name : 'Not Covered'}
                          </span>
                        </div>

                        {coveredMember ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                            Covered
                          </span>
                        ) : (
                          <button
                            onClick={() => onNavigateToDiscoveryWithRole(role as UserRole)}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 text-[10px] font-bold border border-rose-500/30 transition-colors flex items-center gap-1"
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

              {/* Team Sprint Scratchpad */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <CheckSquare size={16} className="text-indigo-600" />
                  <span>Sprint Action Items</span>
                </h3>

                <form onSubmit={handleAddTodo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add task..."
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                  />
                  <button type="submit" className="p-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold">
                    <Plus size={16} />
                  </button>
                </form>

                <div className="space-y-2 text-xs">
                  {todos.map(t => (
                    <div
                      key={t.id}
                      onClick={() => toggleTodo(t.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                        t.done
                          ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-400 border-slate-200/60 dark:border-slate-800 line-through'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <CheckCircle2 size={15} className={t.done ? 'text-emerald-500' : 'text-slate-300'} />
                      <span className="font-medium">{t.text}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* NO TEAM STATE */
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4 max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mx-auto text-3xl font-bold">
            🚀
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            You are not in a team yet
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Create a team to manage member skill matrices, invite candidates with verified badges, and generate AI hackathon project ideas.
          </p>

          <button
            onClick={() => setShowCreateTeam(true)}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Create New Team</span>
          </button>
        </div>
      )}

      {/* CREATE TEAM MODAL */}
      {showCreateTeam && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Create New Hackathon Team
            </h3>

            <form onSubmit={handleCreateTeamSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Team Nexus"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Hackathon
                </label>
                <input
                  type="text"
                  value={hackathonName}
                  onChange={(e) => setHackathonName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Team Pitch / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Short outline of your team goals..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateTeam(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                >
                  Launch Team Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
