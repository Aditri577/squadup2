import React, { useState, useEffect, useRef } from 'react';
import { User, SkillCategory, Question, TestResult, AntiCheatLog, BadgeLevel, DifficultyLevel } from '../types';
import { getRandomQuestions } from '../data/questionBank';
import { BadgePill } from './BadgePill';
import { useProctoring, useFaceTracking } from '../utils/useProctoring';
import confetti from 'canvas-confetti';
import { useToast } from './Toast';
import { ShareBadgeModal } from './ShareBadgeModal';
import { 
  Award, 
  ShieldAlert, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  ChevronRight, 
  ChevronLeft,
  FileCheck,
  Eye,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Zap,
  ArrowRight,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Ban,
  ScanFace,
  Volume2,
  Share2
} from 'lucide-react';

interface AssessmentViewProps {
  currentUser: User;
  onUpdateUserSkills: (updatedUser: User) => void;
}

// Three strikes and the session auto-submits with a termination flag.
const MAX_VIOLATIONS = 3;
// Events serious enough to cost a strike; the rest are logged only.
const STRIKE_EVENTS: AntiCheatLog['event'][] = [
  'TAB_SWITCH', 'FULLSCREEN_EXIT', 'CAMERA_OFF', 'MIC_MUTED',
  'FACE_LOOK_AWAY', 'VOICE_DISCUSSION_DETECTED', 'DEVTOOLS_ATTEMPT'
];


const CATEGORIES: { name: SkillCategory; desc: string; icon: string }[] = [
  { name: 'Frontend (React/JS)', desc: 'React 18+, Virtual DOM, Hooks, ES6, State & Async JS', icon: '⚛️' },
  { name: 'Backend (Node/Express)', desc: 'Event Loop, Middleware, REST APIs, Streams, JWT Auth & Security', icon: '🟢' },
  { name: 'AI/ML (Python/PyTorch)', desc: 'PyTorch Tensors, Autograd, Transformers, RAG & GenAI Models', icon: '🤖' },
  { name: 'UI/UX Design', desc: 'WCAG Contrast, 8pt Grid, Fitts’s & Hick’s Law, Color Theory & Figma', icon: '🎨' },
  { name: 'Data Structures & Algorithms', desc: 'Trees, Graphs, Dynamic Programming, Complexity & Hash Maps', icon: '⚡' },
  { name: 'Database Management (SQL)', desc: 'PostgreSQL, B-Tree Indexing, ACID, 3NF Normalization & Joins', icon: '🗄️' },
  { name: 'Full Stack Systems', desc: 'System Design, Load Balancers, Redis, Docker, WebSockets & Security', icon: '🌐' }
];

export const AssessmentView: React.FC<AssessmentViewProps> = ({ currentUser, onUpdateUserSkills }) => {
  const toast = useToast();
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(null);
  const [testState, setTestState] = useState<'idle' | 'briefing' | 'active' | 'completed'>('idle');
  const [launching, setLaunching] = useState<boolean>(false);
  
  // Test Active State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(15 * 60); // 15 minutes = 900 seconds
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  // Anti-Cheat Monitoring
  const [antiCheatLogs, setAntiCheatLogs] = useState<AntiCheatLog[]>([]);
  const [warningCount, setWarningCount] = useState<number>(0);
  const [latestWarning, setLatestWarning] = useState<string | null>(null);

  // Result state
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Hidden offscreen canvas for face-tracking frame analysis
  const faceCanvasRef = useRef<HTMLCanvasElement>(null);

  // Event listeners are registered once per session, so they read the live values
  // through refs instead of the stale render closure they were created in.
  const questionsRef = useRef<Question[]>([]);
  const answersRef = useRef<Record<number, number>>({});
  const logsRef = useRef<AntiCheatLog[]>([]);
  const strikesRef = useRef<number>(0);
  const categoryRef = useRef<SkillCategory | null>(null);
  const testStateRef = useRef<'idle' | 'briefing' | 'active' | 'completed'>('idle');

  const enterState = (next: 'idle' | 'briefing' | 'active' | 'completed') => {
    testStateRef.current = next;
    setTestState(next);
  };

  const logAntiCheatEvent = (
    event: AntiCheatLog['event'], 
    message: string, 
    severity: AntiCheatLog['severity'] = 'medium'
  ) => {
    if (testStateRef.current !== 'active') return;

    const newLog: AntiCheatLog = {
      id: `acl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      event,
      message,
      severity
    };

    logsRef.current = [newLog, ...logsRef.current];
    setAntiCheatLogs(logsRef.current);

    const countsAsStrike = STRIKE_EVENTS.includes(event);
    const strikes = countsAsStrike ? strikesRef.current + 1 : strikesRef.current;
    if (countsAsStrike) {
      strikesRef.current = strikes;
      setWarningCount(strikes);
    }

    setLatestWarning(message);
    setTimeout(() => {
      setLatestWarning(prev => (prev === message ? null : prev));
    }, 4000);

    if (countsAsStrike && strikes >= MAX_VIOLATIONS) {
      finishAssessment({
        terminated: true,
        reason: `Auto-submitted after ${MAX_VIOLATIONS} proctoring violations. Final flag: ${message}`
      });
    }
  };

  // Camera + microphone presence monitoring + voice detection (live only, never recorded)
  const proctoring = useProctoring({
    active: testState === 'active',
    onViolation: (kind, message) => logAntiCheatEvent(kind, message, 'high')
  });
  const { stream, cameraOn, micOn, permissionError, clearPermissionError, audioLevel, voiceDetected } = proctoring;

  // Face & gaze tracking via canvas frame analysis
  const { faceStatus } = useFaceTracking(
    videoRef,
    faceCanvasRef,
    testState === 'active',
    (kind, message) => logAntiCheatEvent(kind, message, 'high')
  );

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, testState]);


  // anti-cheat event listeners setup when test is ACTIVE
  useEffect(() => {
    if (testState !== 'active') return;

    // 1. Tab switch or window visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logAntiCheatEvent('TAB_SWITCH', 'Tab switched or browser window minimized during test execution!', 'high');
      }
    };

    // 2. Window blur (focus lost)
    const handleWindowBlur = () => {
      logAntiCheatEvent('WINDOW_BLUR', 'Browser lost window focus or split-screen detected.', 'medium');
    };

    // 3. Mouse leaving the document viewport
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        logAntiCheatEvent('MOUSE_LEAVE', 'Mouse pointer exited active browser viewport.', 'low');
      }
    };

    // 4. Prevent Copy / Paste / Cut attempt
    const handleCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      logAntiCheatEvent('COPY_PASTE_ATTEMPT', 'Copy/Paste action intercepted and blocked by security monitor.', 'medium');
    };

    // 5. Fullscreen change detection — prompt re-entry immediately
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        logAntiCheatEvent('FULLSCREEN_EXIT', 'Fullscreen mode exited by candidate.', 'high');
        // Attempt auto re-entry after 1.5s
        setTimeout(() => {
          if (testStateRef.current === 'active' && containerRef.current && !document.fullscreenElement) {
            containerRef.current.requestFullscreen?.().catch(() => {});
          }
        }, 1500);
      } else {
        setIsFullscreen(true);
      }
    };

    // 6. Block DevTools keyboard shortcuts (F12, Ctrl+Shift+I/J/C, Ctrl+U, Cmd+Option+I)
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      const alt = e.altKey;
      const key = e.key;

      // F12 — DevTools
      if (key === 'F12') {
        e.preventDefault();
        logAntiCheatEvent('DEVTOOLS_ATTEMPT', 'DevTools shortcut (F12) blocked during proctored session.', 'high');
        return;
      }
      // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C — DevTools
      if (ctrl && shift && (key === 'I' || key === 'i' || key === 'J' || key === 'j' || key === 'C' || key === 'c')) {
        e.preventDefault();
        logAntiCheatEvent('DEVTOOLS_ATTEMPT', 'DevTools shortcut (Ctrl+Shift+I/J/C) blocked during proctored session.', 'high');
        return;
      }
      // Cmd+Option+I — DevTools on Mac
      if (ctrl && alt && (key === 'I' || key === 'i')) {
        e.preventDefault();
        logAntiCheatEvent('DEVTOOLS_ATTEMPT', 'DevTools shortcut (Cmd+Option+I) blocked during proctored session.', 'high');
        return;
      }
      // Ctrl+U — View source
      if (ctrl && (key === 'U' || key === 'u')) {
        e.preventDefault();
        logAntiCheatEvent('DEVTOOLS_ATTEMPT', 'View Source shortcut (Ctrl+U) blocked during proctored session.', 'medium');
        return;
      }
      // Ctrl+C / Ctrl+V / Ctrl+A — Copy/Paste/Select All
      if (ctrl && (key === 'c' || key === 'C' || key === 'v' || key === 'V' || key === 'a' || key === 'A')) {
        e.preventDefault();
        logAntiCheatEvent('COPY_PASTE_ATTEMPT', 'Keyboard copy/paste shortcut blocked during proctored session.', 'medium');
        return;
      }
      // Alt+Tab — Window switch (log only, can't fully prevent)
      if (alt && key === 'Tab') {
        logAntiCheatEvent('TAB_SWITCH', 'Alt+Tab window switch attempt detected.', 'high');
      }
    };

    // 7. Block right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      logAntiCheatEvent('COPY_PASTE_ATTEMPT', 'Right-click context menu blocked during proctored session.', 'low');
    };

    // 8. Block text selection (CSS user-select is not enough)
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('cut', handleCopyPaste);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('cut', handleCopyPaste);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
    };
  }, [testState]);


  // Countdown timer effect
  useEffect(() => {
    if (testState !== 'active') return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testState]);

  // Start Assessment Preparation
  const startPreparation = (category: SkillCategory) => {
    clearPermissionError();
    setSelectedCategory(category);
    categoryRef.current = category;
    setAntiCheatLogs([]);
    logsRef.current = [];
    setWarningCount(0);
    strikesRef.current = 0;
    enterState('briefing');
  };

  // Launch Active Assessment
  const launchAssessment = async () => {
    if (!selectedCategory || launching) return;

    setLaunching(true);

    // Camera + microphone must be live before the session can start.
    const granted = await proctoring.start();
    if (!granted) {
      setLaunching(false);
      return;
    }

    // Attempt Fullscreen request
    try {
      if (containerRef.current && containerRef.current.requestFullscreen) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (err) {
      console.log('Fullscreen not supported or allowed', err);
    }

    const randomQs = getRandomQuestions(selectedCategory, 20);
    setQuestions(randomQs);
    questionsRef.current = randomQs;
    setCurrentIndex(0);
    setAnswers({});
    answersRef.current = {};
    setTimeRemaining(15 * 60); // 15 mins
    setAntiCheatLogs([]);
    logsRef.current = [];
    setWarningCount(0);
    strikesRef.current = 0;
    categoryRef.current = selectedCategory;
    setLaunching(false);
    enterState('active');
  };

  // Handle Answer Selection
  const handleSelectAnswer = (optionIndex: number) => {
    answersRef.current = { ...answersRef.current, [currentIndex]: optionIndex };
    setAnswers(answersRef.current);
  };

  // Calculate & Finish Assessment
  const finishAssessment = (opts: { terminated?: boolean; reason?: string } = {}) => {
    const category = categoryRef.current;
    const activeQuestions = questionsRef.current;
    const finalAnswers = answersRef.current;

    if (!category || activeQuestions.length === 0) return;
    if (testStateRef.current === 'completed') return;

    const terminated = opts.terminated === true;

    let correctCount = 0;
    const topicBreakdown: Record<string, { correct: number; total: number }> = {};
    const difficultyBreakdown: Record<DifficultyLevel, { correct: number; total: number }> = {
      Easy: { correct: 0, total: 0 },
      Medium: { correct: 0, total: 0 },
      Advanced: { correct: 0, total: 0 }
    };

    activeQuestions.forEach((q, idx) => {
      const selected = finalAnswers[idx];
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) correctCount++;

      const topic = q.topic || 'General';
      if (!topicBreakdown[topic]) {
        topicBreakdown[topic] = { correct: 0, total: 0 };
      }
      topicBreakdown[topic].total++;
      if (isCorrect) topicBreakdown[topic].correct++;

      const diff: DifficultyLevel = q.difficulty || (idx < 6 ? 'Easy' : idx < 14 ? 'Medium' : 'Advanced');
      if (!difficultyBreakdown[diff]) {
        difficultyBreakdown[diff] = { correct: 0, total: 0 };
      }
      difficultyBreakdown[diff].total++;
      if (isCorrect) difficultyBreakdown[diff].correct++;
    });

    const scorePercent = Math.round((correctCount / activeQuestions.length) * 100);

    // Badge Logic — a terminated session can never earn better than Red
    let badgeLevel: BadgeLevel = 'Red';
    if (!terminated && scorePercent >= 80) {
      badgeLevel = 'Green';
      // Trigger Confetti!
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.log(e);
      }
    } else if (!terminated && scorePercent >= 70) {
      badgeLevel = 'Yellow';
    }

    let finalLogs = logsRef.current;
    if (terminated) {
      finalLogs = [
        {
          id: `acl-${Date.now()}-term`,
          timestamp: new Date().toISOString(),
          event: 'PROCTORING_TERMINATED',
          message: opts.reason || `Session terminated after ${MAX_VIOLATIONS} proctoring violations.`,
          severity: 'high'
        },
        ...finalLogs
      ];
      logsRef.current = finalLogs;
      setAntiCheatLogs(finalLogs);
    }

    const result: TestResult = {
      id: `res-${Date.now()}`,
      userId: currentUser.id,
      skillName: category,
      category,
      scorePercent,
      totalQuestions: activeQuestions.length,
      correctCount,
      badgeLevel,
      warningCount: strikesRef.current,
      terminated,
      terminationReason: terminated ? (opts.reason || 'Proctoring violation limit reached.') : undefined,
      completedAt: new Date().toISOString(),
      topicBreakdown,
      difficultyBreakdown,
      antiCheatLogs: finalLogs
    };

    setTestResult(result);
    enterState('completed');
    setLatestWarning(null);

    // Release camera + microphone as soon as the session ends
    proctoring.stop();

    // Exit fullscreen if active
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.log(err));
    }
  };

  // Save Badge to Current User Profile
  const handleSaveBadgeToProfile = () => {
    if (!testResult || !selectedCategory) return;

    const skillName = selectedCategory;
    const existingSkills = [...currentUser.skills];
    const skillIndex = existingSkills.findIndex(s => s.category === selectedCategory || s.name === skillName);

    if (skillIndex >= 0) {
      existingSkills[skillIndex] = {
        ...existingSkills[skillIndex],
        badgeLevel: testResult.badgeLevel,
        scorePercent: testResult.scorePercent,
        verifiedAt: new Date().toISOString().split('T')[0]
      };
    } else {
      existingSkills.push({
        id: `sk-${Date.now()}`,
        name: selectedCategory,
        category: selectedCategory,
        selfRating: testResult.badgeLevel === 'Green' ? 5 : testResult.badgeLevel === 'Yellow' ? 4 : 3,
        badgeLevel: testResult.badgeLevel,
        scorePercent: testResult.scorePercent,
        verifiedAt: new Date().toISOString().split('T')[0]
      });
    }

    const updatedUser: User = {
      ...currentUser,
      skills: existingSkills,
      testResults: [testResult, ...currentUser.testResults]
    };

    onUpdateUserSkills(updatedUser);
    toast.success(`Success! ${testResult.badgeLevel} Badge for ${selectedCategory} attached to your profile.`);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      
      {/* 1. IDLE STATE: Select Skill Assessment */}
      {testState === 'idle' && (
        <div className="space-y-8">
          
          {/* Hero Banner */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden glow-indigo">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/30 glow-cyan">
                <ShieldAlert size={14} className="text-emerald-400" />
                Proctored Skill Verification Engine 2.0
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                Verify Your Technical Skills.<br/>
                <span className="text-gradient">Earn Badges. Stand Out to Teammates.</span>
              </h1>

              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                Self-claimed expertise is not enough for high-stakes hackathons. Take a proctored 20-MCQ assessment drawn from a randomized question bank to earn a verified Green, Yellow, or Red Badge attached directly to your profile.
              </p>

              {/* Badge Legend */}
              <div className="pt-2 flex flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs border border-white/10">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span className="font-bold text-emerald-300">Green Badge: 80%+</span>
                  <span className="text-slate-300">(Advanced)</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs border border-white/10">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span className="font-bold text-amber-300">Yellow Badge: 70-79%</span>
                  <span className="text-slate-300">(Intermediate)</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs border border-white/10">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                  <span className="font-bold text-rose-300">Red Badge: &lt;70%</span>
                  <span className="text-slate-300">(Improvement Needed)</span>
                </div>
              </div>

              {/* Proctoring Requirements */}
              <div className="pt-1 flex flex-wrap gap-2 text-[11px]">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                  <Video size={13} className="text-purple-300" />
                  Camera + Mic mandatory
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                  <Eye size={13} className="text-cyan-300" />
                  Monitored live — never recorded
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                  <ShieldAlert size={13} className="text-amber-300" />
                  3 strikes = auto-submit + Red cap
                </span>
              </div>
            </div>
          </div>

          {/* Skill Category Cards */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Available Skill Assessments
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select a technology category to launch your 20-question proctored evaluation
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {CATEGORIES.map((cat) => {
                const userSkill = currentUser.skills.find(s => s.category === cat.name);
                return (
                  <div 
                    key={cat.name}
                    className="nixtio-card p-6 flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <span className="text-3xl">{cat.icon}</span>
                        {userSkill ? (
                          <BadgePill level={userSkill.badgeLevel} scorePercent={userSkill.scorePercent} showScore />
                        ) : (
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 text-purple-300 border border-white/10">
                            Unverified
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-extrabold text-white group-hover:text-purple-300 transition-colors">
                        {cat.name}
                      </h3>

                      <p className="text-xs text-purple-200/70 leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-purple-500/10 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-purple-300/60 flex items-center gap-1">
                        <Clock size={13} className="text-purple-400" /> 20 MCQ • 15 Mins
                      </span>

                      <button
                        onClick={() => startPreparation(cat.name)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-lg hover:shadow-purple-500/30 cursor-pointer"
                      >
                        <span>Start Test</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* 2. BRIEFING STATE: Rules & Fullscreen Authorization */}
      {testState === 'briefing' && selectedCategory && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-2xl">
              🛡️
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Skill Verification Assessment: {selectedCategory}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Please read the anti-cheat instructions before starting
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-3 border border-slate-200/60 dark:border-slate-700/60">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Clock size={16} className="text-indigo-600" />
                Assessment Format & Timer
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-slate-600 dark:text-slate-400">
                <li><strong>20 Multiple Choice Questions (MCQs)</strong> randomly selected from a vast question pool.</li>
                <li><strong>15 Minutes Timer</strong> runs continuously. Unanswered questions are scored as incorrect.</li>
                <li>Questions evaluate practical concepts, syntax, edge-cases, and optimization.</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 space-y-3 border border-rose-200/60 dark:border-rose-900/40">
              <h4 className="font-bold text-rose-950 dark:text-rose-100 text-sm flex items-center gap-2">
                <ShieldAlert size={16} className="text-rose-600" />
                Anti-Cheat & Security Rules (Proctored Session)
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-rose-800 dark:text-rose-300">
                <li><strong>Three-Strike Policy:</strong> Switching tabs, exiting fullscreen, turning the camera off or muting the mic each cost one strike.</li>
                <li><strong>On the 3rd strike</strong> your test is auto-submitted with the answers you have given, flagged <strong>TERMINATED — Proctoring Violation</strong>, and your badge is capped at Red.</li>
                <li><strong>Clipboard Interception:</strong> Copying question text or pasting is blocked and logged.</li>
                <li><strong>Public Audit Trail:</strong> Every flag is attached to your verification record for teammates to inspect.</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 space-y-3 border border-indigo-200/60 dark:border-indigo-900/40">
              <h4 className="font-bold text-indigo-950 dark:text-indigo-100 text-sm flex items-center gap-2">
                <Video size={16} className="text-indigo-600 dark:text-indigo-400" />
                Camera & Microphone Monitoring
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-indigo-900/80 dark:text-indigo-300">
                <li>Both camera and microphone access are <strong>mandatory</strong> — the assessment cannot start without them.</li>
                <li>A small live self-view tile stays on screen so you can confirm your feed is running.</li>
                <li><strong>Privacy:</strong> the feed is monitored live in your browser only. Nothing is recorded, stored, or uploaded.</li>
              </ul>
            </div>
          </div>

          {permissionError && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-start gap-2.5">
              <Ban size={16} className="shrink-0 mt-0.5 text-rose-500" />
              <span>{permissionError}</span>
            </div>
          )}

          <div className="pt-4 flex items-center justify-between gap-4">
            <button
              onClick={() => enterState('idle')}
              disabled={launching}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              onClick={launchAssessment}
              disabled={launching}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20 flex items-center gap-2 disabled:opacity-60 disabled:cursor-wait"
            >
              <Video size={14} />
              <span>{launching ? 'Waiting for Camera Access…' : 'Allow Camera & Begin Assessment'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. ACTIVE TEST STATE */}
      {testState === 'active' && questions.length > 0 && (
        <div className="space-y-6 max-w-4xl mx-auto">
          
          {/* Security & Anti-cheat Top Status Bar */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-lg border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block absolute top-0 left-0"></span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                  Proctored Session Active • {selectedCategory}
                </span>
                <span className="text-[11px] text-slate-400">
                  {isFullscreen ? 'Fullscreen Active' : '⚠️ Non-Fullscreen Window'}
                </span>
              </div>
            </div>

            {/* Strike Counter + Device Status */}
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs">
                <ShieldAlert size={14} className={warningCount > 0 ? "text-amber-400" : "text-emerald-400"} />
                <span className="text-slate-300">Strikes:</span>
                <span className={`font-bold ${warningCount >= MAX_VIOLATIONS - 1 ? "text-rose-400" : warningCount > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                  {warningCount} / {MAX_VIOLATIONS}
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs">
                {cameraOn
                  ? <Video size={13} className="text-emerald-400" />
                  : <VideoOff size={13} className="text-rose-400" />}
                {micOn
                  ? <Mic size={13} className="text-emerald-400" />
                  : <MicOff size={13} className="text-rose-400" />}
                <span className={`font-semibold ${cameraOn && micOn ? 'text-slate-300' : 'text-rose-400'}`}>
                  {cameraOn && micOn ? 'Feed Live' : 'Signal Lost'}
                </span>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-700/80 text-indigo-200 text-sm font-mono font-bold">
                <Clock size={16} className="text-indigo-400" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </div>

          {/* Warning Banner Toast */}
          {latestWarning && (
            <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 animate-bounce-short ${
              warningCount >= MAX_VIOLATIONS - 1
                ? 'bg-rose-500/10 border-rose-500/50 text-rose-300'
                : 'bg-amber-500/10 border-amber-500/40 text-amber-300'
            }`}>
              <AlertTriangle size={16} className="shrink-0" />
              <span className="flex-1">{latestWarning}</span>
              {warningCount > 0 && (
                <span className="shrink-0 px-2 py-0.5 rounded-md bg-slate-950/70 border border-white/10">
                  Strike {warningCount} / {MAX_VIOLATIONS}
                </span>
              )}
            </div>
          )}

          {/* Hidden Canvas for Face & Gaze Tracking Frame Analysis */}
          <canvas ref={faceCanvasRef} className="hidden" width={320} height={240} />

          {/* Live Self-View & AI Proctor Telemetry — monitored in-browser only, never recorded */}
          <div className="fixed bottom-4 right-4 z-50 w-44 sm:w-56 rounded-2xl overflow-hidden border border-purple-500/40 bg-slate-950 shadow-2xl shadow-purple-950/50 backdrop-blur-xl">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full aspect-[4/3] object-cover bg-slate-950 -scale-x-100"
              />
              
              {/* Live Proctor Indicator */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur text-[9px] font-bold uppercase tracking-wider text-white">
                <span className={`w-1.5 h-1.5 rounded-full ${cameraOn && micOn ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`}></span>
                AI Proctor Active
              </div>

              {/* Face Status Pill */}
              <div className="absolute bottom-2 left-2 right-2">
                <div className={`px-2 py-1 rounded-lg backdrop-blur-md text-[10px] font-bold flex items-center justify-between border ${
                  faceStatus === 'locked'
                    ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                    : faceStatus === 'away'
                    ? 'bg-rose-950/80 border-rose-500/50 text-rose-300 animate-pulse'
                    : 'bg-black/70 border-white/10 text-slate-300'
                }`}>
                  <span className="flex items-center gap-1">
                    <ScanFace size={11} className={faceStatus === 'locked' ? 'text-emerald-400' : 'text-rose-400'} />
                    {faceStatus === 'locked' ? 'Face Locked' : faceStatus === 'away' ? 'Looking Away!' : 'Calibrating Face...'}
                  </span>
                  <span className="text-[8px] uppercase tracking-wider opacity-80">
                    {faceStatus === 'locked' ? '100% Focused' : faceStatus === 'away' ? 'Warning' : 'Sync'}
                  </span>
                </div>
              </div>
            </div>

            {/* Audio & Mic Live Telemetry Bar */}
            <div className="p-2.5 bg-slate-900 border-t border-slate-800 space-y-1.5 text-[10px]">
              <div className="flex items-center justify-between font-semibold text-slate-300">
                <span className="flex items-center gap-1">
                  <Volume2 size={11} className={voiceDetected ? "text-rose-400 animate-bounce" : "text-purple-400"} />
                  Mic Telemetry
                </span>
                <span className={`text-[9px] font-bold ${voiceDetected ? "text-rose-400 animate-pulse" : "text-emerald-400"}`}>
                  {voiceDetected ? "⚠️ Voice Detected" : "Quiet / Normal"}
                </span>
              </div>

              {/* Real-time Audio Level Meter */}
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-white/5">
                <div 
                  className={`h-full transition-all duration-150 ${
                    voiceDetected ? 'bg-rose-500' : audioLevel > 0.02 ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(8, audioLevel * 300))}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[9px] text-slate-400 pt-0.5">
                <span className="flex items-center gap-1">
                  {cameraOn ? <Video size={10} className="text-emerald-400" /> : <VideoOff size={10} className="text-rose-400" />}
                  Camera Live
                </span>
                <span className="flex items-center gap-1">
                  {micOn ? <Mic size={10} className="text-emerald-400" /> : <MicOff size={10} className="text-rose-400" />}
                  Mic Monitored
                </span>
              </div>
            </div>
          </div>

          {/* Main Question Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            
            {/* 3-Stage Progressive Difficulty Flow (Easy -> Medium -> Advanced) */}
            {(() => {
              const currentQ = questions[currentIndex];
              const currentDifficulty: DifficultyLevel = currentQ?.difficulty || (currentIndex < 6 ? 'Easy' : currentIndex < 14 ? 'Medium' : 'Advanced');
              return (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-bold">
                    <div className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                      currentDifficulty === 'Easy'
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 ring-1 ring-emerald-500/30'
                        : currentIndex >= 6
                          ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400/60'
                          : 'bg-slate-800/40 border-slate-700/50 text-slate-500'
                    }`}>
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          currentDifficulty === 'Easy' ? 'bg-emerald-400 animate-pulse' : currentIndex >= 6 ? 'bg-emerald-500' : 'bg-slate-600'
                        }`} />
                        Stage 1: Easy
                      </span>
                      <span className="text-[10px] opacity-75">Q1–6</span>
                    </div>

                    <div className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                      currentDifficulty === 'Medium'
                        ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 ring-1 ring-amber-500/30'
                        : currentIndex >= 14
                          ? 'bg-amber-950/20 border-amber-500/20 text-amber-400/60'
                          : 'bg-slate-800/40 border-slate-700/50 text-slate-500'
                    }`}>
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          currentDifficulty === 'Medium' ? 'bg-amber-400 animate-pulse' : currentIndex >= 14 ? 'bg-amber-500' : 'bg-slate-600'
                        }`} />
                        Stage 2: Medium
                      </span>
                      <span className="text-[10px] opacity-75">Q7–14</span>
                    </div>

                    <div className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                      currentDifficulty === 'Advanced'
                        ? 'bg-purple-500/15 border-purple-500/50 text-purple-300 ring-1 ring-purple-500/30'
                        : 'bg-slate-800/40 border-slate-700/50 text-slate-500'
                    }`}>
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          currentDifficulty === 'Advanced' ? 'bg-purple-400 animate-pulse' : 'bg-slate-600'
                        }`} />
                        Stage 3: Advanced
                      </span>
                      <span className="text-[10px] opacity-75">Q15–20</span>
                    </div>
                  </div>

                  {/* Header: Progress bar, Difficulty badge & Question count */}
                  <div className="space-y-2 pt-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <span>Question {currentIndex + 1} of {questions.length}</span>
                        {/* Live Difficulty Pill */}
                        <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold flex items-center gap-1 ${
                          currentDifficulty === 'Easy'
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                            : currentDifficulty === 'Medium'
                              ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                              : 'bg-purple-500/15 border-purple-500/30 text-purple-400'
                        }`}>
                          {currentDifficulty === 'Easy' && <Zap size={11} />}
                          {currentDifficulty === 'Medium' && <Sparkles size={11} />}
                          {currentDifficulty === 'Advanced' && <Award size={11} />}
                          {currentDifficulty}
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-[11px]">
                        Topic: {questions[currentIndex].topic}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          currentDifficulty === 'Easy'
                            ? 'bg-emerald-500'
                            : currentDifficulty === 'Medium'
                              ? 'bg-amber-500'
                              : 'bg-purple-500'
                        }`}
                        style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Question Text */}
            <div className="py-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                {questions[currentIndex].question}
              </h3>
            </div>

            {/* MCQ Options */}
            <div className="space-y-3">
              {questions[currentIndex].options.map((optionText, optIdx) => {
                const isSelected = answers[currentIndex] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectAnswer(optIdx)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-100 shadow-xs ring-1 ring-indigo-500/50'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 text-slate-500'
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </div>
                    <span className="text-xs sm:text-sm font-medium leading-normal flex-1">
                      {optionText}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Question Navigation Controls */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 flex items-center gap-1.5"
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>

              <div className="text-xs text-slate-400 font-medium">
                Answered: {Object.keys(answers).length} / {questions.length}
              </div>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => finishAssessment()}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-500/20"
                >
                  <FileCheck size={16} />
                  <span>Submit Assessment</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 4. COMPLETED STATE: Detailed Score & Badge Award */}
      {testState === 'completed' && testResult && (
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Badge Result Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6 relative overflow-hidden">
            
            <div className="inline-flex p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-4xl shadow-inner mb-2">
              {testResult.terminated ? '🚫' : testResult.badgeLevel === 'Green' ? '🏆' : testResult.badgeLevel === 'Yellow' ? '🎖️' : '🎯'}
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {testResult.terminated ? 'Assessment Terminated' : 'Assessment Completed!'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official proctored evaluation result for <strong className="text-slate-800 dark:text-slate-200">{testResult.category}</strong>
              </p>
            </div>

            {testResult.terminated && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-left space-y-2">
                <h4 className="text-sm font-bold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <Ban size={16} className="shrink-0" />
                  TERMINATED — Proctoring Violation
                </h4>
                <p className="text-xs text-rose-700/90 dark:text-rose-300/90 leading-relaxed">
                  {testResult.terminationReason}
                </p>
                <p className="text-xs text-rose-700/80 dark:text-rose-300/80 leading-relaxed">
                  The questions you answered were scored, but this badge is capped at <strong>Red</strong> and the
                  termination is permanently visible on your verification record. Retake the assessment with your
                  camera and microphone on to earn a higher badge.
                </p>
              </div>
            )}

            {/* Score & Badge Display */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 max-w-md mx-auto space-y-4">
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                  {testResult.scorePercent}%
                </span>
                <span className="text-xs text-slate-500">
                  ({testResult.correctCount} / {testResult.totalQuestions} Correct)
                </span>
              </div>

              <div>
                <BadgePill level={testResult.badgeLevel} scorePercent={testResult.scorePercent} size="lg" showScore />
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {testResult.badgeLevel === 'Green' && 'Congratulations! You achieved an Advanced rating (80%+). A Green Badge signifies verified mastery of this technical skill.'}
                {testResult.badgeLevel === 'Yellow' && 'Good effort! You achieved an Intermediate rating (70-79%). You possess verified competent understanding of core concepts.'}
                {testResult.badgeLevel === 'Red' && !testResult.terminated && 'Further study recommended (<70%). You can retake this assessment anytime after reviewing key sub-topics.'}
                {testResult.badgeLevel === 'Red' && testResult.terminated && 'Badge capped at Red due to a proctoring termination. Retake the assessment cleanly to be scored on merit.'}
              </p>
            </div>

            {/* Progressive Difficulty Tier Performance (Easy -> Medium -> Advanced) */}
            {testResult.difficultyBreakdown && (
              <div className="text-left space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-purple-400" />
                    Progressive Difficulty Mastery Diagnostic
                  </h4>
                  <span className="text-[11px] text-slate-500 font-semibold">Stage 1 (Easy) ➔ Stage 2 (Medium) ➔ Stage 3 (Advanced)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(['Easy', 'Medium', 'Advanced'] as DifficultyLevel[]).map((level) => {
                    const data = testResult.difficultyBreakdown?.[level] || { correct: 0, total: 0 };
                    const percent = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                    const tierStyles = 
                      level === 'Easy' 
                        ? { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400', bar: 'bg-emerald-500', label: 'Easy Tier', desc: 'Core APIs & Foundational Syntax' }
                        : level === 'Medium'
                          ? { bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400', bar: 'bg-amber-500', label: 'Medium Tier', desc: 'State Architecture & Async Logic' }
                          : { bg: 'bg-purple-500/10 border-purple-500/30', text: 'text-purple-400', bar: 'bg-purple-500', label: 'Advanced Tier', desc: 'Engine Internals & Deep Optimization' };

                    return (
                      <div key={level} className={`p-3.5 rounded-2xl border ${tierStyles.bg} space-y-2`}>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-200">{tierStyles.label}</span>
                          <span className={`font-mono font-bold ${tierStyles.text}`}>
                            {data.correct}/{data.total} ({percent}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full ${tierStyles.bar} transition-all duration-500`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {tierStyles.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Topic Breakdown */}
            <div className="text-left space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Sub-topic Mastery Diagnostic
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(testResult.topicBreakdown).map(([topic, rawData]) => {
                  const data = rawData as { correct: number; total: number };
                  const topicPercent = Math.round((data.correct / data.total) * 100);
                  return (
                    <div key={topic} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{topic}</span>
                      <span className={`font-bold ${topicPercent >= 80 ? 'text-emerald-600' : topicPercent >= 70 ? 'text-amber-600' : 'text-rose-600'}`}>
                        {data.correct}/{data.total} ({topicPercent}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Anti-Cheat Audit Summary */}
            <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert size={15} className={testResult.terminated ? 'text-rose-600 dark:text-rose-400' : 'text-indigo-600'} />
                  Anti-Cheat Security Audit
                </span>
                <span className={`px-2 py-0.5 rounded-md ${
                  testResult.terminated
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200'
                    : testResult.warningCount === 0
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
                }`}>
                  {testResult.warningCount} / {MAX_VIOLATIONS} Strikes
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400">
                {testResult.terminated
                  ? 'Strike limit reached — the session was auto-submitted and flagged as terminated. Audit log attached to your profile.'
                  : testResult.warningCount === 0 
                    ? 'Verification clean. No tab switches, fullscreen exits or camera/mic dropouts recorded during your 20-MCQ session.' 
                    : `${testResult.warningCount} proctoring strike(s) captured during assessment. Audit log attached to profile.`}
              </p>

              {testResult.antiCheatLogs.length > 0 && (
                <ul className="pt-2 mt-1 border-t border-slate-200/70 dark:border-slate-700/70 space-y-1.5">
                  {testResult.antiCheatLogs.slice(0, 5).map(log => (
                    <li key={log.id} className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                        log.severity === 'high' ? 'bg-rose-500' : log.severity === 'medium' ? 'bg-amber-500' : 'bg-slate-400'
                      }`}></span>
                      <span className="flex-1">{log.message}</span>
                      <span className="font-mono text-slate-400 shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={handleSaveBadgeToProfile}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Award size={16} />
                <span>Attach Badge to My Profile</span>
              </button>

              <button
                onClick={() => setShowShareModal(true)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/20 cursor-pointer"
              >
                <Share2 size={15} />
                <span>Share Credential Card</span>
              </button>

              <button
                onClick={() => (testResult.terminated ? startPreparation(testResult.category) : enterState('idle'))}
                className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw size={15} />
                <span>{testResult.terminated ? 'Retake This Assessment' : 'Take Another Assessment'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Share Verified Credential Modal */}
      {showShareModal && testResult && (
        <ShareBadgeModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          user={currentUser}
          skillName={testResult.category}
          badgeLevel={testResult.badgeLevel}
          scorePercent={testResult.scorePercent}
          completedAt={testResult.completedAt}
          warningCount={testResult.warningCount}
        />
      )}

    </div>
  );
};
