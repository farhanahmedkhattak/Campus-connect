import React, { useState } from 'react';
import PostCard from '../feed/PostCard';
import { 
  User, 
  GraduationCap, 
  Calendar, 
  Mail, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Bookmark 
} from 'lucide-react';

export default function ProfileView({ 
  currentUser, 
  posts, 
  onLike, 
  onBookmark, 
  onAddComment, 
  onDeleteComment 
}) {
  const [profileTab, setProfileTab] = useState('posts'); // 'posts', 'pending', 'bookmarks'

  const userPosts = posts.filter((p) => p.authorId === currentUser.id);
  const approvedPosts = userPosts.filter((p) => p.status === 'approved');
  const pendingPosts = userPosts.filter((p) => p.status === 'pending');
  const bookmarkedPosts = posts.filter((p) => p.isBookmarked);

  return (
    <div className="space-y-4">
      {/* Profile Card */}
      <div className="rounded-2xl bg-[#0e1422] border border-white/5 overflow-hidden">
        {/* Banner Gradient */}
        <div className="h-28 bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900 border-b border-white/5" />

        <div className="p-4 sm:p-6 relative pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.fullName}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-[#0e1422] shadow-xl"
            />

            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-xl border ${
                currentUser.role === 'admin'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  : currentUser.role === 'faculty'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : currentUser.role === 'moderator'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
              }`}>
                {currentUser.role}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {currentUser.fullName}
              </h2>
              <p className="text-xs text-slate-400">
                @{currentUser.username} • <span className="text-blue-400">{currentUser.email}</span>
              </p>
            </div>

            {currentUser.bio && (
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                {currentUser.bio}
              </p>
            )}

            {/* Academic details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Department</span>
                <p className="font-semibold text-slate-200 truncate">{currentUser.department}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Student Reg ID</span>
                <p className="font-semibold text-slate-200 truncate">{currentUser.studentId}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Batch Year</span>
                <p className="font-semibold text-slate-200">{currentUser.batchYear}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Campus</span>
                <p className="font-semibold text-slate-200">Kamra</p>
              </div>
            </div>

            {/* Social Follower counts */}
            <div className="flex items-center gap-6 pt-2 text-xs">
              <div>
                <span className="font-bold text-white">{currentUser.followersCount} </span>
                <span className="text-slate-400">Followers</span>
              </div>
              <div>
                <span className="font-bold text-white">{currentUser.followingCount} </span>
                <span className="text-slate-400">Following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#0e1422] border border-white/5 rounded-2xl p-1.5 overflow-x-auto">
        <button
          onClick={() => setProfileTab('posts')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            profileTab === 'posts'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Approved Posts ({approvedPosts.length})</span>
        </button>

        <button
          onClick={() => setProfileTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            profileTab === 'pending'
              ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Submissions ({pendingPosts.length})</span>
        </button>

        <button
          onClick={() => setProfileTab('bookmarks')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            profileTab === 'bookmarks'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Bookmarks ({bookmarkedPosts.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-3.5">
        {profileTab === 'posts' && (
          approvedPosts.length > 0 ? (
            approvedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onLike={onLike}
                onBookmark={onBookmark}
                onAddComment={onAddComment}
                onDeleteComment={onDeleteComment}
              />
            ))
          ) : (
            <div className="text-center py-10 rounded-2xl bg-[#0e1422] border border-white/5 text-xs text-slate-500">
              No approved posts yet.
            </div>
          )
        )}

        {profileTab === 'pending' && (
          pendingPosts.length > 0 ? (
            pendingPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onLike={onLike}
                onBookmark={onBookmark}
                onAddComment={onAddComment}
                onDeleteComment={onDeleteComment}
              />
            ))
          ) : (
            <div className="text-center py-10 rounded-2xl bg-[#0e1422] border border-white/5 text-xs text-slate-500">
              No pending submissions. All your posts have been processed!
            </div>
          )
        )}

        {profileTab === 'bookmarks' && (
          bookmarkedPosts.length > 0 ? (
            bookmarkedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onLike={onLike}
                onBookmark={onBookmark}
                onAddComment={onAddComment}
                onDeleteComment={onDeleteComment}
              />
            ))
          ) : (
            <div className="text-center py-10 rounded-2xl bg-[#0e1422] border border-white/5 text-xs text-slate-500">
              No saved bookmarks yet.
            </div>
          )
        )}
      </div>
    </div>
  );
}
