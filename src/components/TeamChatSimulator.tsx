import React, { useState, useEffect, useRef } from 'react';
import { User, Team } from '../types';
import { Send, Bot, Sparkles, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { getToken } from '../utils/api';

interface ChatMessage {
  id: string;
  senderName: string;
  senderId: string;
  senderAvatar?: string;
  isAI?: boolean;
  message: string;
  timestamp: string;
  createdAt?: Timestamp;
}

interface TeamChatSimulatorProps {
  currentUser: User;
  team: Team;
  members: User[];
}

export const TeamChatSimulator: React.FC<TeamChatSimulatorProps> = ({ currentUser, team, members }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAiReplying, setIsAiReplying] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Real-time Firestore listener
  useEffect(() => {
    if (!team?.id) return;

    const messagesRef = collection(db, 'teams', team.id, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs: ChatMessage[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          const ts = data.createdAt as Timestamp | null;
          const date = ts?.toDate ? ts.toDate() : new Date();
          return {
            id: doc.id,
            senderName: data.senderName,
            senderId: data.senderId,
            senderAvatar: data.senderAvatar,
            isAI: data.isAI ?? false,
            message: data.message,
            timestamp: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            createdAt: ts ?? undefined,
          };
        });
        setMessages(msgs);
        setIsConnected(true);
      },
      (_err) => {
        // Firestore permission error or offline — show mock seed
        setIsConnected(false);
        setMessages([
          {
            id: 'm-seed-1',
            senderId: 'system',
            senderName: 'Squad AI Assistant',
            isAI: true,
            message: '👋 Welcome to the Squad Chat! Type @AI or ask a question to get AI-powered project tips.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    );

    return () => unsubscribe();
  }, [team?.id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendToFirestore = async (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    try {
      const messagesRef = collection(db, 'teams', team.id, 'messages');
      await addDoc(messagesRef, {
        ...msg,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      // Firestore unavailable — show message locally only
      setMessages((prev) => [
        ...prev,
        {
          ...msg,
          id: `local-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const triggerAIResponse = async (promptText: string) => {
    setIsAiReplying(true);
    try {
      const token = getToken();
      const res = await fetch('/api/ai/match-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          currentUser,
          candidate: members[0] ?? currentUser,
          prompt: promptText,
        }),
      });
      const data = await res.json();
      const aiText =
        data?.analysis ||
        data?.synergyAssessment ||
        getLocalAIResponse(promptText);

      await sendToFirestore({
        senderId: 'ai-assistant',
        senderName: 'Squad AI Assistant',
        isAI: true,
        message: `💡 ${aiText}`,
      });
    } catch {
      await sendToFirestore({
        senderId: 'ai-assistant',
        senderName: 'Squad AI Assistant',
        isAI: true,
        message: `🤖 ${getLocalAIResponse(promptText)}`,
      });
    } finally {
      setIsAiReplying(false);
    }
  };

  const getLocalAIResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('pitch') || q.includes('presentation'))
      return "Pitch Strategy: Keep your opening under 30s. Highlight how verified badges eliminate resume fraud in developer matching!";
    if (q.includes('stack') || q.includes('tech') || q.includes('react'))
      return "Tech Stack Tip: Combine React 19 + Framer Motion for liquid UI transitions, paired with Express & Gemini Flash!";
    if (q.includes('idea') || q.includes('build'))
      return "Project Idea: Build a real-time collaborative skill-badge verifier that judges can use to score team credibility!";
    return "Squad Co-Pilot: Great progress! Don't forget to update your Sprint Kanban to keep hackathon deliverables on track. 🚀";
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const promptText = inputText.trim();
    setInputText('');

    await sendToFirestore({
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      isAI: false,
      message: promptText,
    });

    // Trigger AI if user mentions @AI or asks a question
    const shouldAI =
      promptText.toLowerCase().includes('@ai') ||
      promptText.includes('?') ||
      promptText.toLowerCase().includes('idea') ||
      promptText.toLowerCase().includes('pitch') ||
      promptText.toLowerCase().includes('stack');

    if (shouldAI) {
      await triggerAIResponse(promptText);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col h-[560px]">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              {team.name} Squad Chat
              <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full border ${
                isConnected
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {isConnected ? '● Live' : '○ Local'}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Type <code className="text-cyan-400">@AI</code> or ask questions for instant squad tips.
            </p>
          </div>
        </div>

        {/* Member avatars */}
        <div className="flex -space-x-2">
          {members.slice(0, 5).map((m) => (
            <img
              key={m.id}
              src={m.avatar}
              title={m.name}
              alt=""
              className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover"
            />
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.senderId === currentUser.id ? 'flex-row-reverse' : ''}`}
            >
              {msg.isAI ? (
                <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 h-9 w-9 shrink-0 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
              ) : msg.senderAvatar ? (
                <img
                  src={msg.senderAvatar}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-700"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                  <UserIcon size={14} className="text-slate-400" />
                </div>
              )}

              <div className={`max-w-[75%] space-y-1 ${msg.senderId === currentUser.id ? 'items-end' : ''}`}>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className={`font-semibold ${msg.isAI ? 'text-purple-400 font-bold' : 'text-slate-300'}`}>
                    {msg.senderName}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.isAI
                      ? 'bg-purple-950/60 border border-purple-800/60 text-purple-100'
                      : msg.senderId === currentUser.id
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isAiReplying && (
          <div className="flex items-center gap-2 text-xs text-purple-400 animate-pulse pl-11">
            <Bot size={14} />
            <span>Squad AI Assistant is thinking...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          placeholder="Message your squad or ask @AI for project tips..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          className="p-2.5 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white rounded-xl transition shadow-md cursor-pointer shrink-0"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
