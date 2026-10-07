import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: {
    success: (msg: string) => void;
    error: (msg: string) => void;
    warning: (msg: string) => void;
    info: (msg: string) => void;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx.toast;
}

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />,
  error: <XCircle size={18} className="text-rose-400 shrink-0" />,
  warning: <AlertCircle size={18} className="text-amber-400 shrink-0" />,
  info: <Info size={18} className="text-blue-400 shrink-0" />,
};

const BORDERS: Record<ToastType, string> = {
  success: 'border-emerald-500/30 bg-emerald-500/10',
  error: 'border-rose-500/30 bg-rose-500/10',
  warning: 'border-amber-500/30 bg-amber-500/10',
  info: 'border-blue-500/30 bg-blue-500/10',
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onRemove(toast.id), 4000);
    return () => clearTimeout(t);
  }, [toast.id, onRemove]);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-xl text-sm font-medium text-white max-w-sm w-full animate-in slide-in-from-bottom-4 duration-300 ${BORDERS[toast.type]}`}
    >
      {ICONS[toast.type]}
      <span className="flex-1 leading-relaxed">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-white/40 hover:text-white/80 transition-colors shrink-0 mt-0.5"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const add = useCallback((type: ToastType, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts(prev => [...prev.slice(-4), { id, type, message }]);
  }, []);

  const toast = {
    success: (msg: string) => add('success', msg),
    error: (msg: string) => add('error', msg),
    warning: (msg: string) => add('warning', msg),
    info: (msg: string) => add('info', msg),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Container — bottom-right */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onRemove={remove} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
