import React from 'react';
import { Home, Megaphone, PlusCircle, FileText, User, Bell } from 'lucide-react';

export default function MobileNav({ currentTab, onSelectTab, onOpenCreatePost, unreadNotifsCount }) {
  const tabs = [
    { id: 'home', label: 'Feed', icon: Home },
    { id: 'announcements', label: 'Notices', icon: Megaphone },
    { id: 'create', label: 'Post', icon: PlusCircle, isAction: true },
    { id: 'pastpapers', label: 'Papers', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 bg-[#080c14]/95 backdrop-blur-xl border-t border-white/10 z-40 px-2 py-1.5 flex items-center justify-around select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        if (tab.isAction) {
          return (
            <button
              key={tab.id}
              onClick={onOpenCreatePost}
              className="flex flex-col items-center justify-center -mt-5"
            >
              <div className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 border-2 border-[#080c14]">
                <PlusCircle className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-semibold text-blue-400 mt-1">Post</span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all ${
              isActive ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
