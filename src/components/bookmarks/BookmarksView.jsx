import React from 'react';
import PostCard from '../feed/PostCard';
import { Bookmark, Lock } from 'lucide-react';

export default function BookmarksView({ 
  posts, 
  currentUser, 
  onLike, 
  onBookmark, 
  onAddComment, 
  onDeleteComment 
}) {
  const bookmarkedPosts = posts.filter((p) => p.isBookmarked);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#0e1422] to-blue-950/30 border border-white/10 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold text-white">Private Bookmarks</h2>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            <Lock className="w-3 h-3" />
            Only visible to you
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Saved campus updates, academic references, and important study circle announcements.
        </p>
      </div>

      {/* Bookmarked Items */}
      <div className="space-y-3.5">
        {bookmarkedPosts.length > 0 ? (
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
          <div className="text-center py-12 rounded-2xl bg-[#0e1422] border border-white/5 space-y-2">
            <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-200">No Saved Posts Yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click the bookmark icon on any post in the campus feed to save it privately to your reading list.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
