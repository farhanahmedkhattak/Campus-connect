import React from 'react';
import { 
  Home, 
  Megaphone, 
  Calendar, 
  Users, 
  FileText, 
  BarChart3, 
  MessageSquare, 
  Bookmark, 
  Bell, 
  User, 
  ShieldAlert,
  PlusCircle,
  GraduationCap,
  LogIn
} from 'lucide-react';
import { AU_CAMPUS_NAME, APP_NAME } from '../../constants/auKamra';

export default function LeftSidebar({ 
  currentTab, 
  onSelectTab, 
  currentUser, 
  pendingPostsCount, 
  unreadNotifsCount,
  onOpenCreatePost,
  onOpenAuth,
  isDemoMode 
}) {
  const isModeratorOrAdmin = currentUser.role === 'moderator' || currentUser.role === 'admin';

  const navItems = [
    { id: 'home', label: 'Home Feed', icon: Home },
    { id: 'announcements', label: 'Official Notices', icon: Megaphone, badge: 'Urgent' },
    { id: 'events', label: 'Campus Events', icon: Calendar },
    { id: 'societies', label: 'Societies & Clubs', icon: Users },
    { id: 'pastpapers', label: 'Past Papers', icon: FileText, accent: 'text-cyan-400' },
    { id: 'polls', label: 'Campus Polls', icon: BarChart3 },
    { id: 'feedback', label: 'Student Feedback', icon: MessageSquare },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: unreadNotifsCount },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  if (isModeratorOrAdmin) {
    navItems.push({
      id: 'moderation',
      label: 'Moderation Queue',
      icon: ShieldAlert,
      count: pendingPostsCount,
      highlight: true
    });
  }

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col justify-between h-[calc(100vh-41px)] sticky top-[41px] border-r border-white/5 py-4 px-3 select-none">
      <div className="space-y-6">
        {/* Campus Brand Identity */}
        <div className="px-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base text-white tracking-tight flex items-center gap-1.5">
              {APP_NAME}
            </h1>
            <p className="text-[11px] text-blue-400 font-medium tracking-wide">
              {AU_CAMPUS_NAME}
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                } ${item.highlight ? 'text-amber-300 hover:text-amber-200' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : item.accent || 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.count > 0 && (
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                    item.highlight 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                      : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {item.count}
                  </span>
                )}

                {item.badge && !item.count && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Create Post Action */}
        <div className="pt-2">
          <button
            onClick={onOpenCreatePost}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-blue-400/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Campus Post</span>
          </button>
          <p className="text-[10px] text-center text-slate-500 mt-1.5">
            Subject to community guidelines & review
          </p>
        </div>
      </div>

      {/* User Card */}
      <div 
        onClick={() => onSelectTab('profile')}
        className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.fullName}
            className="w-9 h-9 rounded-full object-cover border border-white/10 flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {currentUser.fullName}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              @{currentUser.username}
            </p>
          </div>
        </div>
        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
          currentUser.role === 'admin' 
            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
            : currentUser.role === 'faculty'
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            : currentUser.role === 'moderator'
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
        }`}>
          {currentUser.role}
        </span>
      </div>

      {/* Auth / Account Switcher Trigger */}
      <button
        onClick={onOpenAuth}
        className="w-full mt-2 py-1.5 px-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 text-[11px] text-blue-400 font-medium flex items-center justify-center gap-1.5 transition-all"
      >
        <LogIn className="w-3.5 h-3.5" />
        <span>{isDemoMode ? 'Connect Account (.edu)' : 'Account Settings'}</span>
      </button>
    </aside>
  );
}
