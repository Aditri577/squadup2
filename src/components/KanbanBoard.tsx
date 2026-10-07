import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Plus, CheckCircle2, Clock, AlertCircle, Sparkles, Trash2, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done' | 'ai_suggested';
  assigneeName?: string;
  assigneeAvatar?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

interface KanbanBoardProps {
  teamMembers: User[];
  hackathonName: string;
}

const INITIAL_TASKS: KanbanTask[] = [
  {
    id: 'k-1',
    title: 'Initialize Express & Gemini AI Endpoint',
    description: 'Setup backend API route for Gemini prompt generation and CORS headers.',
    status: 'done',
    assigneeName: 'Aditi Saxena',
    assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    priority: 'high',
    category: 'Backend'
  },
  {
    id: 'k-2',
    title: 'Design Dark Mode Glassmorphism UI',
    description: 'Build Figma tokens & Tailwind utilities for neon glows and glass cards.',
    status: 'in_progress',
    assigneeName: 'Priya Sharma',
    assigneeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    priority: 'high',
    category: 'UI/UX'
  },
  {
    id: 'k-3',
    title: 'Integrate Tab-Switch Anti-Cheat Proctor',
    description: 'Hook event listeners for visibilitychange, window blur, and copy-paste warnings.',
    status: 'in_progress',
    assigneeName: 'Aditi Saxena',
    assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    priority: 'medium',
    category: 'Security'
  },
  {
    id: 'k-4',
    title: 'AI Pitch Deck & README Export',
    description: 'Generate 1-click Markdown documentation for submission.',
    status: 'ai_suggested',
    priority: 'medium',
    category: 'AI Tooling'
  },
  {
    id: 'k-5',
    title: 'Record Demo Walkthrough Video (2 Min)',
    description: 'Loom walkthrough demonstrating skill verification and matchmaker.',
    status: 'todo',
    priority: 'high',
    category: 'Submission'
  }
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ teamMembers, hackathonName }) => {
  const [tasks, setTasks] = useState<KanbanTask[]>(INITIAL_TASKS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskAssignee, setNewTaskAssignee] = useState<string>(teamMembers[0]?.name || 'Unassigned');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const assignedMember = teamMembers.find(m => m.name === newTaskAssignee);

    const newTask: KanbanTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      description: newTaskDesc,
      status: 'todo',
      assigneeName: assignedMember ? assignedMember.name : newTaskAssignee,
      assigneeAvatar: assignedMember?.avatar,
      priority: newTaskPriority,
      category: 'General'
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setShowAddModal(false);
  };

  const handleMoveTask = (taskId: string, newStatus: KanbanTask['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const columns: { id: KanbanTask['status']; title: string; icon: React.ReactNode; color: string }[] = [
    { id: 'todo', title: 'To Do', icon: <Clock size={16} />, color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10' },
    { id: 'in_progress', title: 'In Progress', icon: <Sparkles size={16} />, color: 'border-amber-500/30 text-amber-400 bg-amber-500/10' },
    { id: 'done', title: 'Completed', icon: <CheckCircle2 size={16} />, color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' },
    { id: 'ai_suggested', title: 'AI Recommended', icon: <Sparkles size={16} className="text-purple-400" />, color: 'border-purple-500/30 text-purple-400 bg-purple-500/10' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              Sprint Kanban
            </span>
            <span className="text-slate-400 text-sm">for {hackathonName}</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Hackathon Task Board</h2>
          <p className="text-slate-400 text-xs mt-0.5">Track deliverables, assign roles, and move tasks seamlessly across columns.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white text-sm font-semibold rounded-xl transition shadow-lg glow-cyan cursor-pointer shrink-0"
        >
          <Plus size={18} />
          Add Sprint Task
        </button>
      </div>

      {/* Grid Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col min-h-[420px]">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`p-1.5 rounded-lg border ${col.color}`}>
                    {col.icon}
                  </span>
                  <h3 className="font-bold text-sm text-slate-200">{col.title}</h3>
                </div>
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px] pr-1">
                <AnimatePresence>
                  {colTasks.map(task => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                      className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 p-3.5 rounded-xl shadow-md space-y-2 group transition"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-sm text-white line-clamp-2">{task.title}</h4>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition p-1"
                          title="Delete task"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {task.description && (
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                        {/* Assignee Avatar */}
                        <div className="flex items-center gap-1.5 text-slate-300">
                          {task.assigneeAvatar ? (
                            <img src={task.assigneeAvatar} alt="" className="w-5 h-5 rounded-full object-cover border border-slate-700" />
                          ) : (
                            <UserIcon size={14} className="text-slate-400" />
                          )}
                          <span className="text-[11px] truncate max-w-[100px]">{task.assigneeName || 'Unassigned'}</span>
                        </div>

                        {/* Priority Badge */}
                        <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-md ${
                          task.priority === 'high' 
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                            : task.priority === 'medium'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {task.priority}
                        </span>
                      </div>

                      {/* Move Column Selector */}
                      <div className="pt-2 flex items-center gap-1 overflow-x-auto text-[11px]">
                        {col.id !== 'todo' && (
                          <button
                            onClick={() => handleMoveTask(task.id, 'todo')}
                            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded border border-slate-800 transition shrink-0 cursor-pointer"
                          >
                            ← To Do
                          </button>
                        )}
                        {col.id !== 'in_progress' && (
                          <button
                            onClick={() => handleMoveTask(task.id, 'in_progress')}
                            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded border border-slate-800 transition shrink-0 cursor-pointer"
                          >
                            In Progress
                          </button>
                        )}
                        {col.id !== 'done' && (
                          <button
                            onClick={() => handleMoveTask(task.id, 'done')}
                            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-emerald-400 rounded border border-slate-800 transition shrink-0 cursor-pointer"
                          >
                            Done ✓
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {colTasks.length === 0 && (
                  <div className="border border-dashed border-slate-800/80 rounded-xl p-6 text-center text-slate-500 text-xs">
                    No tasks in {col.title.toLowerCase()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-lg text-white">Add Hackathon Task</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Build Auth Middleware"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Details or deliverables required..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Assignee</label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    {teamMembers.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                    <option value="Unassigned">Unassigned</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 text-sm font-bold rounded-xl transition shadow-md glow-cyan cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
