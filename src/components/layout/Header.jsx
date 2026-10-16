import React from 'react';
import { GraduationCap, Bell, Menu, Shield } from 'lucide-react';
import { AU_CAMPUS_NAME, APP_NAME } from '../../constants/auKamra';

export default function Header({ 
  currentTab, 
  currentUser, 
  unreadNotifsCount, 
  onSelectTab, 
  pendingPostsCount 
}) {
  const isModeratorOrAdmin = currentUser.role === 'moderator' || currentUser.role === 'admin';

  return (
    <header className="lg:hidden sticky top-[41px] z-30 bg-[#080c14]/90 backdrop-blur-md border-b border-white/5 px-4 py-2.5 flex items-center justify-between">
      {/* Brand */}
      <div 
        onClick={() => onSelectTab('home')}
        className="flex items-center gap-2 cursor-pointer select-none"
      >
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
          <GraduationCap className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold text-sm text-white">{APP_NAME}</span>
          <span className="text-[10px] text-blue-400 block -mt-0.5">{AU_CAMPUS_NAME}</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {isModeratorOrAdmin && pendingPostsCount > 0 && (
          <button
            onClick={() => onSelectTab('moderation')}
            className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{pendingPostsCount}</span>
          </button>
        )}

        <button
          onClick={() => onSelectTab('notifications')}
          className="p-2 rounded-lg bg-white/[0.04] text-slate-300 hover:text-white relative"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500" />
          )}
        </button>

        <button
          onClick={() => onSelectTab('profile')}
          className="p-0.5 rounded-full border border-white/10"
        >
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.fullName}
            className="w-7 h-7 rounded-full object-cover"
          />
        </button>
      </div>
    </header>
  );
}
