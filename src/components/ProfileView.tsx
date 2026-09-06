import React, { useState, useEffect } from 'react';
import { User, Skill, TestResult, UserRole, SkillCategory } from '../types';
import { BadgePill } from './BadgePill';
import { useToast } from './Toast';
import { 
  UserCheck, 
  Award, 
  ShieldAlert, 
  Github, 
  Linkedin, 
  Globe, 
  Edit3, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  GraduationCap, 
  MapPin, 
  Star, 
  Calendar,
  Clock,
  RotateCcw,
  Plus,
  Trash2,
  Camera,
  Sparkles
} from 'lucide-react';

import { renderAvatar, CUTE_AVATARS } from '../utils/avatars';
import { TeammateFeedback } from '../types';

interface ProfileViewProps {
  user: User;
  isCurrentUser: boolean;
  onUpdateProfile?: (updatedUser: User) => void;
  onTakeTestClick?: () => void;
  feedbacks: TeammateFeedback[];
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

const SKILL_CATEGORIES: SkillCategory[] = [
  'Frontend (React/JS)',
  'Backend (Node/Express)',
  'AI/ML (Python/PyTorch)',
  'UI/UX Design',
  'Full Stack Systems',
  'Data Structures & Algorithms',
  'Database Management (SQL)'
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  isCurrentUser,
  onUpdateProfile,
  onTakeTestClick,
  feedbacks
}) => {
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  // Editable fields
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState<UserRole>(user.role);
  const [avatar, setAvatar] = useState(user.avatar);
  const [bio, setBio] = useState(user.bio);
  const [college, setCollege] = useState(user.college);
  const [location, setLocation] = useState(user.location);
  const [github, setGithub] = useState(user.github || '');
  const [linkedin, setLinkedin] = useState(user.linkedin || '');
  const [portfolio, setPortfolio] = useState(user.portfolio || '');
  const [lookingForTeam, setLookingForTeam] = useState(user.lookingForTeam);
  
  // Custom skill adding
  const [skills, setSkills] = useState<Skill[]>(user.skills);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('Frontend (React/JS)');
  const [newSkillRating, setNewSkillRating] = useState<number>(4);

  // Sync state when user prop changes
  useEffect(() => {
    setName(user.name);
    setRole(user.role);
    setAvatar(user.avatar);
    setBio(user.bio);
    setCollege(user.college);
    setLocation(user.location);
    setGithub(user.github || '');
    setLinkedin(user.linkedin || '');
    setPortfolio(user.portfolio || '');
    setLookingForTeam(user.lookingForTeam);
    setSkills(user.skills);
  }, [user]);

  const handleSaveProfile = () => {
    if (!onUpdateProfile) return;
    const updated: User = {
      ...user,
      name,
      role,
      avatar,
      bio,
      college,
      location,
      github,
      linkedin,
      portfolio,
      lookingForTeam,
      skills
    };
    onUpdateProfile(updated);
    setIsEditing(false);
    toast.success('🎉 Profile updated successfully!');
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newSk: Skill = {
      id: `sk-${Date.now()}`,
      name: newSkillName,
      category: newSkillCategory,
      selfRating: newSkillRating,
      badgeLevel: 'Unverified'
    };

    setSkills(prev => [...prev, newSk]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillId: string) => {
    setSkills(prev => prev.filter(s => s.id !== skillId));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Header Card */}
      <div className="nixtio-card p-6 sm:p-10 space-y-6 relative">
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start gap-6 flex-1">
            
            {/* Avatar & Edit Avatar Choice */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[28px] overflow-hidden border-2 border-purple-500/40 shadow-2xl flex items-center justify-center p-1 bg-slate-950 shrink-0">
                {renderAvatar(avatar, "w-full h-full")}
              </div>
              {isEditing && (
                <div className="mt-3 space-y-2">
                  <label className="block text-[10px] text-purple-300 font-bold uppercase tracking-wider">Choose a Cute Doodle</label>
                  <div className="grid grid-cols-3 gap-1.5 w-36">
                    {CUTE_AVATARS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setAvatar(av.id)}
                        className={`w-10 h-10 p-0.5 rounded-lg border bg-slate-900 flex items-center justify-center transition cursor-pointer hover:border-purple-400 ${
                          avatar === av.id ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-slate-800'
                        }`}
                        title={av.name}
                      >
                        {av.render("w-full h-full")}
                      </button>
                    ))}
                  </div>
                  
                  <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Or Custom URL</label>
                  <input
                    type="text"
                    value={avatar}
                    onChange={e => setAvatar(e.target.value)}
                    placeholder="https://..."
                    className="w-36 text-[10px] px-2 py-1 rounded-xl bg-[#0b0813] border border-white/10 text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div className="space-y-3 flex-1 min-w-0">
              {/* Name & Role */}
              <div className="flex flex-wrap items-center gap-3">
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="text-2xl font-extrabold px-3 py-1 rounded-xl bg-[#0b0813] border border-purple-500/40 text-white focus:outline-none"
                  />
                ) : (
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {user.name}
                  </h1>
                )}

                {isEditing ? (
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as UserRole)}
                    className="px-3 py-1.5 rounded-xl bg-[#0b0813] border border-purple-500/40 text-xs font-bold text-purple-300"
                  >
                    {ROLES.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                ) : (
                  <span className="px-3.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-bold">
                    {user.role}
                  </span>
                )}
              </div>

              {/* College & Location */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-purple-200/80 font-medium">
                <span className="flex items-center gap-1.5">
                  <GraduationCap size={15} className="text-purple-400" />
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={college} 
                      onChange={e => setCollege(e.target.value)}
                      className="px-2.5 py-1 rounded-xl bg-[#0b0813] border border-white/10 text-white"
                    />
                  ) : user.college}
                </span>

                <span className="flex items-center gap-1.5">
                  <MapPin size={15} className="text-purple-400" />
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={location} 
                      onChange={e => setLocation(e.target.value)}
                      className="px-2.5 py-1 rounded-xl bg-[#0b0813] border border-white/10 text-white"
                    />
                  ) : user.location}
                </span>

                <label className="flex items-center gap-1.5 cursor-pointer ml-auto sm:ml-0">
                  <input
                    type="checkbox"
                    disabled={!isEditing}
                    checked={lookingForTeam}
                    onChange={e => setLookingForTeam(e.target.checked)}
                    className="rounded border-purple-800 text-purple-500 bg-[#0b0813]"
                  />
                  <span className="text-emerald-400 font-bold">Looking for Squad</span>
                </label>
              </div>

              {/* Bio */}
              <div className="pt-1">
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Tell hackathon teams about your expertise..."
                    className="w-full p-3 text-xs rounded-2xl bg-[#0b0813] border border-purple-500/30 text-white focus:outline-none"
                  />
                ) : (
                  <p className="text-xs text-purple-100/80 leading-relaxed max-w-2xl">
                    {user.bio}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Social Links & Edit Button */}
          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            {isCurrentUser && (
              isEditing ? (
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Save size={14} />
                  <span>Save Real-Time Profile</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2.5 rounded-full bg-[#0b0813] border border-white/20 hover:border-purple-400/50 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                >
                  <Edit3 size={14} className="text-purple-400" />
                  <span>Customize Profile</span>
                </button>
              )
            )}

            {/* Social Buttons */}
            <div className="flex items-center gap-2 pt-2">
              {user.github && (
                <a href={user.github} target="_blank" rel="noreferrer" className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:text-purple-400 transition">
                  <Github size={16} />
                </a>
              )}
              {user.linkedin && (
                <a href={user.linkedin} target="_blank" rel="noreferrer" className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:text-purple-400 transition">
                  <Linkedin size={16} />
                </a>
              )}
              {user.portfolio && (
                <a href={user.portfolio} target="_blank" rel="noreferrer" className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:text-purple-400 transition">
                  <Globe size={16} />
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Social URL Inputs in Edit Mode */}
        {isEditing && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-purple-500/10 text-xs">
            <div>
              <label className="block text-[10px] text-purple-300 font-bold uppercase mb-1">GitHub URL</label>
              <input
                type="text"
                value={github}
                onChange={e => setGithub(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full px-3 py-2 rounded-xl bg-[#0b0813] border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] text-purple-300 font-bold uppercase mb-1">LinkedIn URL</label>
              <input
                type="text"
                value={linkedin}
                onChange={e => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-3 py-2 rounded-xl bg-[#0b0813] border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] text-purple-300 font-bold uppercase mb-1">Portfolio URL</label>
              <input
                type="text"
                value={portfolio}
                onChange={e => setPortfolio(e.target.value)}
                placeholder="https://portfolio.dev"
                className="w-full px-3 py-2 rounded-xl bg-[#0b0813] border border-white/10 text-white"
              />
            </div>
          </div>
        )}

      </div>

      {/* Verified & Custom Skill Badges Showcase */}
      <div className="nixtio-card p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-500/10">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Award className="text-purple-400" size={22} />
              <span>Skill Inventory & Badges</span>
            </h2>
            <p className="text-xs text-purple-200/70">
              Proctored 20-MCQ evaluation badges + custom technical skills
            </p>
          </div>

          {isCurrentUser && onTakeTestClick && (
            <button
              onClick={onTakeTestClick}
              className="px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-lg hover:shadow-purple-500/30 cursor-pointer"
            >
              Take Skill Assessment
            </button>
          )}
        </div>

        {/* Add Skill Form in Edit Mode */}
        {isEditing && (
          <form onSubmit={handleAddSkill} className="p-4 rounded-2xl bg-[#0b0813] border border-purple-500/20 space-y-3">
            <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">Add Custom Skill to Profile</h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Skill name (e.g. Next.js, Docker)"
                value={newSkillName}
                onChange={e => setNewSkillName(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#141022] border border-white/10 text-xs text-white"
              />
              <select
                value={newSkillCategory}
                onChange={e => setNewSkillCategory(e.target.value as SkillCategory)}
                className="px-3 py-2 rounded-xl bg-[#141022] border border-white/10 text-xs text-white"
              >
                {SKILL_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={newSkillRating}
                onChange={e => setNewSkillRating(Number(e.target.value))}
                className="px-3 py-2 rounded-xl bg-[#141022] border border-white/10 text-xs text-white"
              >
                <option value={5}>5 Stars (Expert)</option>
                <option value={4}>4 Stars (Advanced)</option>
                <option value={3}>3 Stars (Competent)</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Skill</span>
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map(sk => (
            <div key={sk.id} className="p-5 rounded-[22px] bg-[#0b0813] border border-white/10 space-y-3 relative group">
              <div className="flex items-start justify-between">
                <span className="font-extrabold text-white text-sm">
                  {sk.name}
                </span>
                <div className="flex items-center gap-2">
                  <BadgePill level={sk.badgeLevel} scorePercent={sk.scorePercent} showScore />
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveSkill(sk.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Remove skill"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-purple-300/70 font-medium">
                <span>Self Rating: {'★'.repeat(sk.selfRating)}</span>
                {sk.verifiedAt && <span>Verified: {sk.verifiedAt}</span>}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Proctored Assessment Audit Logs */}
      {user.testResults && user.testResults.length > 0 && (
        <div className="nixtio-card p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-white">
              Proctored Assessment Security Logs
            </h2>
            <p className="text-xs text-purple-200/70">
              Audit record of completed anti-cheat assessments
            </p>
          </div>

          <div className="space-y-4">
            {user.testResults.map(tr => (
              <div key={tr.id} className="p-5 rounded-[22px] bg-[#0b0813] border border-white/10 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-sm">
                      {tr.category}
                    </span>
                    <BadgePill level={tr.badgeLevel} scorePercent={tr.scorePercent} showScore />
                  </div>

                  <span className="text-[11px] text-purple-300/70 flex items-center gap-1">
                    <Calendar size={13} /> {new Date(tr.completedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-xs text-purple-200/80">
                  Total Score: <strong className="text-white">{tr.correctCount} / {tr.totalQuestions} ({tr.scorePercent}%)</strong> • Anti-Cheat Security Flags: <strong className="text-purple-300">{tr.warningCount}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teammate Feedback & Endorsements */}
      <div className="nixtio-card p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Star className="text-amber-400 fill-amber-400" size={20} />
            <span>Teammate Endorsements</span>
          </h2>
          <p className="text-xs text-purple-200/70">
            Endorsements and reviews given by teammates inside the team workspaces
          </p>
        </div>

        {feedbacks && feedbacks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbacks.map((fb) => (
              <div key={fb.id} className="p-5 rounded-[22px] bg-[#0b0813] border border-white/10 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white text-sm">
                    {fb.senderName}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-lg text-[10px]">
                    {'★'.repeat(fb.rating)}
                  </div>
                </div>

                <p className="text-xs text-slate-300 italic">
                  "{fb.comment}"
                </p>

                {fb.tags && fb.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/40">
                    {fb.tags.map((tag, idx) => (
                      <span key={idx} className="text-[9px] font-bold px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-950/60 rounded-2xl border border-dashed border-slate-800 text-xs text-slate-400">
            No endorsements received yet. Work with teams to receive feedback!
          </div>
        )}
      </div>

    </div>
  );
};



