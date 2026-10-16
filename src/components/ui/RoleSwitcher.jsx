import React from 'react';
import { DEMO_USERS } from '../../constants/auKamra';
import { ShieldCheck, UserCheck, GraduationCap, Wrench } from 'lucide-react';

export default function RoleSwitcher({ currentUser, onSelectUser }) {
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
          <span className="font-semibold text-slate-300">Phase 2 Prototype Demo Mode</span>
          <span className="text-slate-500 hidden sm:inline">| Switch role to test permissions & moderation:</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = currentUser.role === r.key;
            return (
              <button
                key={r.key}
                onClick={() => onSelectUser(DEMO_USERS[r.key])}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium whitespace-nowrap ${
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
      </div>
    </div>
  );
}
