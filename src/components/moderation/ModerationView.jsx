import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, FileText, UserCheck, X } from 'lucide-react';

export default function ModerationView({ 
  posts, 
  currentUser, 
  onApprovePost, 
  onRejectPost 
}) {
  const [rejectingPostId, setRejectingPostId] = useState(null);
  const [rejectReason, setRejectReason] = useState('Community Guidelines Violation');
  const [customReason, setCustomReason] = useState('');

  const isModeratorOrAdmin = currentUser.role === 'moderator' || currentUser.role === 'admin';

  if (!isModeratorOrAdmin) {
    return (
      <div className="p-8 text-center rounded-2xl bg-[#0e1422] border border-rose-500/20 space-y-3">
        <ShieldAlert className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-base font-bold text-white">Access Denied</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          The Moderation Desk is restricted to designated Air University Kamra moderators and IT administrators.
        </p>
      </div>
    );
  }

  const pendingPosts = posts.filter((p) => p.status === 'pending');

  const handleConfirmReject = (e) => {
    e.preventDefault();
    const finalReason = rejectReason === 'Other' ? customReason : rejectReason;
    onRejectPost(rejectingPostId, finalReason);
    setRejectingPostId(null);
    setCustomReason('');
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0e1422] to-amber-950/20 border border-white/10 flex items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              Campus Moderation & Quality Control Desk
            </h2>
            <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
              Active Session
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Review student submissions before publication. All actions are logged to the audit ledger.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xl font-bold text-amber-400 font-mono">
            {pendingPosts.length}
          </span>
          <p className="text-[11px] text-slate-500">pending review</p>
        </div>
      </div>

      {/* Pending Posts Queue */}
      <div className="space-y-3.5">
        {pendingPosts.length > 0 ? (
          pendingPosts.map((post) => (
            <div
              key={post.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#0e1422] border border-amber-500/30 space-y-4"
            >
              {/* Author details */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-100">
                        {post.authorName}
                      </span>
                      <span className="text-xs text-slate-400">
                        @{post.username}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {post.department} • Batch {post.batch} • Submitted {post.timestamp}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Awaiting Review
                </span>
              </div>

              {/* Content preview */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                {post.imageUrls && post.imageUrls.length > 0 && (
                  <div className="rounded-lg overflow-hidden border border-white/10 max-h-64 mt-2">
                    <img
                      src={post.imageUrls[0]}
                      alt="Submitted attachment"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Moderation Controls */}
              <div className="flex items-center justify-between pt-1">
                <p className="text-[11px] text-slate-500">
                  Reviewer: <span className="text-slate-300 font-medium">{currentUser.fullName}</span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRejectingPostId(post.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject Post</span>
                  </button>

                  <button
                    onClick={() => onApprovePost(post.id)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve for Campus Feed</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 rounded-2xl bg-[#0e1422] border border-white/5 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-200">Moderation Queue is Clear</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All student posts have been reviewed and processed according to Air University Kamra community standards.
            </p>
          </div>
        )}
      </div>

      {/* Rejection Dialog */}
      {rejectingPostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0e1422] border border-white/10 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-400" />
                <h3 className="font-bold text-sm text-white">Specify Rejection Reason</h3>
              </div>
              <button
                onClick={() => setRejectingPostId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Standard Policy Violation
                </label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-rose-500"
                >
                  <option value="Community Guidelines Violation" className="bg-[#0e1422]">General Community Guidelines Violation</option>
                  <option value="Inappropriate or Offensive Language" className="bg-[#0e1422]">Inappropriate or Offensive Language</option>
                  <option value="Spam or Unverified Advertisements" className="bg-[#0e1422]">Spam / Commercial Advertisement</option>
                  <option value="Academic Dishonesty / Exam Leak Attempt" className="bg-[#0e1422]">Academic Integrity / Exam Policy Violation</option>
                  <option value="Other" className="bg-[#0e1422]">Other (Custom Reason)</option>
                </select>
              </div>

              {rejectReason === 'Other' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Custom Feedback for Author
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide constructive explanation for the student..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-xs text-white focus:border-rose-500 resize-none"
                    required
                  />
                </div>
              )}

              <p className="text-[11px] text-slate-500">
                This notice will be recorded in the audit log and notified to the student with clear guidance.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingPostId(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
