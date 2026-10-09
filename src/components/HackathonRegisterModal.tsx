import React, { useState } from 'react';
import { Hackathon, User, UserRole } from '../types';
import { useToast } from './Toast';
import { 
  X, 
  Users, 
  Plus, 
  Copy, 
  Mail, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  Send,
  ArrowRight,
  CheckCircle2,
  KeyRound
} from 'lucide-react';

interface HackathonRegisterModalProps {
  hackathon: Hackathon;
  currentUser: User;
  onClose: () => void;
  onJoinTeamMode: () => void;
  onOpenJoinCodeModal?: () => void;
  onCreateTeam: (teamData: { 
    teamName: string; 
    inviteCode: string; 
    roles: UserRole[];
    description: string;
    projectIdeaTitle: string;
  }) => void;
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

export const HackathonRegisterModal: React.FC<HackathonRegisterModalProps> = ({
  hackathon,
  currentUser,
  onClose,
  onJoinTeamMode,
  onOpenJoinCodeModal,
  onCreateTeam
}) => {
  const toast = useToast();
  const [step, setStep] = useState<'choose' | 'create'>('choose');
  const [teamName, setTeamName] = useState(`${currentUser.name.split(' ')[0]}'s Squad`);
  const [projectIdeaTitle, setProjectIdeaTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([
    'Backend Developer', 
    'UI/UX Designer'
  ]);

  // Generate unique 6-character squad invite code
  const [inviteCode] = useState(() => 
    'SQ-' + Math.random().toString(36).substring(2, 6).toUpperCase()
  );
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Friend email invite
  const [friendEmail, setFriendEmail] = useState('');
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);

  // Toggle role needed
  const toggleRole = (role: UserRole) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopiedCode(true);
    toast.success(`Invite code ${inviteCode} copied to clipboard!`);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyLink = () => {
    const link = `https://squadup.dev/join/${inviteCode}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    toast.success('Shareable squad invite link copied!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSendFriendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendEmail.trim() || !friendEmail.includes('@')) {
      toast.error('Please enter a valid friend email address');
      return;
    }
    if (invitedEmails.includes(friendEmail.trim())) {
      toast.info('Invitation already dispatched to this email!');
      return;
    }
    setInvitedEmails(prev => [...prev, friendEmail.trim()]);
    toast.success(`✉️ Squad invitation email sent to ${friendEmail}!`);
    setFriendEmail('');
  };

  const handleFinalizeCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) {
      toast.error('Please enter a team name');
      return;
    }
    onCreateTeam({
      teamName: teamName.trim(),
      inviteCode,
      roles: selectedRoles,
      description: description.trim() || `Competing in ${hackathon.title}`,
      projectIdeaTitle: projectIdeaTitle.trim() || 'AI Driven Hackathon Solution'
    });
    toast.success(`🎉 Registered! Team "${teamName}" created with code ${inviteCode}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0e0a1a] border border-purple-500/30 rounded-3xl shadow-2xl shadow-purple-950/60 overflow-hidden text-white my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/15 bg-gradient-to-r from-purple-950/40 via-[#140e24] to-purple-950/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-extrabold uppercase tracking-wider">
                Hackathon Registration
              </span>
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                <Calendar size={12} className="text-purple-400" />
                {hackathon.startDate}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white mt-1 line-clamp-1">
              {hackathon.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* STEP 1: CHOOSE REGISTRATION PATH */}
          {step === 'choose' && (
            <div className="space-y-6">
              <div className="text-center max-w-md mx-auto space-y-2">
                <h3 className="text-xl font-bold text-white">How do you want to participate?</h3>
                <p className="text-xs text-purple-200/70">
                  Join an existing squad using AI synergy recommendations or create a new team and invite your friends.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* Option 1: Join with Invite Code */}
                {onOpenJoinCodeModal && (
                  <div 
                    onClick={() => {
                      onClose();
                      onOpenJoinCodeModal();
                    }}
                    className="p-5 rounded-2xl bg-gradient-to-b from-amber-900/20 to-purple-950/40 border border-amber-500/30 hover:border-amber-400 hover:scale-[1.02] transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-11 h-11 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-300 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-lg shadow-amber-500/20">
                        <KeyRound size={22} />
                      </div>
                      <h4 className="text-base font-bold text-white">Join via Invite Code</h4>
                      <p className="text-xs text-purple-200/70 leading-relaxed">
                        Have a 6-character squad code from a teammate? Enter it to instantly join their hackathon team.
                      </p>
                    </div>

                    <div className="pt-5 flex items-center gap-2 text-xs font-bold text-amber-400 group-hover:text-amber-300">
                      <span>Enter Squad Code</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                )}

                {/* Option 2: Join Team with AI */}
                <div 
                  onClick={onJoinTeamMode}
                  className="p-5 rounded-2xl bg-gradient-to-b from-purple-900/20 to-purple-950/40 border border-purple-500/30 hover:border-purple-400 hover:scale-[1.02] transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-lg shadow-purple-500/20">
                      <Sparkles size={22} />
                    </div>
                    <h4 className="text-base font-bold text-white">Find Squad with AI</h4>
                    <p className="text-xs text-purple-200/70 leading-relaxed">
                      AI matches your verified skill badges with existing squads looking for your exact role.
                    </p>
                  </div>

                  <div className="pt-5 flex items-center gap-2 text-xs font-bold text-purple-400 group-hover:text-purple-300">
                    <span>Discover Squads</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Option 3: Create Team & Invite Friends */}
                <div 
                  onClick={() => setStep('create')}
                  className="p-5 rounded-2xl bg-gradient-to-b from-indigo-900/20 to-indigo-950/40 border border-indigo-500/30 hover:border-indigo-400 hover:scale-[1.02] transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg shadow-indigo-500/20">
                      <Plus size={22} />
                    </div>
                    <h4 className="text-base font-bold text-white">Create New Team</h4>
                    <p className="text-xs text-purple-200/70 leading-relaxed">
                      Lead a squad, set required roles, and generate a new invite code to share with friends.
                    </p>
                  </div>

                  <div className="pt-5 flex items-center gap-2 text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                    <span>Create & Invite</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 flex items-center gap-3 text-xs text-purple-200/80">
                <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
                <span>
                  <strong>Anti-Cheat Guarantee:</strong> Teammates joining via your invite code must possess verified skill badges to protect team integrity.
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: CREATE TEAM & INVITE FRIENDS */}
          {step === 'create' && (
            <form onSubmit={handleFinalizeCreateTeam} className="space-y-6">
              
              {/* Team Name & Project Focus */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-1">
                    Team / Squad Name *
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. CyberVanguard, NeuralHacks"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#140e24] border border-purple-500/30 focus:border-purple-400 text-white text-sm outline-none transition"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-1">
                      Project Idea / Working Title
                    </label>
                    <input
                      type="text"
                      value={projectIdeaTitle}
                      onChange={(e) => setProjectIdeaTitle(e.target.value)}
                      placeholder="e.g. Decentralized Health AI"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#140e24] border border-purple-500/30 focus:border-purple-400 text-white text-sm outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-1">
                      Squad Pitch Description
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Building a high-impact MVP..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#140e24] border border-purple-500/30 focus:border-purple-400 text-white text-sm outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Roles Needed Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
                  Select Roles You Want To Recruit:
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_ROLES.map(role => {
                    const isSelected = selectedRoles.includes(role);
                    return (
                      <button
                        type="button"
                        key={role}
                        onClick={() => toggleRole(role)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                          isSelected
                            ? 'bg-purple-600 border-purple-400 text-white shadow-md shadow-purple-600/30'
                            : 'bg-[#140e24] border-purple-500/20 text-slate-300 hover:border-purple-400/50'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{role}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Squad Invite Code & Link Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/50 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-400" />
                    Squad Invite Code & Share Link
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Active
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex-1 w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#0b0714] border border-purple-500/40">
                    <span className="font-mono text-base font-extrabold text-amber-300 tracking-wider">
                      {inviteCode}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="px-2.5 py-1 rounded-lg bg-purple-600/40 hover:bg-purple-600 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCode ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copiedLink ? 'Link Copied' : 'Copy Join Link'}</span>
                  </button>
                </div>
              </div>

              {/* Direct Friend Email Dispatch */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-purple-300">
                  Invite Friends By Email Directly:
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={friendEmail}
                    onChange={(e) => setFriendEmail(e.target.value)}
                    placeholder="friend@college.edu"
                    className="flex-1 px-4 py-2 rounded-xl bg-[#140e24] border border-purple-500/30 text-white text-xs outline-none focus:border-purple-400 transition"
                  />
                  <button
                    type="button"
                    onClick={handleSendFriendInvite}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Send size={12} />
                    <span>Send Invite</span>
                  </button>
                </div>

                {invitedEmails.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {invitedEmails.map(em => (
                      <span key={em} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 size={10} />
                        Invite sent to {em}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Registration Email Confirmation Preview */}
              <div className="p-4 rounded-2xl bg-[#090611] border border-purple-500/20 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-purple-300/70 border-b border-purple-500/10 pb-2">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Mail size={12} className="text-purple-400" />
                    Automated Confirmation Email Preview
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">To: {currentUser.email}</span>
                </div>
                <div className="text-xs text-purple-200/90 space-y-1.5 pt-1">
                  <p className="font-bold text-white">Subject: 🚀 You're confirmed for {hackathon.title}!</p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Hi {currentUser.name}, your squad <strong>"{teamName}"</strong> has been created. Your squad invite code is <span className="text-amber-300 font-mono font-bold">{inviteCode}</span>. Teammates must pass proctored assessments to join your squad.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep('choose')}
                  className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-semibold transition cursor-pointer"
                >
                  Back
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-purple-500/30 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles size={14} />
                  <span>Create Squad & Confirm Registration</span>
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
