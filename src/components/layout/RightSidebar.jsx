import React from 'react';
import { 
  Megaphone, 
  Calendar, 
  BarChart3, 
  Lock, 
  ChevronRight, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export default function RightSidebar({ 
  announcements, 
  events, 
  poll, 
  onVotePoll, 
  onSelectTab 
}) {
  const urgentAnnouncement = announcements.find((a) => a.priority === 'urgent') || announcements[0];

  return (
    <aside className="w-80 flex-shrink-0 space-y-4 py-4 px-3 sticky top-[41px] h-[calc(100vh-41px)] overflow-y-auto hidden lg:block border-l border-white/5 select-none">
      
      {/* Official Announcement Spotlight */}
      {urgentAnnouncement && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-amber-500/10 to-amber-500/[0.02] border border-amber-500/20 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <Megaphone className="w-3.5 h-3.5" />
              Official Announcement
            </span>
            <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded uppercase">
              {urgentAnnouncement.priority}
            </span>
          </div>
          <h4 className="text-xs font-semibold text-slate-100 line-clamp-2">
            {urgentAnnouncement.title}
          </h4>
          <p className="text-[11px] text-slate-400 line-clamp-2">
            {urgentAnnouncement.content}
          </p>
          <button
            onClick={() => onSelectTab('announcements')}
            className="text-[11px] font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1 pt-1"
          >
            <span>View all official notices</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Campus Poll Quick Widget */}
      {poll && (
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
              <BarChart3 className="w-3.5 h-3.5" />
              Campus Voice Poll
            </span>
            {poll.isAnonymous && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20" title="Your vote is cryptographically decoupled and completely private">
                <Lock className="w-2.5 h-2.5" />
                Anonymous
              </span>
            )}
          </div>

          <p className="text-xs font-medium text-slate-200">
            {poll.question}
          </p>

          <div className="space-y-1.5">
            {poll.options.map((opt) => {
              const percentage = poll.totalVotes > 0 
                ? Math.round((opt.votes / poll.totalVotes) * 100) 
                : 0;
              const isSelected = poll.userVotedOptionId === opt.id;

              return (
                <button
                  key={opt.id}
                  disabled={poll.hasVoted}
                  onClick={() => onVotePoll(poll.id, opt.id)}
                  className={`w-full relative overflow-hidden text-left p-2 rounded-lg text-xs transition-all border ${
                    isSelected
                      ? 'border-blue-500/60 bg-blue-500/15 text-white'
                      : poll.hasVoted
                      ? 'border-white/5 bg-white/[0.02] text-slate-300'
                      : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 text-slate-300'
                  }`}
                >
                  {/* Fill Progress Bar */}
                  {poll.hasVoted && (
                    <div 
                      className="absolute inset-y-0 left-0 bg-blue-500/15 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  )}

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="truncate pr-2 font-medium">{opt.text}</span>
                    {poll.hasVoted && (
                      <span className="text-[11px] font-semibold text-slate-400 flex-shrink-0">
                        {percentage}%
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>{poll.totalVotes} student votes</span>
            <button 
              onClick={() => onSelectTab('polls')}
              className="text-blue-400 hover:text-blue-300"
            >
              See all polls →
            </button>
          </div>
        </div>
      )}

      {/* Upcoming Campus Events */}
      <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            Upcoming Campus Events
          </span>
          <button 
            onClick={() => onSelectTab('events')} 
            className="text-[11px] text-blue-400 hover:text-blue-300"
          >
            All
          </button>
        </div>

        <div className="space-y-2.5">
          {events.slice(0, 2).map((ev) => (
            <div key={ev.id} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider">
                {ev.department} · {ev.date}
              </span>
              <h5 className="text-xs font-semibold text-slate-200 line-clamp-1">
                {ev.title}
              </h5>
              <p className="text-[11px] text-slate-400">
                📍 {ev.venue}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-2 text-[11px] text-slate-600 space-y-1">
        <p>© 2026 CampusConnect · Air University Kamra</p>
        <p>Restricted to authorized campus domain (.edu.pk)</p>
      </div>
    </aside>
  );
}
