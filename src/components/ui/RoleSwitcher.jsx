import React from 'react';
import { DEMO_USERS } from '../../constants/auKamra';
import { ShieldCheck, UserCheck, GraduationCap, Wrench, RotateCcw } from 'lucide-react';

export default function RoleSwitcher({ currentUser, onSelectUser, onResetData }) {
  const roles = [
    { key: 'student', label: 'Student', sub: 'Farhan Khattak (Cyber)', icon: GraduationCap, color: 'text-blue-400' },
    { key: 'moderator', label: 'Moderator', sub: 'Dr. Tariq (CS Faculty)', icon: ShieldCheck, color: 'text-emerald-400' },
    { key: 'faculty', label: 'Faculty Head', sub: 'Prof. Asim (Academic Dean)', icon: UserCheck, color: 'text-amber-400' },
    { key: 'admin', label: 'Campus Admin', sub: 'IT Directorate', icon: Wrench, color: 'text-purple-400' },
  ];

  return (
    <div className="bg-[#0b101c] border-b border-white/10 px-4 py-2 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-200">Interactive Frontend Mode</span>
          <span className="text-slate-500 hidden md:inline">• Zero backend setup needed • Switch role to preview:</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <div className="flex items-center gap-1.5">
            {roles.map((r) => {
              const Icon = r.icon;
              const isActive = currentUser.role === r.key;
              return (
                <button
                  key={r.key}
                  onClick={() => onSelectUser(DEMO_USERS[r.key])}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all font-medium whitespace-nowrap text-xs ${
                    isActive
                      ? 'bg-blue-600/30 border border-blue-500 text-white shadow-sm'
                      : 'bg-white/5 border border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                  }`}
                  title={`Switch to ${r.label}`}
                >
                  <Icon className={`w-3.5 h-3.5 ${r.color}`} />
                  <span>{r.label}</span>
                  {isActive && <span className="text-[10px] bg-blue-500/30 px-1 rounded text-blue-200">Active</span>}
                </button>
              );
            })}
          </div>

          {onResetData && (
            <button
              onClick={onResetData}
              className="p-1 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 flex items-center gap-1 text-[11px] transition-all ml-1"
              title="Reset sample posts, votes, and notices back to clean state"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
