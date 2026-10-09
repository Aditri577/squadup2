import React, { useState } from 'react';
import { Hackathon, User } from '../types';
import { HackathonRegisterModal } from './HackathonRegisterModal';
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
  X,
  UserPlus,
  RefreshCw,
  Radio
} from 'lucide-react';
import { useToast } from './Toast';

interface HackathonsListProps {
  hackathons: Hackathon[];
  onSelectHackathonFilter: (hackathonName: string) => void;
  currentUser?: User;
  onCreateTeam?: (teamData: any) => void;
  onOpenJoinCodeModal?: () => void;
}

export const HackathonsList: React.FC<HackathonsListProps> = ({
  hackathons: initialHackathons,
  onSelectHackathonFilter,
  currentUser,
  onCreateTeam,
  onOpenJoinCodeModal
}) => {
  const toast = useToast();
  const [items, setItems] = useState<Hackathon[]>(initialHackathons);

  React.useEffect(() => {
    setItems(initialHackathons);
  }, [initialHackathons]);

  React.useEffect(() => {
    fetch('/api/hackathons')
      .then(res => res.json())
      .then(data => {
        if (data.hackathons && data.hackathons.length > 0) {
          setItems(data.hackathons);
        }
      })
      .catch(() => {});
  }, []);

  const [registeringHackathon, setRegisteringHackathon] = useState<Hackathon | null>(null);

  const [syncing, setSyncing] = useState(false);

  const handleSyncDevfolio = async () => {
    setSyncing(true);
    try {
      const resp = await fetch('/api/hackathons?refresh=true');
      if (!resp.ok) throw new Error('Sync failed');
      const data = await resp.json();
      if (data.hackathons && data.hackathons.length > 0) {
        setItems(data.hackathons);
      }
      toast.success('✅ Live hackathons synced from Devfolio!');
    } catch {
      toast.error('❌ Could not sync — please try again.');
    } finally {
      setSyncing(false);
    }
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
          <div className="mt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              <Radio size={10} className="animate-pulse" />
              Live Devfolio Feed Connected
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleSyncDevfolio}
            disabled={syncing}
            className="px-4 py-3 rounded-full bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
            <span>{syncing ? 'Syncing…' : 'Sync Live'}</span>
          </button>


        </div>
      </div>

      {/* Hackathons Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((h) => (
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
                
                <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase tracking-wider">
                    {h.domain}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                    <Clock size={10} />
                    Live Registration
                  </span>
                  {(h as any).source === 'devfolio' && (
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-md text-blue-300 border border-blue-500/40 text-[10px] font-bold flex items-center gap-1">
                      <Radio size={10} />
                      Devfolio
                    </span>
                  )}
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

            {/* Footer Actions */}
            <div className="p-6 pt-0 flex flex-col gap-2.5">
              <div className="flex gap-2.5">
                <button
                  onClick={() => setRegisteringHackathon(h)}
                  className="flex-1 py-3 px-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-purple-500/25 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserPlus size={14} />
                  <span>Register</span>
                </button>

                <button
                  onClick={() => onSelectHackathonFilter(h.title)}
                  className="flex-1 py-3 px-4 rounded-full bg-[#0b0813] border border-white/15 hover:border-purple-400/50 text-white text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Find Squad</span>
                  <ArrowRight size={13} />
                </button>
              </div>
              {(h as any).websiteUrl && (
                <a
                  href={(h as any).websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-4 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider transition hover:bg-blue-500/20 flex items-center justify-center gap-1.5"
                >
                  <ExternalLink size={12} />
                  <span>Official Page</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>



      {/* HACKATHON REGISTRATION MODAL */}
      {registeringHackathon && (
        <HackathonRegisterModal
          hackathon={registeringHackathon}
          currentUser={currentUser || {
            id: 'user-demo',
            name: 'Hackathon Builder',
            email: 'builder@squadup.dev',
            avatar: '',
            role: 'Full Stack Developer',
            college: 'Tech University',
            bio: '',
            location: 'Global',
            skills: [],
            testResults: [],
            preferredDomains: [],
            lookingForTeam: true,
            joinedAt: new Date().toISOString()
          }}
          onClose={() => setRegisteringHackathon(null)}
          onOpenJoinCodeModal={onOpenJoinCodeModal}
          onJoinTeamMode={() => {
            const hTitle = registeringHackathon.title;
            setRegisteringHackathon(null);
            onSelectHackathonFilter(hTitle);
          }}
          onCreateTeam={(teamData) => {
            if (onCreateTeam) {
              onCreateTeam({
                name: teamData.teamName,
                hackathonId: registeringHackathon.id,
                hackathonName: registeringHackathon.title,
                description: teamData.description,
                lookingForRoles: teamData.roles,
                inviteCode: teamData.inviteCode,
                projectIdea: {
                  title: teamData.projectIdeaTitle,
                  description: teamData.description,
                  techStack: ['React', 'Node.js', 'Tailwind', 'AI']
                }
              });
            }
            setRegisteringHackathon(null);
          }}
        />
      )}

    </div>
  );
};
