import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Reveal, CountUp } from './Motion';
import { User, UserRole, BadgeLevel, TeamRequest } from '../types';
import { BadgePill } from './BadgePill';
import { AISquadRecommender } from './AISquadRecommender';
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
  onNavigateToAssessment?: () => void;
  // Filter props set by parent (Hackathons page, Teams page)
  initialHackathonFilter?: string;
  initialRoleFilter?: string;
  onClearFilters?: () => void;
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

import { calculateUserMatchScore } from '../utils/aiMatchmaker';
import { api } from '../utils/api';

export const TeammateDiscovery: React.FC<TeammateDiscoveryProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
  onSendTeamRequest,
  activeTeamName = 'Team Nexus',
  activeHackathonName = 'AI Innovations Global Hackathon 2026',
  onNavigateToAssessment,
  initialHackathonFilter = '',
  initialRoleFilter = '',
  onClearFilters
}) => {
  // Draft filter states (before clicking SEARCH)
  const [searchTermDraft, setSearchTermDraft] = useState('');
  const [domainDraft, setDomainDraft] = useState('all');
  const [selectedSkillsDraft, setSelectedSkillsDraft] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [skillLevelDraft, setSkillLevelDraft] = useState('all');
  const [experienceDraft, setExperienceDraft] = useState('all');
  const [availabilityDraft, setAvailabilityDraft] = useState('all');
  const [hackathonDraft, setHackathonDraft] = useState('all');

  const [onlyLookingForTeam, setOnlyLookingForTeam] = useState(true);

  // Applied filter state (applied when user clicks SEARCH button)
  const [appliedFilters, setAppliedFilters] = useState({
    searchTerm: '',
    domain: 'all',
    skills: [] as string[],
    skillLevel: 'all',
    experience: 'all',
    availability: 'all',
    hackathon: 'all'
  });

  // Apply incoming filters from parent (Hackathons tab, Teams tab)
  useEffect(() => {
    if (initialHackathonFilter) {
      setHackathonDraft(initialHackathonFilter);
      setAppliedFilters(prev => ({ ...prev, hackathon: initialHackathonFilter }));
    }
    if (initialRoleFilter) {
      setDomainDraft(initialRoleFilter);
      setAppliedFilters(prev => ({ ...prev, domain: initialRoleFilter }));
    }
  }, [initialHackathonFilter, initialRoleFilter]);

  // Invitation Modal State
  const [inviteUser, setInviteUser] = useState<User | null>(null);
  const [proposedRole, setProposedRole] = useState<UserRole>('Backend Developer');
  const [inviteMessage, setInviteMessage] = useState('');
  const [aiMatchAnalysis, setAiMatchAnalysis] = useState<string | null>(null);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);

  // Check if current user has any verified badges
  const isCurrentUserVerified = currentUser.skills.some(s => s.badgeLevel === 'Green' || s.badgeLevel === 'Yellow');

  // Helper functions for skill tags
  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !selectedSkillsDraft.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      setSelectedSkillsDraft([...selectedSkillsDraft, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSelectedSkillsDraft(selectedSkillsDraft.filter(s => s !== skillToRemove));
  };

  const handleApplySearch = () => {
    setAppliedFilters({
      searchTerm: searchTermDraft,
      domain: domainDraft,
      skills: selectedSkillsDraft,
      skillLevel: skillLevelDraft,
      experience: experienceDraft,
      availability: availabilityDraft,
      hackathon: hackathonDraft
    });
  };

  // Filter users based on appliedFilters
  const filteredUsers = allUsers.filter(u => {
    if (u.id === currentUser.id) return false; // Don't show self in discovery

    if (onlyLookingForTeam && !u.lookingForTeam) return false;

    // 1. Search teammates keyword (matches name, college, bio, role)
    if (appliedFilters.searchTerm) {
      const q = appliedFilters.searchTerm.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchCollege = u.college.toLowerCase().includes(q);
      const matchBio = u.bio.toLowerCase().includes(q);
      const matchRole = u.role.toLowerCase().includes(q);
      const matchSkill = u.skills.some(s => s.name.toLowerCase().includes(q));
      if (!matchName && !matchCollege && !matchBio && !matchRole && !matchSkill) return false;
    }

    // 2. Domain (Role) Filter
    if (appliedFilters.domain !== 'all' && u.role !== appliedFilters.domain) {
      return false;
    }

    // 3. Skills Filter (matches all selected skills)
    if (appliedFilters.skills.length > 0) {
      const candidateSkills = u.skills.map(s => s.name.toLowerCase());
      const hasAllSkills = appliedFilters.skills.every(skillToMatch => 
        candidateSkills.some(cs => cs.includes(skillToMatch.toLowerCase()))
      );
      if (!hasAllSkills) return false;
    }

    // 4. Skill Level (Badge levels)
    if (appliedFilters.skillLevel !== 'all') {
      const hasLevel = u.skills.some(s => s.badgeLevel === appliedFilters.skillLevel);
      if (!hasLevel) return false;
    }

    // 5. Experience Filter
    if (appliedFilters.experience !== 'all' && u.experience !== appliedFilters.experience) {
      return false;
    }

    // 6. Availability Filter
    if (appliedFilters.availability !== 'all' && u.availability !== appliedFilters.availability) {
      return false;
    }

    // 7. Hackathon Filter
    if (appliedFilters.hackathon !== 'all') {
      if (!u.hackathons || !u.hackathons.includes(appliedFilters.hackathon)) {
        return false;
      }
    }

    return true;
  });

  // Trigger AI Match Analysis endpoint for invitation modal
  const handleFetchAiMatchAnalysis = async (candidate: User) => {
    setIsAnalyzingAi(true);
    setAiMatchAnalysis(null);

    try {
      const data = await api<{ analysis: string }>('/api/ai/match-analysis', {
        method: 'POST',
        body: {
          candidate,
          teamSkillGaps: [proposedRole],
          hackathonTitle: activeHackathonName
        }
      });
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

    setInviteUser(null);
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* MANDATORY DOMAIN TEST GATE BANNER IF UNVERIFIED */}
      {!isCurrentUserVerified && (
        <div className="rounded-[28px] bg-gradient-to-r from-purple-950/90 via-indigo-950/90 to-purple-900/90 border-2 border-purple-500/40 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(168,85,247,0.3)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/40">
              <ShieldCheck size={14} className="text-purple-400" />
              <span>Mandatory Domain Test Required</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Complete Skill Test for Your Domain ({currentUser.role})
            </h3>
            <p className="text-xs text-purple-200/80 max-w-2xl leading-relaxed">
              Before discovering teammates or searching squads in your domain, you must complete your 20-MCQ proctored evaluation. Each test attempt draws fresh, randomized questions from our 2,000+ question bank!
            </p>
          </div>

          <button
            onClick={onNavigateToAssessment}
            className="px-6 py-3.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-wider transition shadow-xl hover:shadow-purple-500/40 shrink-0 cursor-pointer flex items-center gap-2"
          >
            <Sparkles size={16} />
            <span>Take Assessment Now</span>
          </button>
        </div>
      )}

      {/* Nixtio Hero Section matching the screenshot */}
      <div className="relative rounded-[36px] bg-[#141022]/90 border border-purple-500/20 p-8 sm:p-12 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Ambient violet light blob */}
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none animate-aurora"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none animate-aurora-slow"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          {/* Main Huge Typography Headline */}
          <Reveal className="lg:col-span-8 space-y-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-gradient tracking-tight leading-[1.1] font-display">
              <span className="text-purple-400 font-light mr-2">&#125;</span>
              SquadUP<br/>
              Is a Premier AI Teammate & Verification Platform
            </h1>
          </Reveal>

          {/* Right Subtext & Action Pill */}
          <Reveal delay={0.15} className="lg:col-span-4 space-y-6 pt-2">
            <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed">
              <span className="text-purple-400 mr-1">&#125;</span>
              Empirically verifying technical skill capabilities with anti-cheat proctored tests, AI synergy matchmaking, and live team sprint boards.
            </p>

            <button 
              onClick={() => {
                const el = document.getElementById('search-filter-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-full bg-black border border-white/20 hover:border-purple-400/50 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-lg hover:shadow-purple-500/20"
            >
              FIND TEAMMATES
            </button>
          </Reveal>
        </div>

        {/* Big Metrics Cards Row (Matching 192k / 34 cards from screenshot) */}
        <Reveal delay={0.25} className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10 pt-8 border-t border-purple-500/10">
          <div className="bg-[#0c0915]/80 border border-white/10 rounded-[24px] p-6 space-y-1 backdrop-blur-md">
            <CountUp value={192} suffix="k" className="text-4xl font-extrabold text-white tracking-tight font-display" />
            <div className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">Verified Skill Badges</div>
          </div>

          <div className="bg-[#0c0915]/80 border border-white/10 rounded-[24px] p-6 space-y-1 backdrop-blur-md">
            <CountUp value={34} className="text-4xl font-extrabold text-white tracking-tight font-display" />
            <div className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">Unique Squads Matched</div>
          </div>

          <div className="bg-[#0c0915]/80 border border-white/10 rounded-[24px] p-6 space-y-1 backdrop-blur-md">
            <CountUp value={98} suffix="%" className="text-4xl font-extrabold text-purple-300 tracking-tight font-display" />
            <div className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">AI Synergy Precision</div>
          </div>
        </Reveal>
      </div>

      {/* AI Squad Gap Recommender Widget */}
      <AISquadRecommender
        currentTeam={null}
        currentUser={currentUser}
        allUsers={allUsers}
        onInviteCandidate={(candId, role) => {
          const cand = allUsers.find(u => u.id === candId);
          if (cand) openInviteModal(cand);
        }}
      />

      {/* Filter Bar Section */}
      <div id="search-filter-section" className="nixtio-card p-6 sm:p-8 space-y-6 relative overflow-hidden bg-[#141022]/60 backdrop-blur-2xl border border-purple-500/20 rounded-[28px]">
        
        {/* Search Input Header */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-purple-300">Search Teammates</label>
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
            <input
              type="text"
              placeholder="Search teammate name, college, bio, or role..."
              value={searchTermDraft}
              onChange={(e) => setSearchTermDraft(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#0b0813] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 transition-all duration-200"
            />
          </div>
        </div>

        {/* Filter Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          
          {/* Domain Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-purple-300">Domain</label>
            <select
              value={domainDraft}
              onChange={(e) => setDomainDraft(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-[#0b0813] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400 font-semibold cursor-pointer focus:ring-1 focus:ring-purple-400/50 transition-all duration-200"
            >
              <option value="all">Any Domain</option>
              <option value="Full Stack Developer">Full Stack</option>
              <option value="Frontend Developer">Frontend</option>
              <option value="Backend Developer">Backend</option>
              <option value="AI/ML Engineer">AI / ML</option>
              <option value="UI/UX Designer">UI / UX</option>
              <option value="Data Scientist">Data Science</option>
              <option value="DevOps Engineer">DevOps</option>
            </select>
          </div>

          {/* Skills Tag Input & Suggestion list */}
          <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-1">
            <label className="text-xs font-bold uppercase tracking-wider text-purple-300">Skills</label>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add skill (e.g. React, Node.js)..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-[#0b0813] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-xs font-bold transition duration-200 cursor-pointer"
                >
                  Add
                </button>
              </div>

              {/* Render selected chips */}
              {selectedSkillsDraft.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-0.5">
                  {selectedSkillsDraft.map(skill => (
                    <span 
                      key={skill} 
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-200 border border-purple-400/30 text-[11px] font-bold"
                    >
                      {skill}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-red-400 transition-colors ml-1 focus:outline-none text-[10px] cursor-pointer"
                      >
                        <X size={11} className="stroke-[2.5px]" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Suggested skills pills */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {['React', 'Node.js', 'Python', 'PyTorch', 'SQL', 'Figma'].filter(s => !selectedSkillsDraft.includes(s)).map(s => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSelectedSkillsDraft([...selectedSkillsDraft, s])}
                    className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-purple-500/20 border border-white/5 hover:border-purple-500/30 text-purple-300 transition duration-150 cursor-pointer"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Skill Level Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-purple-300">Skill Level</label>
            <select
              value={skillLevelDraft}
              onChange={(e) => setSkillLevelDraft(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-[#0b0813] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400 font-semibold cursor-pointer focus:ring-1 focus:ring-purple-400/50 transition-all duration-200"
            >
              <option value="all">Any Level</option>
              <option value="Green">🟢 Advanced</option>
              <option value="Yellow">🟡 Intermediate</option>
              <option value="Red">🔴 Beginner</option>
              <option value="Unverified">⚪ Self-Claimed</option>
            </select>
          </div>

          {/* Experience Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-purple-300">Experience</label>
            <select
              value={experienceDraft}
              onChange={(e) => setExperienceDraft(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-[#0b0813] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400 font-semibold cursor-pointer focus:ring-1 focus:ring-purple-400/50 transition-all duration-200"
            >
              <option value="all">Any Experience</option>
              <option value="Beginner (<1 yr)">Beginner (&lt;1 yr)</option>
              <option value="Intermediate (1-3 yrs)">Intermediate (1-3 yrs)</option>
              <option value="Advanced (3+ yrs)">Advanced (3+ yrs)</option>
            </select>
          </div>

          {/* Availability Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-purple-300">Availability</label>
            <select
              value={availabilityDraft}
              onChange={(e) => setAvailabilityDraft(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-[#0b0813] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400 font-semibold cursor-pointer focus:ring-1 focus:ring-purple-400/50 transition-all duration-200"
            >
              <option value="all">Any Availability</option>
              <option value="Weekends">Weekends</option>
              <option value="Weekdays">Weekdays</option>
              <option value="Part-time">Part-time</option>
              <option value="Full-time">Full-time</option>
            </select>
          </div>

          {/* Hackathon Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-purple-300">Hackathon</label>
            <select
              value={hackathonDraft}
              onChange={(e) => setHackathonDraft(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-[#0b0813] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400 font-semibold cursor-pointer focus:ring-1 focus:ring-purple-400/50 transition-all duration-200"
            >
              <option value="all">Any Hackathon</option>
              <option value="SIH 2026">SIH 2026</option>
              <option value="AI Innovations Global Hackathon 2026">AI Innovations Global Hackathon 2026</option>
              <option value="FinTech Future Sprint 2026">FinTech Future Sprint 2026</option>
              <option value="DesignJam National UX Challenge">DesignJam National UX Challenge</option>
            </select>
          </div>

        </div>

        {/* Search Trigger Button Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-purple-500/10 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-purple-200/80 font-medium select-none">
            <input
              type="checkbox"
              checked={onlyLookingForTeam}
              onChange={(e) => setOnlyLookingForTeam(e.target.checked)}
              className="rounded border-purple-800 text-purple-500 focus:ring-purple-500 bg-[#0b0813]"
            />
            <span>Show candidates currently looking for a team</span>
          </label>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-purple-300/60 font-semibold">
              {filteredUsers.length} Candidates Matched
            </span>
            
            <button
              onClick={handleApplySearch}
              className="px-8 py-3 rounded-full bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white text-xs font-bold uppercase tracking-widest transition shadow-lg hover:shadow-purple-500/40 cursor-pointer flex items-center gap-1.5"
            >
              <Search size={14} className="stroke-[2.5px]" />
              <span>SEARCH</span>
            </button>
          </div>
        </div>

      </div>

      {/* Teammate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user, index) => {
          const matchResult = calculateUserMatchScore(user, ['Backend Developer', 'AI/ML Engineer'], currentUser.preferredDomains);
          const greenBadges = user.skills.filter(s => s.badgeLevel === 'Green');

          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.07, 0.35), ease: [0.22, 1, 0.36, 1] }}
              className="nixtio-card p-6 flex flex-col justify-between space-y-5 relative group"
            >
              {/* Compatibility Match Badge */}
              <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold border border-purple-500/30 bg-purple-950/40 text-purple-300">
                <Zap size={12} className="text-purple-400 fill-purple-400" />
                <span>{matchResult.score}% {matchResult.label}</span>
              </div>

              {/* User Identity & Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-14 h-14 rounded-[20px] object-cover ring-2 ring-purple-500/30 shrink-0"
                  />
                  <div>
                    <h3 
                      onClick={() => onSelectUser(user)}
                      className="font-extrabold text-white text-base hover:text-purple-300 cursor-pointer transition-colors"
                    >
                      {user.name}
                    </h3>
                    <p className="text-xs font-semibold text-purple-300">
                      {user.role}
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                      <GraduationCap size={13} className="text-purple-400" />
                      {user.college}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-purple-100/80 line-clamp-2 leading-relaxed">
                  {user.bio}
                </p>

                {/* Verified Skills Section */}
                <div className="space-y-2 pt-3 border-t border-purple-500/10">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-purple-300/60">
                    <span>Verified Skill Badges</span>
                    <span className="text-purple-300 font-semibold">
                      {greenBadges.length} Proctored
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {user.skills.map(sk => (
                      <div key={sk.id} className="flex items-center gap-1 bg-[#0b0813] p-1 rounded-xl border border-white/10">
                        <span className="text-xs font-bold text-white px-1">
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
                    <span key={dom} className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-purple-200/80">
                      #{dom}
                    </span>
                  ))}
                </div>

                {/* Experience & Availability & Hackathons indicators */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-purple-500/10 text-[10px] font-medium text-slate-400">
                  {user.experience && (
                    <span className="px-2.5 py-1 rounded-full bg-purple-950/40 border border-purple-500/30 text-purple-300">
                      💼 {user.experience}
                    </span>
                  )}
                  {user.availability && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                      ⏰ {user.availability}
                    </span>
                  )}
                  {user.hackathons && user.hackathons.length > 0 && (
                    <div className="w-full flex flex-wrap gap-1 mt-1.5">
                      {user.hackathons.map(h => (
                        <span key={h} className="px-2.5 py-1 rounded-full bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 truncate max-w-full">
                          🏆 {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-purple-500/10 flex items-center gap-2">
                <button
                  onClick={() => onSelectUser(user)}
                  className="flex-1 py-2.5 rounded-full border border-white/15 hover:border-purple-400/40 text-white text-xs font-semibold transition text-center cursor-pointer"
                >
                  Profile
                </button>

                <button
                  onClick={() => openInviteModal(user)}
                  className="flex-1 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-lg hover:shadow-purple-500/30 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserPlus size={14} />
                  <span>Invite</span>
                </button>
              </div>

            </motion.div>
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
