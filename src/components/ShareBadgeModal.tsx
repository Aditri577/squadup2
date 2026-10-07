import React, { useRef, useState } from 'react';
import { BadgeLevel, User } from '../types';
import { useToast } from './Toast';
import { motion } from 'motion/react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  Award 
} from 'lucide-react';

interface ShareBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  skillName: string;
  badgeLevel: BadgeLevel;
  scorePercent?: number;
  completedAt?: string;
  warningCount?: number;
}

export const ShareBadgeModal: React.FC<ShareBadgeModalProps> = ({
  isOpen,
  onClose,
  user,
  skillName,
  badgeLevel,
  scorePercent = 85,
  completedAt,
  warningCount = 0
}) => {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const issueDate = completedAt 
    ? new Date(completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const credentialId = `SQUAD-VRF-${Math.abs(skillName.split('').reduce((a, b) => a + b.charCodeAt(0), 0) * 1337).toString(36).toUpperCase()}-${badgeLevel.toUpperCase()}`;

  const badgeConfig = {
    Green: {
      title: 'Verified Expert Mastery',
      subtitle: 'Top Tier • Hackathon Ready',
      border: 'border-emerald-500/50',
      bgGlow: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      pill: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
      accent: '#10b981',
      badgeColor: '#059669'
    },
    Yellow: {
      title: 'Verified Competent Builder',
      subtitle: 'Intermediate • Hackathon Ready',
      border: 'border-amber-500/50',
      bgGlow: 'from-amber-500/20 via-orange-500/10 to-transparent',
      pill: 'bg-amber-500/15 border-amber-500/40 text-amber-400',
      accent: '#f59e0b',
      badgeColor: '#d97706'
    },
    Red: {
      title: 'Verified Foundational Builder',
      subtitle: 'Foundational Knowledge Verified',
      border: 'border-rose-500/50',
      bgGlow: 'from-rose-500/20 via-purple-500/10 to-transparent',
      pill: 'bg-rose-500/15 border-rose-500/40 text-rose-400',
      accent: '#f43f5e',
      badgeColor: '#e11d48'
    },
    Unverified: {
      title: 'Builder Skill',
      subtitle: 'Assessment Pending',
      border: 'border-slate-700',
      bgGlow: 'from-slate-800 to-transparent',
      pill: 'bg-slate-800 border-slate-700 text-slate-400',
      accent: '#94a3b8',
      badgeColor: '#64748b'
    }
  }[badgeLevel] || {
    title: 'Verified Skill',
    subtitle: 'Proctored Credential',
    border: 'border-indigo-500/50',
    bgGlow: 'from-indigo-500/20 to-transparent',
    pill: 'bg-indigo-500/15 border-indigo-500/40 text-indigo-400',
    accent: '#6366f1',
    badgeColor: '#4f46e5'
  };

  // Text for sharing
  const shareText = `🛡️ I just earned a Verified ${badgeLevel} Skill Badge in ${skillName} (${scorePercent}%) on SquadUP!\nProctored with real-time AI anti-cheat for high-stakes hackathon team formation.\nVerify & squad up with me:`;

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://squadup.dev';
  const shareUrl = `${appUrl}/u/${user.id}`;

  const handleShareLinkedIn = () => {
    const text = encodeURIComponent(`${shareText}\n${shareUrl}\n\n#SquadUP #Hackathon #VerifiedDeveloper #BuildInPublic`);
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${text}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`Just proved my skills! ⚡ Earned a Verified ${badgeLevel} Badge in ${skillName} (${scorePercent}%) on @SquadUP platform.\n\nAI Proctored & Hackathon Ready 🚀`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}&hashtags=SquadUP,Hackathon,BuildInPublic,Developers`, '_blank');
  };

  const handleCopyLink = () => {
    const copyContent = `${shareText}\n${shareUrl}\nCredential ID: ${credentialId}`;
    navigator.clipboard.writeText(copyContent).then(() => {
      setCopied(true);
      toast.success('Credential link & summary copied to clipboard! 📋');
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // Generate downloadable high-res PNG Certificate Card using HTML5 Canvas
  const handleDownloadImage = () => {
    setDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 630;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Dark background
      ctx.fillStyle = '#07050f';
      ctx.fillRect(0, 0, 1200, 630);

      // Radial background gradient
      const gradient = ctx.createRadialGradient(600, 200, 50, 600, 315, 600);
      gradient.addColorStop(0, badgeLevel === 'Green' ? 'rgba(16, 185, 129, 0.25)' : badgeLevel === 'Yellow' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(168, 85, 247, 0.25)');
      gradient.addColorStop(1, 'rgba(7, 5, 15, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 630);

      // Card border
      ctx.strokeStyle = badgeConfig.accent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(40, 40, 1120, 550, 30);
      ctx.stroke();

      // Top brand
      ctx.fillStyle = '#a855f7';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.fillText('SQUADUP • VERIFIED BUILDER CREDENTIAL', 80, 100);

      // Verified Badge Pill
      ctx.fillStyle = badgeConfig.badgeColor;
      ctx.beginPath();
      ctx.roundRect(80, 125, 340, 40, 20);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.fillText(`★ ${badgeLevel.toUpperCase()} BADGE • ${scorePercent}% ACCURACY`, 95, 151);

      // Skill Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px system-ui, sans-serif';
      ctx.fillText(skillName, 80, 230);

      // Description
      ctx.fillStyle = '#94a3b8';
      ctx.font = '22px system-ui, sans-serif';
      ctx.fillText(`${badgeConfig.title} • Proctored 20-MCQ Evaluation Engine 2.0`, 80, 275);

      // Candidate Profile Section
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px system-ui, sans-serif';
      ctx.fillText(user.name, 80, 370);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '20px system-ui, sans-serif';
      ctx.fillText(`${user.role} • ${user.college || 'Verified Developer'}`, 80, 410);

      // Security & Credential Footer
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(80, 460);
      ctx.lineTo(1120, 460);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '16px monospace';
      ctx.fillText(`CREDENTIAL ID: ${credentialId}`, 80, 500);
      ctx.fillText(`ISSUE DATE: ${issueDate}`, 80, 530);
      ctx.fillText(`PROCTOR AUDIT: CLEAN (${warningCount} STRIKES) • FULLSCREEN VERIFIED`, 650, 500);
      ctx.fillText(`VERIFIED AT: squadup.dev/u/${user.id}`, 650, 530);

      // Download trigger
      const link = document.createElement('a');
      link.download = `squadup-credential-${user.name.toLowerCase().replace(/\s+/g, '-')}-${skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Verified Credential Card downloaded! 🏆');
    } catch (e) {
      console.error(e);
      toast.error('Failed to generate image download.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        className="bg-slate-950 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden"
      >
        {/* Glow backdrop */}
        <div className={`absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-30 bg-gradient-to-br ${badgeConfig.bgGlow} pointer-events-none`} />

        {/* Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Award size={18} />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Share Verified Credential</h3>
              <p className="text-xs text-slate-400">Prove your expertise to hackathon squads & recruiters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Live Luxury Credential Card Preview */}
        <div 
          ref={cardRef}
          className={`relative p-6 sm:p-7 rounded-2xl border ${badgeConfig.border} bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900/90 shadow-2xl space-y-5 overflow-hidden`}
        >
          {/* Subtle Watermark */}
          <div className="absolute right-3 -bottom-4 text-[90px] font-black text-white/5 pointer-events-none select-none">
            SQUAD
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
              <span className="font-mono uppercase font-bold tracking-widest text-slate-300 text-[11px]">
                SQUADUP CERTIFIED
              </span>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${badgeConfig.pill}`}>
              {badgeLevel} Tier • {scorePercent}%
            </span>
          </div>

          {/* Skill Title & Badging */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {skillName}
              </h4>
              <Sparkles size={18} className="text-amber-400 shrink-0" />
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {badgeConfig.title} — {badgeConfig.subtitle}
            </p>
          </div>

          {/* Candidate Bio */}
          <div className="flex items-center gap-3 pt-3 border-t border-white/5">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-11 h-11 rounded-full object-cover border-2 border-purple-500/40 shadow-md"
            />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-white truncate">{user.name}</div>
              <div className="text-xs text-slate-400 truncate">{user.role} • {user.college || 'Builder'}</div>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
              <ShieldCheck size={12} />
              <span>Proctored</span>
            </div>
          </div>

          {/* Verification Meta Footer */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5 text-[10px] font-mono text-slate-400">
            <div>
              <span className="text-slate-500 block">CREDENTIAL ID</span>
              <span className="text-slate-300 font-semibold truncate block">{credentialId}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">ISSUED</span>
              <span className="text-slate-300 font-semibold">{issueDate}</span>
            </div>
          </div>
        </div>

        {/* Social Share CTAs */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Share Directly
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* LinkedIn */}
            <button
              onClick={handleShareLinkedIn}
              className="w-full py-3 px-4 rounded-xl bg-[#0a66c2] hover:bg-[#084e96] text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-900/20"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24" />
              </svg>
              <span>Post on LinkedIn</span>
            </button>

            {/* X / Twitter */}
            <button
              onClick={handleShareTwitter}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>Share on X (Twitter)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {/* Copy Summary */}
            <button
              onClick={handleCopyLink}
              className="w-full py-2.5 px-3.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied Link!' : 'Copy Credential Link'}</span>
            </button>

            {/* Download Certificate Image */}
            <button
              onClick={handleDownloadImage}
              disabled={downloading}
              className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-900/30 disabled:opacity-50"
            >
              <Download size={14} />
              <span>{downloading ? 'Generating PNG...' : 'Download Card PNG'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
