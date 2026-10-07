import React from 'react';
import { TeamRequest } from '../types';
import { X, Check, Bell, UserPlus, ShieldCheck, CornerDownRight } from 'lucide-react';

interface InvitationsModalProps {
  requests: TeamRequest[];
  onClose: () => void;
  onAcceptRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
}

export const InvitationsModal: React.FC<InvitationsModalProps> = ({
  requests,
  onClose,
  onAcceptRequest,
  onRejectRequest
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Pending Team Invitations
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage incoming team requests and invitations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
          {requests.map(req => (
            <div
              key={req.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={req.senderAvatar} alt={req.senderName} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {req.senderName}
                    </h4>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                      Invites you to join <strong className="text-slate-800 dark:text-slate-200">{req.teamName}</strong> as <strong className="text-slate-800 dark:text-slate-200">{req.proposedRole}</strong>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Hackathon: {req.hackathonName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 italic flex items-start gap-2">
                <CornerDownRight size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <span>"{req.message}"</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => onRejectRequest(req.id)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
                >
                  Decline
                </button>
                <button
                  onClick={() => onAcceptRequest(req.id)}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Check size={14} />
                  <span>Accept Invitation</span>
                </button>
              </div>

            </div>
          ))}

          {requests.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400">
              No pending team invitations at this moment.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
