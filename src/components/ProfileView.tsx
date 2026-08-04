import React, { useState } from 'react';
import { User, Skill, TestResult } from '../types';
import { BadgePill } from './BadgePill';
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
  RotateCcw
} from 'lucide-react';

interface ProfileViewProps {
  user: User;
  isCurrentUser: boolean;
  onUpdateProfile?: (updatedUser: User) => void;
  onTakeTestClick?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  isCurrentUser,
  onUpdateProfile,
  onTakeTestClick
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user.bio);
  const [college, setCollege] = useState(user.college);
  const [location, setLocation] = useState(user.location);
  const [github, setGithub] = useState(user.github || '');
  const [linkedin, setLinkedin] = useState(user.linkedin || '');
  const [portfolio, setPortfolio] = useState(user.portfolio || '');

  const handleSaveProfile = () => {
    if (!onUpdateProfile) return;
    const updated: User = {
      ...user,
      bio,
      college,
      location,
      github,
      linkedin,
      portfolio
    };
    onUpdateProfile(updated);
    setIsEditing(false);
    alert('Profile information updated successfully!');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-indigo-500/20 shadow-md shrink-0"
            />

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {user.name}
                </h1>
                <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold">
                  {user.role}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <GraduationCap size={14} />
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={college} 
                      onChange={e => setCollege(e.target.value)}
                      className="px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    />
                  ) : user.college}
                </span>

                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={location} 
                      onChange={e => setLocation(e.target.value)}
                      className="px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    />
                  ) : user.location}
                </span>
              </div>

              {/* Bio */}
              <div className="pt-1">
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    className="w-full p-2 text-xs rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                ) : (
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
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
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Save size={14} />
                  <span>Save Changes</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Edit3 size={14} />
                  <span>Edit Profile</span>
                </button>
              )
            )}

            {/* Social Buttons */}
            <div className="flex items-center gap-2">
              {user.github && (
                <a href={user.github} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600">
                  <Github size={16} />
                </a>
              )}
              {user.linkedin && (
                <a href={user.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600">
                  <Linkedin size={16} />
                </a>
              )}
              {user.portfolio && (
                <a href={user.portfolio} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600">
                  <Globe size={16} />
                </a>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Verified Skill Badges Showcase */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="text-indigo-600" size={22} />
              <span>Verified Skill Badges</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Proctored 20-MCQ assessment results for candidate verification
            </p>
          </div>

          {isCurrentUser && onTakeTestClick && (
            <button
              onClick={onTakeTestClick}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
            >
              Take Skill Assessment
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.skills.map(sk => (
            <div key={sk.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <div className="flex items-start justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {sk.name}
                </span>
                <BadgePill level={sk.badgeLevel} scorePercent={sk.scorePercent} showScore />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Self Rating: {'★'.repeat(sk.selfRating)}</span>
                {sk.verifiedAt && <span>Verified: {sk.verifiedAt}</span>}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Self-Claimed vs Verified Contrast Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="pb-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="text-emerald-600" size={22} />
            <span>Self-Claimed vs Verified Technical Ability Contrast</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            SquadUP replaces self-claimed ratings with objective proctored test results
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Skill Name</th>
                <th className="py-3 px-4">Self-Claimed Rating</th>
                <th className="py-3 px-4">SquadUP Proctored Badge</th>
                <th className="py-3 px-4">Score %</th>
                <th className="py-3 px-4">Integrity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {user.skills.map(sk => (
                <tr key={sk.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {sk.name}
                  </td>
                  <td className="py-3.5 px-4 text-amber-500">
                    {'★'.repeat(sk.selfRating)}{'☆'.repeat(5 - sk.selfRating)} ({sk.selfRating}/5)
                  </td>
                  <td className="py-3.5 px-4">
                    <BadgePill level={sk.badgeLevel} />
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                    {sk.scorePercent !== undefined ? `${sk.scorePercent}%` : 'Not Taken'}
                  </td>
                  <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    Verified Legitimate
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proctored Assessment Audit Logs */}
      {user.testResults && user.testResults.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Assessment History & Security Logs
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Audit log of completed tests and proctoring telemetry
            </p>
          </div>

          <div className="space-y-4">
            {user.testResults.map(tr => (
              <div key={tr.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {tr.category}
                    </span>
                    <BadgePill level={tr.badgeLevel} scorePercent={tr.scorePercent} showScore />
                  </div>

                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar size={13} /> {new Date(tr.completedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300">
                  Total Score: <strong>{tr.correctCount} / {tr.totalQuestions} ({tr.scorePercent}%)</strong> • Anti-Cheat Security Flags: <strong>{tr.warningCount}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
