import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Bookmark, 
  Share2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Send, 
  Trash2, 
  ShieldAlert, 
  MoreHorizontal 
} from 'lucide-react';

export default function PostCard({ 
  post, 
  currentUser, 
  onLike, 
  onBookmark, 
  onAddComment, 
  onDeleteComment,
  onApprovePost, 
  onRejectPost 
}) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const isAuthor = post.authorId === currentUser.id;
  const isModeratorOrAdmin = currentUser.role === 'moderator' || currentUser.role === 'admin';
  const isPending = post.status === 'pending';

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText.trim());
    setCommentText('');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <article className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
      isPending
        ? 'bg-amber-500/[0.03] border-amber-500/25'
        : 'bg-[#0e1422] hover:bg-[#12192a] border-white/5 hover:border-white/10'
    }`}>
      {/* Pending Banner for Author / Moderator */}
      {isPending && (
        <div className="mb-3.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span className="font-semibold">Under Moderator Review</span>
            <span className="text-[11px] text-amber-400/80 hidden sm:inline">
              — Invisible to other students until approved
            </span>
          </div>
          {isModeratorOrAdmin && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onApprovePost(post.id)}
                className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] flex items-center gap-1 transition-all"
              >
                <CheckCircle2 className="w-3 h-3" />
                Approve
              </button>
              <button
                onClick={() => onRejectPost(post.id)}
                className="px-2 py-0.5 rounded bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white font-medium text-[11px] flex items-center gap-1 transition-all"
              >
                <XCircle className="w-3 h-3" />
                Reject
              </button>
            </div>
          )}
        </div>
      )}

      {/* Author Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={post.authorAvatar}
            alt={post.authorName}
            className="w-10 h-10 rounded-full object-cover border border-white/10"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm text-slate-100 hover:text-blue-400 transition-colors cursor-pointer">
                {post.authorName}
              </h3>
              <span className="text-xs text-slate-400">
                @{post.username}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium">
                {post.department}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
              <span>Batch {post.batch}</span>
              <span>•</span>
              <span>{post.timestamp}</span>
            </p>
          </div>
        </div>

        {/* Status Badge */}
        {!isPending && (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        )}
      </div>

      {/* Post Content */}
      <div className="mt-3.5 space-y-3">
        <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
          {post.content}
        </p>

        {/* Image Attachment (if any) */}
        {post.imageUrls && post.imageUrls.length > 0 && (
          <div className="rounded-xl overflow-hidden border border-white/10 max-h-96">
            <img
              src={post.imageUrls[0]}
              alt="Campus Post attachment"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 select-none">
        {/* Like Button */}
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
            post.isLiked
              ? 'text-rose-400 bg-rose-500/10 font-medium'
              : 'hover:text-rose-400 hover:bg-white/[0.04]'
          }`}
          title={post.isLiked ? 'Unlike post' : 'Like post'}
        >
          <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
          <span>{post.likesCount}</span>
        </button>

        {/* Comment Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
            showComments
              ? 'text-blue-400 bg-blue-500/10 font-medium'
              : 'hover:text-blue-400 hover:bg-white/[0.04]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{post.commentsCount}</span>
        </button>

        {/* Bookmark Button */}
        <button
          onClick={() => onBookmark(post.id)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
            post.isBookmarked
              ? 'text-amber-400 bg-amber-500/10 font-medium'
              : 'hover:text-amber-400 hover:bg-white/[0.04]'
          }`}
          title="Private bookmark (only you can see this)"
        >
          <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:text-slate-200 hover:bg-white/[0.04] transition-all"
          title="Copy link to post"
        >
          <Share2 className="w-4 h-4" />
          <span>{isCopied ? 'Copied' : 'Share'}</span>
        </button>
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-white/5 space-y-3">
          {/* New Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Write a constructive campus comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              maxLength={500}
              className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:bg-white/[0.05] transition-all"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white rounded-xl text-xs font-medium flex items-center gap-1 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Comment List */}
          <div className="space-y-2 pt-1">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((c) => (
                <div key={c.id} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-200">{c.authorName}</span>
                      <span className="text-[10px] text-slate-400">@{c.username}</span>
                      <span className="text-[10px] text-slate-500">• {c.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-300">{c.content}</p>
                  </div>
                  {(c.username === currentUser.username || isModeratorOrAdmin) && (
                    <button
                      onClick={() => onDeleteComment(post.id, c.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                      title="Delete comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-2">
                No comments yet. Start the conversation!
              </p>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
