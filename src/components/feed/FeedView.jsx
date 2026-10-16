import React, { useState } from 'react';
import PostCard from './PostCard';
import { 
  Sparkles, 
  Users, 
  Clock, 
  PlusCircle, 
  ShieldCheck, 
  Filter 
} from 'lucide-react';
import { DEPARTMENTS } from '../../constants/auKamra';

export default function FeedView({ 
  posts, 
  currentUser, 
  onLike, 
  onBookmark, 
  onAddComment, 
  onDeleteComment,
  onApprovePost, 
  onRejectPost, 
  onOpenCreatePost 
}) {
  const [activeSubTab, setActiveSubTab] = useState('foryou'); // 'foryou', 'following', 'mysubmissions'
  const [selectedDept, setSelectedDept] = useState('all');

  // Filter posts based on tab
  const filteredPosts = posts.filter((post) => {
    // Department filter
    if (selectedDept !== 'all' && post.department !== selectedDept) {
      return false;
    }

    if (activeSubTab === 'foryou') {
      // Approved posts OR the author's own pending post
      return post.status === 'approved' || post.authorId === currentUser.id;
    }

    if (activeSubTab === 'following') {
      // In demo mode, posts from other users that are approved
      return post.status === 'approved' && post.authorId !== currentUser.id;
    }

    if (activeSubTab === 'mysubmissions') {
      // Only the current user's submissions (both pending & approved)
      return post.authorId === currentUser.id;
    }

    return true;
  });

  const myPendingCount = posts.filter(
    (p) => p.authorId === currentUser.id && p.status === 'pending'
  ).length;

  return (
    <div className="space-y-4">
      {/* Feed Tabs & Quick Filter */}
      <div className="bg-[#0e1422] border border-white/5 rounded-2xl p-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveSubTab('foryou')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeSubTab === 'foryou'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Feed</span>
          </button>

          <button
            onClick={() => setActiveSubTab('following')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeSubTab === 'following'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Following</span>
          </button>

          <button
            onClick={() => setActiveSubTab('mysubmissions')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeSubTab === 'mysubmissions'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>My Submissions</span>
            {myPendingCount > 0 && (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full border border-amber-500/30">
                {myPendingCount} pending
              </span>
            )}
          </button>
        </div>

        {/* Department Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500 hidden sm:inline" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-white/[0.03] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:border-blue-500"
          >
            <option value="all" className="bg-[#0e1422]">All AU Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.name} className="bg-[#0e1422]">{d.name} ({d.code})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Composer Box */}
      <div 
        onClick={onOpenCreatePost}
        className="p-3.5 rounded-2xl bg-[#0e1422] border border-white/5 hover:border-white/10 cursor-pointer transition-all flex items-center gap-3 select-none"
      >
        <img
          src={currentUser.avatarUrl}
          alt={currentUser.fullName}
          className="w-9 h-9 rounded-full object-cover border border-white/10"
        />
        <div className="flex-1 bg-white/[0.03] hover:bg-white/[0.05] border border-white/5 rounded-xl px-3.5 py-2 text-xs text-slate-400 transition-colors">
          Share academic updates, student inquiries, or society activities...
        </div>
        <button
          type="button"
          className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Post Stream */}
      <div className="space-y-3.5">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              onLike={onLike}
              onBookmark={onBookmark}
              onAddComment={onAddComment}
              onDeleteComment={onDeleteComment}
              onApprovePost={onApprovePost}
              onRejectPost={onRejectPost}
            />
          ))
        ) : (
          <div className="text-center py-12 px-4 rounded-2xl bg-[#0e1422] border border-white/5 space-y-2">
            <p className="text-sm font-semibold text-slate-300">No posts in this feed yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Be the first to share an academic inquiry, club announcement, or study session for {selectedDept === 'all' ? 'Air University Kamra' : selectedDept}!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
