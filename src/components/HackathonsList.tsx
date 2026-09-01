import React, { useState } from 'react';
import { Hackathon } from '../types';
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Users, 
  Award, 
  ExternalLink, 
  ArrowRight, 
  Sparkles, 
  Clock,
  Plus,
  ThumbsUp,
  Github,
  Globe,
  Video,
  X
} from 'lucide-react';

interface HackathonsListProps {
  hackathons: Hackathon[];
  onSelectHackathonFilter: (hackathonName: string) => void;
}

interface SubmittedProject {
  id: string;
  hackathonTitle: string;
  teamName: string;
  projectTitle: string;
  tagline: string;
  githubUrl: string;
  demoUrl: string;
  videoUrl?: string;
  techStack: string[];
  upvotes: number;
  submittedAt: string;
}

const INITIAL_PROJECTS: SubmittedProject[] = [
  {
    id: 'proj-1',
    hackathonTitle: 'HackIndia 2026 - AI & Web3 Edition',
    teamName: 'CyberSquad Alpha',
    projectTitle: 'SquadUP AI Protocol',
    tagline: 'Proctored skill badge verification & 98% AI compatibility squad matchmaker.',
    githubUrl: 'https://github.com/aditi-saxena/squadup-protocol',
    demoUrl: 'https://squadup.dev',
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Gemini AI API'],
    upvotes: 42,
    submittedAt: '2026-08-05'
  },
  {
    id: 'proj-2',
    hackathonTitle: 'ETH India Builder Jam 2026',
    teamName: 'DeFi Mavericks',
    projectTitle: 'VaultPulse Protocol',
    tagline: 'Zero-knowledge flash loan collateral analyzer & real-time risk index.',
    githubUrl: 'https://github.com/vikram-patel/vaultpulse',
    demoUrl: 'https://vaultpulse.io',
    techStack: ['Solidity', 'Ethers.js', 'Next.js', 'PostgreSQL'],
    upvotes: 29,
    submittedAt: '2026-08-04'
  }
];

export const HackathonsList: React.FC<HackathonsListProps> = ({
  hackathons,
  onSelectHackathonFilter
}) => {
  const [projects, setProjects] = useState<SubmittedProject[]>(() => {
    const saved = localStorage.getItem('squadup_submitted_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedHackathonTitle, setSelectedHackathonTitle] = useState(hackathons[0]?.title || '');

  // New project form state
  const [teamName, setTeamName] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [techStackInput, setTechStackInput] = useState('');

  // LocalStorage Sync
  React.useEffect(() => {
    localStorage.setItem('squadup_submitted_projects', JSON.stringify(projects));
  }, [projects]);

  const handleUpvote = (projectId: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, upvotes: p.upvotes + 1 } : p));
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim() || !teamName.trim()) return;

    const newProj: SubmittedProject = {
      id: `proj-${Date.now()}`,
      hackathonTitle: selectedHackathonTitle,
      teamName: teamName.trim(),
      projectTitle: projectTitle.trim(),
      tagline: tagline.trim() || 'Awesome hackathon project submission.',
      githubUrl: githubUrl.trim() || 'https://github.com',
      demoUrl: demoUrl.trim() || 'https://demo.dev',
      techStack: techStackInput.split(',').map(t => t.trim()).filter(Boolean),
      upvotes: 1,
      submittedAt: new Date().toISOString().split('T')[0]
    };

    setProjects(prev => [newProj, ...prev]);
    setShowSubmitModal(false);
    setTeamName('');
    setProjectTitle('');
    setTagline('');
    setGithubUrl('');
    setDemoUrl('');
    setTechStackInput('');
    alert('🚀 Project submitted successfully to Hackathon Demo Showcase!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="text-purple-400 font-light mr-1">&#125;</span>
            Active Hackathons & Demo Showcase
            <Trophy size={28} className="text-amber-400" />
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/80 mt-1">
            Browse upcoming competitions, form squads with verified technical badges, and submit projects.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-wider transition shadow-lg hover:shadow-purple-500/30 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Submit Project To Demo Day</span>
        </button>
      </div>

      {/* Hackathons Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hackathons.map((h) => (
          <div
            key={h.id}
            className="nixtio-card overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Banner */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={h.banner}
                  alt={h.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141022] via-[#141022]/60 to-transparent"></div>
                
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase tracking-wider">
                    {h.domain}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                    <Clock size={10} />
                    Live Registration
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <p className="text-[11px] text-purple-300 font-semibold">{h.organizer}</p>
                  <h3 className="text-base font-extrabold leading-snug line-clamp-1">{h.title}</h3>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 space-y-4">
                <p className="text-xs text-purple-200/80 line-clamp-2 leading-relaxed">
                  {h.description}
                </p>

                <div className="space-y-2 text-xs text-purple-200/70 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-purple-400 shrink-0" />
                    <span>{h.startDate} to {h.endDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-purple-400 shrink-0" />
                    <span>{h.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-purple-400 shrink-0" />
                    <span>Max {h.maxTeamSize} per team • {h.registeredTeamsCount} squads registered</span>
                  </div>

                  <div className="flex items-center gap-2 text-emerald-400 font-bold pt-1">
                    <Award size={14} className="shrink-0 text-emerald-400" />
                    <span>Prize Pool: {h.prizes}</span>
                  </div>
                </div>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {h.tags.map(t => (
                    <span key={t} className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-purple-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 pt-0">
              <button
                onClick={() => onSelectHackathonFilter(h.title)}
                className="w-full py-3 rounded-full bg-[#0b0813] border border-white/15 hover:border-purple-400/50 text-white text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Find Teammates For This Hack</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* REAL-TIME DEMO DAY SUBMISSIONS SHOWCASE */}
      <div className="nixtio-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-purple-500/10">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Sparkles className="text-purple-400" size={22} />
              <span>Live Hackathon Project Submissions & Peer Demo Day</span>
            </h2>
            <p className="text-xs text-purple-200/70">
              Real-time submitted projects, peer upvotes, and technical repositories
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <div key={p.id} className="p-6 rounded-[24px] bg-[#0b0813] border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">{p.hackathonTitle}</span>
                    <h3 className="text-lg font-extrabold text-white mt-0.5">{p.projectTitle}</h3>
                    <p className="text-xs font-semibold text-purple-300">By Team {p.teamName}</p>
                  </div>

                  <button
                    onClick={() => handleUpvote(p.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-bold hover:bg-purple-900/60 transition cursor-pointer"
                  >
                    <ThumbsUp size={13} className="text-purple-400 fill-purple-400" />
                    <span>{p.upvotes} Upvotes</span>
                  </button>
                </div>

                <p className="text-xs text-purple-100/80 leading-relaxed">
                  {p.tagline}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {p.techStack.map(t => (
                    <span key={t} className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white/5 text-purple-200 border border-white/10">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-purple-500/10 flex items-center justify-between text-xs">
                <span className="text-[10px] text-purple-300/60 font-medium">Submitted {p.submittedAt}</span>

                <div className="flex items-center gap-3">
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-white hover:text-purple-300 font-semibold transition">
                      <Github size={14} />
                      <span>Code Repo</span>
                    </a>
                  )}
                  {p.demoUrl && (
                    <a href={p.demoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-semibold transition">
                      <Globe size={14} />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUBMISSION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="nixtio-card w-full max-w-xl p-6 sm:p-8 space-y-5 relative shadow-2xl">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>

            <div>
              <h3 className="text-xl font-extrabold text-white">Submit Project to Demo Day</h3>
              <p className="text-xs text-purple-300">Showcase your hackathon deliverable to peers and judges</p>
            </div>

            <form onSubmit={handleProjectSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-purple-300 uppercase tracking-wider mb-1">Hackathon Event</label>
                <select
                  value={selectedHackathonTitle}
                  onChange={e => setSelectedHackathonTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full bg-[#0b0813] border border-white/10 text-white font-semibold"
                >
                  {hackathons.map(h => (
                    <option key={h.id} value={h.title}>{h.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-purple-300 uppercase tracking-wider mb-1">Squad / Team Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CyberSquad Alpha"
                    value={teamName}
                    onChange={e => setTeamName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full bg-[#0b0813] border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-purple-300 uppercase tracking-wider mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SquadUP Protocol"
                    value={projectTitle}
                    onChange={e => setProjectTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full bg-[#0b0813] border border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-purple-300 uppercase tracking-wider mb-1">Project Tagline & Pitch Summary</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe your hackathon solution..."
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-[#0b0813] border border-white/10 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-purple-300 uppercase tracking-wider mb-1">GitHub Repo URL</label>
                  <input
                    type="text"
                    placeholder="https://github.com/username/repo"
                    value={githubUrl}
                    onChange={e => setGithubUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full bg-[#0b0813] border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-purple-300 uppercase tracking-wider mb-1">Live Demo / App URL</label>
                  <input
                    type="text"
                    placeholder="https://myproject.dev"
                    value={demoUrl}
                    onChange={e => setDemoUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full bg-[#0b0813] border border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-purple-300 uppercase tracking-wider mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  placeholder="React, Node.js, Python, Tailwind"
                  value={techStackInput}
                  onChange={e => setTechStackInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full bg-[#0b0813] border border-white/10 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold uppercase tracking-wider transition shadow-lg cursor-pointer mt-2"
              >
                Submit Project Now
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
