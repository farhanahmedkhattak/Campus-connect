import React from 'react';
import { Users, Shield, Plane, Brain, BookOpen, ChevronRight, UserPlus } from 'lucide-react';

export default function SocietiesView({ societies }) {
  const getIcon = (logo) => {
    switch (logo) {
      case 'Shield': return Shield;
      case 'Plane': return Plane;
      case 'Brain': return Brain;
      default: return BookOpen;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0e1422] to-blue-950/30 border border-white/10 space-y-1">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" />
          <h2 className="text-base font-bold text-white">Student Societies & Clubs</h2>
        </div>
        <p className="text-xs text-slate-400">
          Official co-curricular student chapters sanctioned by Air University Kamra.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {societies.map((soc) => {
          const Icon = getIcon(soc.logo);
          return (
            <div
              key={soc.id}
              className="p-5 rounded-2xl bg-[#0e1422] border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                    {soc.category}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-white">
                    {soc.name}
                  </h3>
                  <p className="text-[11px] text-emerald-400 font-medium mt-0.5">
                    {soc.department} • {soc.membersCount} Members
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {soc.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">
                  {soc.lead}
                </span>
                <button
                  onClick={() => alert(`Applied to join ${soc.name}!`)}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-emerald-600 hover:text-white text-emerald-400 font-medium text-xs flex items-center gap-1.5 transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Join Club</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
