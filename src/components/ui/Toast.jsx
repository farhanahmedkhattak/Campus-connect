import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const { message, type = 'success' } = toast;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div className={`px-4 py-3 rounded-2xl border shadow-2xl flex items-center gap-3 backdrop-blur-xl ${
        type === 'error'
          ? 'bg-rose-950/90 border-rose-500/30 text-rose-200'
          : type === 'info'
          ? 'bg-blue-950/90 border-blue-500/30 text-blue-200'
          : 'bg-[#0f172a]/95 border-emerald-500/30 text-emerald-200'
      }`}>
        {type === 'error' ? (
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
        ) : type === 'info' ? (
          <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        )}
        <span className="text-xs font-medium text-slate-100">{message}</span>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all ml-2"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
