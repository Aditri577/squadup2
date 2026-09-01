import { User, UserRole } from '../types';

export interface MatchResult {
  score: number; // 0 to 100
  label: 'Perfect Match' | 'High Synergy' | 'Good Fit' | 'Moderate Fit';
  badgeColor: string;
  highlights: string[];
}

export function calculateUserMatchScore(
  candidate: User,
  targetRolesNeeded: UserRole[] = [],
  preferredDomains: string[] = []
): MatchResult {
  let score = 50; // Base score
  const highlights: string[] = [];

  // 1. Role match
  const roleMatch = targetRolesNeeded.includes(candidate.role);
  if (roleMatch) {
    score += 25;
    highlights.push(`Direct Role Match: ${candidate.role}`);
  }

  // 2. Verified skill badges
  const greenBadges = candidate.skills.filter(s => s.badgeLevel === 'Green');
  const yellowBadges = candidate.skills.filter(s => s.badgeLevel === 'Yellow');

  if (greenBadges.length > 0) {
    score += Math.min(greenBadges.length * 8, 20);
    highlights.push(`${greenBadges.length} Green Verified Badges (${greenBadges.map(s => s.name).join(', ')})`);
  }

  if (yellowBadges.length > 0) {
    score += Math.min(yellowBadges.length * 4, 10);
  }

  // 3. Domain match
  const sharedDomains = candidate.preferredDomains?.filter(d => preferredDomains.includes(d)) || [];
  if (sharedDomains.length > 0) {
    score += 10;
    highlights.push(`Shared Interest: ${sharedDomains.join(', ')}`);
  } else if (candidate.preferredDomains && candidate.preferredDomains.length > 0) {
    score += 5;
  }

  // Cap score between 65% and 99% for active candidates
  const finalScore = Math.min(Math.max(score, 68), 99);

  let label: MatchResult['label'] = 'Good Fit';
  let badgeColor = 'text-blue-400 bg-blue-500/10 border-blue-500/30';

  if (finalScore >= 90) {
    label = 'Perfect Match';
    badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 glow-emerald';
  } else if (finalScore >= 80) {
    label = 'High Synergy';
    badgeColor = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30 glow-cyan';
  } else if (finalScore >= 70) {
    label = 'Good Fit';
    badgeColor = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
  } else {
    label = 'Moderate Fit';
    badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  }

  return {
    score: finalScore,
    label,
    badgeColor,
    highlights: highlights.length > 0 ? highlights : ['Verified Tech Proficiency']
  };
}
