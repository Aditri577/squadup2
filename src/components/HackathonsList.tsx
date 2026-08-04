import React from 'react';
import { Hackathon } from '../types';
import { Trophy, Calendar, MapPin, Users, Award, ExternalLink, ArrowRight } from 'lucide-react';

interface HackathonsListProps {
  hackathons: Hackathon[];
  onSelectHackathonFilter: (hackathonName: string) => void;
}

export const HackathonsList: React.FC<HackathonsListProps> = ({
  hackathons,
  onSelectHackathonFilter
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Active Hackathons & Competitions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Browse upcoming hackathons and find teammates with verified technical skills.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hackathons.map((h) => (
          <div
            key={h.id}
            className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Banner */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={h.banner}
                  alt={h.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold uppercase tracking-wider">
                    {h.domain}
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <p className="text-[11px] text-indigo-300 font-semibold">{h.organizer}</p>
                  <h3 className="text-base font-extrabold leading-snug line-clamp-1">{h.title}</h3>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {h.description}
                </p>

                <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-indigo-600 shrink-0" />
                    <span>{h.startDate} to {h.endDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-indigo-600 shrink-0" />
                    <span>{h.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-indigo-600 shrink-0" />
                    <span>Max {h.maxTeamSize} per team • {h.registeredTeamsCount} teams registered</span>
                  </div>

                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold pt-1">
                    <Award size={14} className="shrink-0" />
                    <span>Prize Pool: {h.prizes}</span>
                  </div>
                </div>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1 pt-2">
                  {h.tags.map(t => (
                    <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80">
              <button
                onClick={() => onSelectHackathonFilter(h.title)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all mt-4"
              >
                <span>Find Teammates for this Hackathon</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
