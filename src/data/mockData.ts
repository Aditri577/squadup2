import { User, Hackathon, Team, TeamRequest } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-aditi',
    name: 'Aditi Saxena',
    email: 'aditi.saxena@example.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    role: 'Full Stack Developer',
    college: 'IIT Delhi',
    bio: 'Passionate about building scalable web apps and AI-powered team tools. 3x Hackathon winner.',
    location: 'New Delhi, India',
    github: 'https://github.com/aditisaxena',
    linkedin: 'https://linkedin.com/in/aditisaxena',
    portfolio: 'https://aditisaxena.dev',
    preferredDomains: ['AI/GenAI', 'EdTech', 'FinTech'],
    lookingForTeam: true,
    teamId: 'team-squadup-core',
    joinedAt: '2026-01-15',
    experience: 'Advanced (3+ yrs)',
    availability: 'Weekends',
    hackathons: ['AI Innovations Global Hackathon 2026', 'SIH 2026'],
    skills: [
      {
        id: 'sk-1',
        name: 'React.js',
        category: 'Frontend (React/JS)',
        selfRating: 5,
        badgeLevel: 'Green',
        scorePercent: 95,
        verifiedAt: '2026-07-20'
      },
      {
        id: 'sk-2',
        name: 'Node.js & Express',
        category: 'Backend (Node/Express)',
        selfRating: 4,
        badgeLevel: 'Green',
        scorePercent: 85,
        verifiedAt: '2026-07-22'
      },
      {
        id: 'sk-3',
        name: 'PostgreSQL & SQL',
        category: 'Database Management (SQL)',
        selfRating: 4,
        badgeLevel: 'Yellow',
        scorePercent: 75,
        verifiedAt: '2026-07-25'
      },
      {
        id: 'sk-4',
        name: 'Python & PyTorch',
        category: 'AI/ML (Python/PyTorch)',
        selfRating: 3,
        badgeLevel: 'Red',
        scorePercent: 65,
        verifiedAt: '2026-07-28'
      }
    ],
    testResults: [
      {
        id: 'tr-1',
        userId: 'user-aditi',
        skillName: 'React.js',
        category: 'Frontend (React/JS)',
        scorePercent: 95,
        totalQuestions: 20,
        correctCount: 19,
        badgeLevel: 'Green',
        warningCount: 0,
        completedAt: '2026-07-20T10:30:00Z',
        topicBreakdown: {
          'Hooks & State': { correct: 5, total: 5 },
          'Virtual DOM': { correct: 5, total: 5 },
          'Performance': { correct: 4, total: 5 },
          'TypeScript': { correct: 5, total: 5 }
        },
        antiCheatLogs: [
          {
            id: 'acl-1',
            timestamp: '2026-07-20T10:15:00Z',
            event: 'FULLSCREEN_EXIT',
            message: 'Fullscreen active during assessment',
            severity: 'low'
          }
        ]
      }
    ]
  },
  {
    id: 'user-rohan',
    name: 'Rohan Mehta',
    email: 'rohan.m@example.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    role: 'AI/ML Engineer',
    college: 'BITS Pilani',
    bio: 'Specializing in PyTorch, Transformer fine-tuning, and LLM RAG pipelines. Kaggle Notebook Expert.',
    location: 'Bengaluru, India',
    github: 'https://github.com/rohanml',
    linkedin: 'https://linkedin.com/in/rohanmehta-ai',
    preferredDomains: ['AI/GenAI', 'HealthTech'],
    lookingForTeam: true,
    joinedAt: '2026-02-01',
    experience: 'Intermediate (1-3 yrs)',
    availability: 'Weekdays',
    hackathons: ['AI Innovations Global Hackathon 2026'],
    skills: [
      {
        id: 'sk-5',
        name: 'Python & PyTorch',
        category: 'AI/ML (Python/PyTorch)',
        selfRating: 5,
        badgeLevel: 'Green',
        scorePercent: 90,
        verifiedAt: '2026-07-18'
      },
      {
        id: 'sk-6',
        name: 'Data Structures & Algorithms',
        category: 'Data Structures & Algorithms',
        selfRating: 4,
        badgeLevel: 'Green',
        scorePercent: 85,
        verifiedAt: '2026-07-19'
      }
    ],
    testResults: [
      {
        id: 'tr-2',
        userId: 'user-rohan',
        skillName: 'Python & PyTorch',
        category: 'AI/ML (Python/PyTorch)',
        scorePercent: 90,
        totalQuestions: 20,
        correctCount: 18,
        badgeLevel: 'Green',
        warningCount: 0,
        completedAt: '2026-07-18T14:20:00Z',
        topicBreakdown: {
          'Model Training': { correct: 5, total: 5 },
          'Transformers': { correct: 5, total: 5 },
          'Autograd': { correct: 4, total: 5 },
          'LLMs & GenAI': { correct: 4, total: 5 }
        },
        antiCheatLogs: []
      }
    ]
  },
  {
    id: 'user-priya',
    name: 'Priya Sharma',
    email: 'priya.ux@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    role: 'UI/UX Designer',
    college: 'NID Ahmedabad',
    bio: 'Crafting pixel-perfect design systems, WCAG-accessible interfaces, and interactive Figma prototypes.',
    location: 'Mumbai, India',
    github: 'https://github.com/priyadesigns',
    linkedin: 'https://linkedin.com/in/priyasharmadesign',
    portfolio: 'https://priyasharma.design',
    preferredDomains: ['FinTech', 'Social Good', 'EdTech'],
    lookingForTeam: true,
    teamId: 'team-squadup-core',
    joinedAt: '2026-03-10',
    experience: 'Advanced (3+ yrs)',
    availability: 'Weekends',
    hackathons: ['DesignJam National UX Challenge', 'SIH 2026'],
    skills: [
      {
        id: 'sk-7',
        name: 'Figma & UI/UX',
        category: 'UI/UX Design',
        selfRating: 5,
        badgeLevel: 'Green',
        scorePercent: 90,
        verifiedAt: '2026-07-29'
      },
      {
        id: 'sk-8',
        name: 'Frontend Fundamentals',
        category: 'Frontend (React/JS)',
        selfRating: 3,
        badgeLevel: 'Yellow',
        scorePercent: 75,
        verifiedAt: '2026-07-30'
      }
    ],
    testResults: []
  },
  {
    id: 'user-vikram',
    name: 'Vikram Patel',
    email: 'vikram.backend@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    role: 'Backend Developer',
    college: 'IIT Bombay',
    bio: 'Distributed systems, Go, Node.js microservices, PostgreSQL query optimization, and Redis caching.',
    location: 'Pune, India',
    github: 'https://github.com/vikramdev',
    linkedin: 'https://linkedin.com/in/vikrampatel-backend',
    preferredDomains: ['Web3', 'FinTech', 'Cloud/Infra'],
    lookingForTeam: true,
    joinedAt: '2026-04-05',
    experience: 'Advanced (3+ yrs)',
    availability: 'Part-time',
    hackathons: ['FinTech Future Sprint 2026', 'SIH 2026'],
    skills: [
      {
        id: 'sk-9',
        name: 'Node.js & Express',
        category: 'Backend (Node/Express)',
        selfRating: 5,
        badgeLevel: 'Green',
        scorePercent: 95,
        verifiedAt: '2026-07-10'
      },
      {
        id: 'sk-10',
        name: 'PostgreSQL Databases',
        category: 'Database Management (SQL)',
        selfRating: 5,
        badgeLevel: 'Green',
        scorePercent: 90,
        verifiedAt: '2026-07-12'
      },
      {
        id: 'sk-11',
        name: 'Full Stack Systems',
        category: 'Full Stack Systems',
        selfRating: 4,
        badgeLevel: 'Green',
        scorePercent: 85,
        verifiedAt: '2026-07-15'
      }
    ],
    testResults: []
  },
  {
    id: 'user-ananya',
    name: 'Ananya Verma',
    email: 'ananya.dev@example.edu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    role: 'Frontend Developer',
    college: 'DTU Delhi',
    bio: 'React, Tailwind CSS, Motion animations, and Web performance geek. Looking to build futuristic UIs.',
    location: 'Delhi, India',
    github: 'https://github.com/ananyaverma',
    linkedin: 'https://linkedin.com/in/ananyaverma',
    preferredDomains: ['AI/GenAI', 'FinTech'],
    lookingForTeam: true,
    joinedAt: '2026-05-12',
    experience: 'Beginner (<1 yr)',
    availability: 'Weekends',
    hackathons: ['AI Innovations Global Hackathon 2026', 'SIH 2026'],
    skills: [
      {
        id: 'sk-12',
        name: 'React.js',
        category: 'Frontend (React/JS)',
        selfRating: 4,
        badgeLevel: 'Yellow',
        scorePercent: 75,
        verifiedAt: '2026-07-26'
      }
    ],
    testResults: []
  },
  {
    id: 'user-kabir',
    name: 'Kabir Das',
    email: 'kabir.ds@example.edu',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250',
    role: 'Data Scientist',
    college: 'IIIT Hyderabad',
    bio: 'Data visualization with D3.js & Recharts, predictive analytics, NumPy, Pandas, and Scikit-Learn.',
    location: 'Hyderabad, India',
    github: 'https://github.com/kabirdas',
    linkedin: 'https://linkedin.com/in/kabirdas-ds',
    preferredDomains: ['HealthTech', 'Social Good'],
    lookingForTeam: true,
    joinedAt: '2026-06-01',
    experience: 'Intermediate (1-3 yrs)',
    availability: 'Weekdays',
    hackathons: ['FinTech Future Sprint 2026'],
    skills: [
      {
        id: 'sk-13',
        name: 'Python & AI/ML',
        category: 'AI/ML (Python/PyTorch)',
        selfRating: 4,
        badgeLevel: 'Green',
        scorePercent: 80,
        verifiedAt: '2026-07-14'
      },
      {
        id: 'sk-14',
        name: 'SQL Databases',
        category: 'Database Management (SQL)',
        selfRating: 4,
        badgeLevel: 'Yellow',
        scorePercent: 75,
        verifiedAt: '2026-07-16'
      }
    ],
    testResults: []
  }
];

export const INITIAL_HACKATHONS: Hackathon[] = [
  {
    id: 'hack-1',
    title: 'AI Innovations Global Hackathon 2026',
    organizer: 'Google Cloud & AI Studio',
    domain: 'AI/GenAI',
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
    startDate: '2026-08-15',
    endDate: '2026-08-17',
    maxTeamSize: 4,
    registeredTeamsCount: 142,
    description: 'Build cutting-edge GenAI applications utilizing server-side Gemini models, multimodal agents, and real-time workflows.',
    location: 'Online / Virtual',
    tags: ['Gemini API', 'PyTorch', 'React', 'Full Stack'],
    prizes: '$25,000 in Cash & Cloud Credits'
  },
  {
    id: 'hack-2',
    title: 'FinTech Future Sprint 2026',
    organizer: 'National Banking Association',
    domain: 'FinTech',
    banner: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1000',
    startDate: '2026-08-25',
    endDate: '2026-08-27',
    maxTeamSize: 4,
    registeredTeamsCount: 88,
    description: 'Revolutionizing financial inclusion, fraud detection systems, instant micro-payments, and automated credit scoring.',
    location: 'Hybrid - Bengaluru',
    tags: ['Node.js', 'PostgreSQL', 'Security', 'React'],
    prizes: '₹10,000,000 Incubation Fund'
  },
  {
    id: 'hack-3',
    title: 'DesignJam National UX Challenge',
    organizer: 'India Design Council',
    domain: 'UI/UX Design',
    banner: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=1000',
    startDate: '2026-09-01',
    endDate: '2026-09-03',
    maxTeamSize: 3,
    registeredTeamsCount: 65,
    description: 'Designing intuitive, accessible, and high-impact digital experiences for rural healthcare and vernacular education.',
    location: 'Virtual',
    tags: ['Figma', 'Accessibility', 'Research', 'Prototyping'],
    prizes: 'Design Internships & $10,000'
  },
  {
    id: 'hack-4',
    title: 'SIH 2026',
    organizer: 'Ministry of Education, Government of India',
    domain: 'Social Good',
    banner: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000',
    startDate: '2026-10-10',
    endDate: '2026-10-12',
    maxTeamSize: 6,
    registeredTeamsCount: 2350,
    description: 'Smart India Hackathon 2026 - a nationwide initiative to provide students with a platform to solve some of the pressing problems we face in our daily lives.',
    location: 'Nodal Centers Across India',
    tags: ['IoT', 'AI/ML', 'Agriculture', 'Healthcare', 'Cybersecurity', 'Web/Mobile App'],
    prizes: '₹1,00,000 per Problem Statement'
  }
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-squadup-core',
    name: 'Team Nexus',
    hackathonId: 'hack-1',
    hackathonName: 'AI Innovations Global Hackathon 2026',
    description: 'Building SquadUP - a verified skill-based team recommendation and anti-cheat assessment workspace.',
    leaderId: 'user-aditi',
    createdAt: '2026-07-20',
    lookingForRoles: ['Backend Developer', 'AI/ML Engineer'],
    members: [
      {
        userId: 'user-aditi',
        role: 'Full Stack Developer',
        joinedAt: '2026-07-20',
        isLeader: true
      },
      {
        userId: 'user-priya',
        role: 'UI/UX Designer',
        joinedAt: '2026-07-22',
        isLeader: false
      }
    ],
    projectIdea: {
      title: 'SquadUP Verified Team Matcher',
      description: 'A platform ensuring hackathon teammates possess verified technical abilities with automated proctored tests and skill-gap balance analytics.',
      techStack: ['React', 'Express', 'Gemini AI', 'Tailwind CSS']
    }
  },
  {
    id: 'team-neural-surge',
    name: 'NeuralSurge',
    hackathonId: 'hack-1',
    hackathonName: 'AI Innovations Global Hackathon 2026',
    description: 'Developing real-time multimodal healthcare diagnostics using medical imaging and speech synthesis.',
    leaderId: 'user-rohan',
    createdAt: '2026-07-21',
    lookingForRoles: ['Frontend Developer', 'UI/UX Designer'],
    members: [
      {
        userId: 'user-rohan',
        role: 'AI/ML Engineer',
        joinedAt: '2026-07-21',
        isLeader: true
      },
      {
        userId: 'user-kabir',
        role: 'Data Scientist',
        joinedAt: '2026-07-23',
        isLeader: false
      }
    ]
  }
];

export const INITIAL_REQUESTS: TeamRequest[] = [
  {
    id: 'req-1',
    teamId: 'team-neural-surge',
    teamName: 'NeuralSurge',
    hackathonName: 'AI Innovations Global Hackathon 2026',
    senderId: 'user-rohan',
    senderName: 'Rohan Mehta',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    senderRole: 'AI/ML Engineer',
    receiverId: 'user-aditi',
    proposedRole: 'Frontend Developer',
    message: 'Hey Aditi! We saw your Green Badge in React.js. We need a frontend lead to join NeuralSurge for AI Innovations Hackathon.',
    status: 'pending',
    createdAt: '2026-08-01T12:00:00Z'
  },
  {
    id: 'req-2',
    teamId: 'team-squadup-core',
    teamName: 'Team Nexus',
    hackathonName: 'AI Innovations Global Hackathon 2026',
    senderId: 'user-aditi',
    senderName: 'Aditi Saxena',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    senderRole: 'Full Stack Developer',
    receiverId: 'user-vikram',
    proposedRole: 'Backend Developer',
    message: 'Hi Vikram, loved your Green badge in PostgreSQL & Express. Join Team Nexus for the upcoming AI Hackathon!',
    status: 'pending',
    createdAt: '2026-08-02T15:30:00Z'
  }
];
