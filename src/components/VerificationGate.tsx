import React from 'react';
import { User } from '../types';
import { Reveal } from './Motion';
import { ShieldCheck, Lock, Video, Clock, ChevronRight, UserRound, Trophy, CalendarDays } from 'lucide-react';

interface VerificationGateProps {
  currentUser: User;
  onNavigate: (path: string) => void;
}

const LOCKED = [
  { label: 'Teammate Discovery', detail: 'Search and invite verified developers' },
  { label: 'Team Workspaces', detail: 'Create or join a hackathon squad' }
];

const OPEN = [
  { label: 'Your Profile', path: '/profile', icon: UserRound },
  { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { label: 'Hackathons', path: '/hackathons', icon: CalendarDays }
];

export const VerificationGate: React.FC<VerificationGateProps> = ({ currentUser, onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <Reveal className="relative rounded-[36px] bg-[#141022]/90 border border-purple-500/20 p-8 sm:p-12 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none animate-aurora"></div>
        <div className="absolute -left-24 -bottom-10 w-80 h-80 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none animate-aurora-slow"></div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-4 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-400/30">
              <Lock size={13} />
              Verification Required
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight font-display">
              One Proctored Test Away From<br className="hidden sm:block" />
              <span className="text-gradient">Your Next Hackathon Squad</span>
            </h1>

            <p className="text-sm text-purple-200/80 max-w-2xl leading-relaxed">
              SquadUP matches teammates on <strong className="text-white">verified</strong> skill badges, not
              self-claimed ones. Clear a single 20-MCQ proctored assessment to unlock teammate discovery and
              team workspaces{currentUser.role ? ` for ${currentUser.role}s` : ''}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="nixtio-card p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-2">
                <Lock size={13} /> Locked until verified
              </h3>
              <ul className="space-y-2.5">
                {LOCKED.map(item => (
                  <li key={item.label} className="text-xs">
                    <span className="font-bold text-white block">{item.label}</span>
                    <span className="text-purple-200/60">{item.detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="nixtio-card p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                <ShieldCheck size={13} /> Still open for you
              </h3>
              <ul className="space-y-1.5">
                {OPEN.map(item => (
                  <li key={item.label}>
                    <button
                      onClick={() => onNavigate(item.path)}
                      className="w-full flex items-center justify-between gap-2 text-xs font-semibold text-purple-200/80 hover:text-white transition-colors cursor-pointer group"
                    >
                      <span className="flex items-center gap-2">
                        <item.icon size={13} className="text-purple-400 group-hover:text-purple-300" />
                        {item.label}
                      </span>
                      <ChevronRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
              <Clock size={13} className="text-purple-300" /> 20 MCQs • 15 minutes
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
              <Video size={13} className="text-purple-300" /> Camera + mic required
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
              <ShieldCheck size={13} className="text-purple-300" /> Monitored live, never recorded
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('/assessment')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-wider transition shadow-xl hover:shadow-purple-500/40 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Start My Skill Assessment</span>
              <ChevronRight size={16} />
            </button>
            <p className="text-[11px] text-purple-200/50">
              Any badge — Green, Yellow or Red — unlocks discovery. You can retake a test anytime.
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
};
