import React, { useState } from 'react';
import { X, Image, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { DEPARTMENTS } from '../../constants/auKamra';

export default function CreatePostModal({ isOpen, onClose, onSubmitPost, currentUser }) {
  const [content, setContent] = useState('');
  const [department, setDepartment] = useState(currentUser.department || 'Cyber Security');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSubmitPost({
      content: content.trim(),
      department,
      imageUrls: imageUrl.trim() ? [imageUrl.trim()] : [],
    });

    setContent('');
    setImageUrl('');
    setShowImageInput(false);
    onClose();
  };

  const isStudent = currentUser.role === 'student';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0e1422] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4 p-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-100 text-sm">
              Create Campus Community Post
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User preview & Dept selector */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.fullName}
              className="w-8 h-8 rounded-full object-cover border border-white/10"
            />
            <div>
              <p className="text-xs font-semibold text-slate-200">{currentUser.fullName}</p>
              <p className="text-[10px] text-slate-400">@{currentUser.username}</p>
            </div>
          </div>

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="bg-white/[0.04] border border-white/10 rounded-lg text-xs text-slate-200 px-2.5 py-1.5 focus:border-blue-500"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept.id} value={dept.name} className="bg-[#0e1422]">
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Text Area */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            rows={5}
            placeholder="Share an academic discovery, study circle, project milestone, or question for AU Kamra students..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={2000}
            className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:bg-white/[0.04] resize-none transition-all"
            autoFocus
          />

          {/* Optional Image URL */}
          {showImageInput && (
            <input
              type="url"
              placeholder="Paste image URL (e.g. https://...)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-blue-500"
            />
          )}

          {/* Moderation Workflow Notice */}
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-2.5 text-xs text-blue-300">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-400" />
            <div>
              <p className="font-semibold text-blue-200">Campus Moderation Guardrail</p>
              <p className="text-[11px] text-blue-300/80 mt-0.5">
                {isStudent 
                  ? "As a student submission, this post will enter the pending queue. It will become visible on the public campus feed once verified by Dr. Tariq or authorized moderators."
                  : "As a moderator/faculty/admin, your submission can be reviewed directly in the campus feed."}
              </p>
            </div>
          </div>

          {/* Actions & Submit */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowImageInput(!showImageInput)}
                className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all ${
                  showImageInput 
                    ? 'bg-blue-600/20 border-blue-500/30 text-blue-400' 
                    : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Image className="w-4 h-4" />
                <span className="hidden sm:inline">Add Image</span>
              </button>
              <span className="text-[11px] text-slate-500">
                {2000 - content.length} chars left
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!content.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center gap-1.5"
              >
                <span>{isStudent ? 'Submit for Review' : 'Publish Post'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
