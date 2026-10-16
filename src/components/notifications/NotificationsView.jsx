import React from 'react';
import { Bell, Heart, MessageSquare, Megaphone, CheckCircle2, UserPlus, Check } from 'lucide-react';

export default function NotificationsView({ notifications, onMarkAllRead }) {
  const getIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />;
      case 'comment':
        return <MessageSquare className="w-3.5 h-3.5 text-blue-400" />;
      case 'announcement':
        return <Megaphone className="w-3.5 h-3.5 text-amber-400" />;
      case 'post_approved':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1422] border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-400" />
          <h2 className="text-base font-bold text-white">Notifications</h2>
        </div>
        <button
          onClick={onMarkAllRead}
          className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Notifications list */}
      <div className="space-y-2">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
              notif.isRead
                ? 'bg-[#0e1422]/60 border-white/5 opacity-80'
                : 'bg-[#0e1422] border-blue-500/20 shadow-sm'
            }`}
          >
            <div className="relative">
              <img
                src={notif.actorAvatar}
                alt={notif.actorName}
                className="w-9 h-9 rounded-full object-cover border border-white/10"
              />
              <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-[#080c14] border border-white/10">
                {getIcon(notif.type)}
              </div>
            </div>

            <div className="flex-1 space-y-0.5 min-w-0">
              <p className="text-xs text-slate-200">
                <span className="font-semibold text-white">{notif.actorName} </span>
                {notif.message}
              </p>
              <p className="text-[11px] text-slate-500">{notif.timestamp}</p>
            </div>

            {!notif.isRead && (
              <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
