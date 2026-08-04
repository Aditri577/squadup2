export type BadgeLevel = 'Green' | 'Yellow' | 'Red' | 'Unverified';

export type UserRole = 
  | 'Frontend Developer' 
  | 'Backend Developer' 
  | 'AI/ML Engineer' 
  | 'UI/UX Designer' 
  | 'Full Stack Developer' 
  | 'Data Scientist' 
  | 'DevOps Engineer';

export type SkillCategory = 
  | 'Frontend (React/JS)' 
  | 'Backend (Node/Express)' 
  | 'AI/ML (Python/PyTorch)' 
  | 'UI/UX Design' 
  | 'Full Stack Systems' 
  | 'Data Structures & Algorithms' 
  | 'Database Management (SQL)';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  selfRating: number; // 1 to 5
  badgeLevel: BadgeLevel;
  verifiedAt?: string;
  scorePercent?: number;
}

export interface AntiCheatLog {
  id: string;
  timestamp: string;
  event: 'TAB_SWITCH' | 'WINDOW_BLUR' | 'MOUSE_LEAVE' | 'COPY_PASTE_ATTEMPT' | 'FULLSCREEN_EXIT';
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Question {
  id: string;
  category: SkillCategory;
  skillName: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation: string;
  topic: string;
}

export interface TestResult {
  id: string;
  userId: string;
  skillName: string;
  category: SkillCategory;
  scorePercent: number;
  totalQuestions: number;
  correctCount: number;
  badgeLevel: BadgeLevel;
  warningCount: number;
  completedAt: string;
  topicBreakdown: Record<string, { correct: number; total: number }>;
  antiCheatLogs: AntiCheatLog[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  college: string;
  bio: string;
  location: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  skills: Skill[];
  testResults: TestResult[];
  preferredDomains: string[];
  lookingForTeam: boolean;
  teamId?: string;
  joinedAt: string;
}

export interface TeamMember {
  userId: string;
  role: UserRole;
  joinedAt: string;
  isLeader: boolean;
}

export interface Team {
  id: string;
  name: string;
  hackathonId: string;
  hackathonName: string;
  description: string;
  leaderId: string;
  members: TeamMember[];
  lookingForRoles: UserRole[];
  projectIdea?: {
    title: string;
    description: string;
    techStack: string[];
  };
  createdAt: string;
}

export interface TeamRequest {
  id: string;
  teamId: string;
  teamName: string;
  hackathonName: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: UserRole;
  receiverId: string;
  proposedRole: UserRole;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Hackathon {
  id: string;
  title: string;
  organizer: string;
  domain: string;
  banner: string;
  startDate: string;
  endDate: string;
  maxTeamSize: number;
  registeredTeamsCount: number;
  description: string;
  location: string;
  tags: string[];
  prizes: string;
}

export interface AIProjectIdea {
  title: string;
  description: string;
  techStack: string[];
  complexity: string;
  impact: string;
}
