import React, { useState } from 'react';
import { User, Team } from '../types';
import { Send, Bot, Sparkles, User as UserIcon, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar?: string;
  isAI?: boolean;
  message: string;
  timestamp: string;
}

interface TeamChatSimulatorProps {
  currentUser: User;
  team: Team;
  members: User[];
}

export const TeamChatSimulator: React.FC<TeamChatSimulatorProps> = ({ currentUser, team, members }) => {
  const initialMessages: ChatMessage[] = [
    {
      id: 'm-1',
      senderName: 'Aditi Saxena',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      message: 'Hey team! Let’s lock in our hackathon project stack. I have Green badges in React and Node.js.',
      timestamp: '10:00 AM'
    },
    {
      id: 'm-2',
      senderName: 'Priya Sharma',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
      message: 'Awesome! I’m working on the glassmorphism wireframes in Figma. Will share prototype links shortly.',
      timestamp: '10:02 AM'
    },
    {
      id: 'm-3',
      senderName: 'Squad AI Assistant',
      isAI: true,
      message: '💡 **AI Suggestion**: Based on your team’s verified React & UI/UX skills, consider implementing a real-time anti-cheat telemetry HUD to impress judges!',
      timestamp: '10:03 AM'
    }
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isAiReplying, setIsAiReplying] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      message: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const promptText = inputText;
    setInputText('');

    // Trigger AI response if user asks @AI or question
    if (promptText.toLowerCase().includes('@ai') || promptText.includes('?') || promptText.toLowerCase().includes('idea')) {
      setIsAiReplying(true);
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: `msg-ai-${Date.now()}`,
          senderName: 'Squad AI Assistant',
          isAI: true,
          message: getAIResponse(promptText),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsAiReplying(false);
      }, 1200);
    }
  };

  const getAIResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('pitch') || q.includes('presentation')) {
      return "🎤 **Pitch Strategy**: Keep your opening under 30s. Highlight how verified badges eliminate resume fraud in developer matching!";
    }
    if (q.includes('stack') || q.includes('tech') || q.includes('react')) {
      return "⚡ **Tech Stack Tip**: Combine React 19 + Framer Motion for liquid UI transitions, paired with Express & Gemini 3.6 Flash!";
    }
    return "🤖 **Squad Co-Pilot**: Great progress! Don't forget to update your Sprint Kanban board to keep your hackathon deliverables on track.";
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
              <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Live & AI Co-Pilot Active
              </span>
            </h3>
            <p className="text-xs text-slate-400">Type <code className="text-cyan-400">@AI</code> or ask questions to get instant mentor tips.</p>
          </div>
        </div>

        {/* Member avatars */}
        <div className="flex -space-x-2">
          {members.map(m => (
            <img key={m.id} src={m.avatar} title={m.name} alt="" className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover" />
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.senderName === currentUser.name ? 'flex-row-reverse' : ''}`}
            >
              {msg.isAI ? (
                <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 h-9 w-9 shrink-0 flex items-center justify-center glow-purple">
                  <Sparkles size={18} />
                </div>
              ) : msg.senderAvatar ? (
                <img src={msg.senderAvatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-700" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                  <UserIcon size={14} className="text-slate-400" />
                </div>
              )}

              <div className={`max-w-[75%] space-y-1 ${msg.senderName === currentUser.name ? 'items-end' : ''}`}>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className={`font-semibold ${msg.isAI ? 'text-purple-400 font-bold' : 'text-slate-300'}`}>
                    {msg.senderName}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.isAI
                      ? 'bg-purple-950/60 border border-purple-800/60 text-purple-100 glow-purple'
                      : msg.senderName === currentUser.name
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
          className="p-2.5 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white rounded-xl transition shadow-md glow-cyan cursor-pointer shrink-0"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
