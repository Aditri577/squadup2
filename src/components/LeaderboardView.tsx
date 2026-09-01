import React, { useState } from 'react';
import { User, TeammateFeedback } from '../types';
import { renderAvatar } from '../utils/avatars';
import { Trophy, Star, Award, Search, School, Zap } from 'lucide-react';

interface LeaderboardViewProps {
  allUsers: User[];
  feedbacks: TeammateFeedback[];
  currentUser: User;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ allUsers, feedbacks, currentUser }) => {
  const [filterRole, setFilterRole] = useState<string>('All');
  const [filterCollege, setFilterCollege] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Calculate stats for users
  const usersWithStats = allUsers.map(user => {
    // Teammate feedback average rating
    const userFeedbacks = feedbacks.filter(f => f.receiverId === user.id);
    const avgRating = userFeedbacks.length > 0 
      ? Number((userFeedbacks.reduce((sum, f) => sum + f.rating, 0) / userFeedbacks.length).toFixed(1))
      : 0;

    // Green / Yellow badge count
    const greenBadges = user.skills.filter(s => s.badgeLevel === 'Green').length;
    const yellowBadges = user.skills.filter(s => s.badgeLevel === 'Yellow').length;
    
    return {
      ...user,
      xpPoints: user.xpPoints || 100,
      level: user.level || 1,
      avgRating,
      reviewCount: userFeedbacks.length,
      greenBadges,
      yellowBadges
    };
  });

  // Sort by XP Points desc
  const sortedUsers = [...usersWithStats].sort((a, b) => b.xpPoints - a.xpPoints);

  // Get unique lists for filtering
  const colleges = ['All', ...Array.from(new Set(allUsers.map(u => u.college).filter(Boolean)))];
  const roles = ['All', ...Array.from(new Set(allUsers.map(u => u.role).filter(Boolean)))];

  // Apply filters
  const filteredUsers = sortedUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.college.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'All' || u.role === filterRole;
    const matchesCollege = filterCollege === 'All' || u.college === filterCollege;
    return matchesSearch && matchesRole && matchesCollege;
  });

  // Top 3 Podium
  const topThree = sortedUsers.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            🏆 Global Squad Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Check global rankings, level levels, and points earned via skill badges and teammate endorsements.
          </p>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {searchQuery === '' && filterRole === 'All' && filterCollege === 'All' && topThree.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 items-end">
          
          {/* 2nd Place */}
          {topThree[1] && (
            <div className="bg-[#141024]/80 border border-slate-800 rounded-3xl p-6 text-center space-y-4 md:order-1 relative glow-cyan/10">
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center">
                2nd
              </div>
              <div className="w-20 h-20 mx-auto rounded-[24px] bg-slate-900 border-2 border-cyan-400/50 p-1 flex items-center justify-center shadow-lg">
                {renderAvatar(topThree[1].avatar, "w-full h-full")}
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base truncate">{topThree[1].name}</h3>
                <p className="text-xs text-cyan-400 font-bold mt-0.5">{topThree[1].role}</p>
                <p className="text-[11px] text-slate-400 truncate">{topThree[1].college}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-900/30 flex items-center justify-between text-xs font-extrabold">
                <span className="text-slate-400">Level {topThree[1].level}</span>
                <span className="text-cyan-300">{topThree[1].xpPoints} XP</span>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {topThree[0] && (
            <div className="bg-[#1a1130]/90 border-2 border-purple-500/40 rounded-3xl p-8 text-center space-y-4 md:order-2 transform md:-translate-y-4 relative shadow-[0_15px_40px_rgba(168,85,247,0.2)]">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-amber-500 border-2 border-white text-slate-950 font-black text-sm flex items-center justify-center animate-bounce-short">
                👑
              </div>
              <div className="w-24 h-24 mx-auto rounded-[28px] bg-slate-900 border-4 border-purple-500 p-1 flex items-center justify-center shadow-2xl">
                {renderAvatar(topThree[0].avatar, "w-full h-full")}
              </div>
              <div>
                <h3 className="font-black text-white text-lg truncate">{topThree[0].name}</h3>
                <p className="text-xs text-purple-400 font-black mt-0.5">{topThree[0].role}</p>
                <p className="text-xs text-slate-300 truncate">{topThree[0].college}</p>
              </div>
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-900/40 flex items-center justify-between text-xs font-black">
                <span className="text-purple-300">LEVEL {topThree[0].level}</span>
                <span className="text-purple-400">{topThree[0].xpPoints} XP</span>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <div className="bg-[#141024]/80 border border-slate-800 rounded-3xl p-6 text-center space-y-4 md:order-3 relative glow-amber/10">
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 font-bold text-xs flex items-center justify-center">
                3rd
              </div>
              <div className="w-20 h-20 mx-auto rounded-[24px] bg-slate-900 border-2 border-amber-600/40 p-1 flex items-center justify-center shadow-lg">
                {renderAvatar(topThree[2].avatar, "w-full h-full")}
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base truncate">{topThree[2].name}</h3>
                <p className="text-xs text-amber-500 font-bold mt-0.5">{topThree[2].role}</p>
                <p className="text-[11px] text-slate-400 truncate">{topThree[2].college}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-900/30 flex items-center justify-between text-xs font-extrabold">
                <span className="text-slate-400">Level {topThree[2].level}</span>
                <span className="text-amber-400">{topThree[2].xpPoints} XP</span>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Filter and Search controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/80 p-5 rounded-3xl border border-slate-800 backdrop-blur-xl">
        <div className="md:col-span-2 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search developers by name, role or college..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500 font-semibold cursor-pointer"
          >
            <option value="All">All Roles</option>
            {roles.filter(r => r !== 'All').map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filterCollege}
            onChange={(e) => setFilterCollege(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500 font-semibold cursor-pointer"
          >
            <option value="All">All Colleges</option>
            {colleges.filter(c => c !== 'All').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Leaderboard Table List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] font-bold tracking-widest uppercase bg-slate-950/40">
                <th className="py-4 px-6 text-center w-16">Rank</th>
                <th className="py-4 px-6">Developer</th>
                <th className="py-4 px-6">Primary Role</th>
                <th className="py-4 px-6">Badges & Endorsements</th>
                <th className="py-4 px-6 text-right">XP Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
              {filteredUsers.map((u, index) => {
                const originalRank = sortedUsers.findIndex(su => su.id === u.id) + 1;
                const isSelf = u.id === currentUser.id;

                return (
                  <tr 
                    key={u.id} 
                    className={`hover:bg-slate-950/40 transition-colors ${
                      isSelf ? 'bg-purple-950/15 border-l-4 border-l-purple-500' : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-6 text-center font-bold text-slate-200">
                      {originalRank === 1 ? (
                        <span className="text-xl">🥇</span>
                      ) : originalRank === 2 ? (
                        <span className="text-xl">🥈</span>
                      ) : originalRank === 3 ? (
                        <span className="text-xl">🥉</span>
                      ) : (
                        `#${originalRank}`
                      )}
                    </td>

                    {/* Developer Name, Avatar, College */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center p-0.5 overflow-hidden shrink-0">
                          {renderAvatar(u.avatar, "w-full h-full")}
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold text-white flex items-center gap-1.5">
                            <span className="truncate">{u.name}</span>
                            {isSelf && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1 truncate mt-0.5">
                            <School size={10} />
                            {u.college}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role badge */}
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-950 border border-slate-800 text-slate-300">
                        {u.role}
                      </span>
                    </td>

                    {/* Verified Badges & Teammate rating */}
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Rating */}
                        {u.reviewCount > 0 && (
                          <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg text-[10px]">
                            <Star size={10} className="fill-amber-400" />
                            <span>{u.avgRating} ({u.reviewCount})</span>
                          </div>
                        )}
                        {/* Badges count */}
                        {u.greenBadges > 0 && (
                          <div className="flex items-center gap-0.5 text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg text-[10px]">
                            <Award size={10} />
                            <span>{u.greenBadges} Green</span>
                          </div>
                        )}
                        {u.yellowBadges > 0 && (
                          <div className="flex items-center gap-0.5 text-yellow-400 font-bold bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-lg text-[10px]">
                            <Award size={10} />
                            <span>{u.yellowBadges} Yellow</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Level & XP */}
                    <td className="py-4 px-6 text-right font-extrabold">
                      <div className="inline-block text-right">
                        <p className="text-white text-xs flex items-center justify-end gap-1.5">
                          <Zap size={12} className="text-purple-400" />
                          <span>{u.xpPoints} XP</span>
                        </p>
                        <p className="text-[10px] text-purple-400 mt-0.5 font-bold uppercase tracking-wider">
                          Level {u.level}
                        </p>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500 text-xs font-semibold">
                    No developers match the specified filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};
