import React, { useState } from 'react';
import { 
  Megaphone, 
  Pin, 
  FileDown, 
  PlusCircle, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar,
  X
} from 'lucide-react';
import { ANNOUNCEMENT_CATEGORIES } from '../../constants/auKamra';

export default function AnnouncementsView({ 
  announcements, 
  currentUser, 
  onAddAnnouncement 
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(ANNOUNCEMENT_CATEGORIES[0].label);
  const [priority, setPriority] = useState('medium');
  const [isPinned, setIsPinned] = useState(false);

  const isFacultyOrAdmin = currentUser.role === 'faculty' || currentUser.role === 'admin';

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onAddAnnouncement({
      id: `ann-${Date.now()}`,
      authorName: currentUser.fullName,
      authorRole: currentUser.role === 'faculty' ? 'Faculty / Academic Council' : 'Campus Administration',
      authorDept: currentUser.department,
      authorAvatar: currentUser.avatarUrl,
      title: title.trim(),
      content: content.trim(),
      category,
      priority,
      isPinned,
      attachments: [],
      timestamp: 'Just now',
      date: new Date().toISOString(),
    });

    setTitle('');
    setContent('');
    setIsPinned(false);
    setShowCreateModal(false);
  };

  const filtered = announcements.filter((a) => {
    if (selectedCategory === 'all') return true;
    return a.category === selectedCategory;
  });

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900/40 via-[#0e1422] to-amber-900/20 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold text-white">
              Official University Notices
            </h2>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Verified
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Institutional announcements issued by Air University Kamra administration and faculty heads.
          </p>
        </div>

        {/* Publish Action (Faculty/Admin only) */}
        {isFacultyOrAdmin ? (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish Notice</span>
          </button>
        ) : (
          <div className="text-[11px] text-slate-500 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-1.5 flex-shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Official Faculty-Only Channel</span>
          </div>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-slate-200 bg-white/[0.02] border border-white/5'
          }`}
        >
          All Announcements
        </button>
        {ANNOUNCEMENT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.label)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.label
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 bg-white/[0.02] border border-white/5'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-3.5">
        {filtered.map((item) => (
          <article
            key={item.id}
            className={`p-4 sm:p-5 rounded-2xl border transition-all ${
              item.priority === 'urgent'
                ? 'bg-amber-500/[0.03] border-amber-500/30'
                : 'bg-[#0e1422] border-white/5'
            }`}
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={item.authorAvatar}
                  alt={item.authorName}
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-slate-100">
                      {item.authorName}
                    </span>
                    <span className="text-[11px] text-amber-400 font-medium">
                      ({item.authorRole})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {item.authorDept} • {item.timestamp}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {item.isPinned && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                    <Pin className="w-3 h-3" />
                    Pinned
                  </span>
                )}
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  item.priority === 'urgent'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : item.priority === 'high'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-white/5 text-slate-400 border border-white/10'
                }`}>
                  {item.priority}
                </span>
              </div>
            </div>

            {/* Title & Body */}
            <div className="mt-3.5 space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-white">
                {item.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {item.content}
              </p>
            </div>

            {/* Attachments (e.g. Exam datesheets) */}
            {item.attachments && item.attachments.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/5">
                <p className="text-[11px] font-semibold text-slate-400 mb-1.5">
                  Official Attachments:
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.attachments.map((att, i) => (
                    <button
                      key={i}
                      onClick={() => alert(`Simulating secure download of ${att.name}`)}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-blue-400 flex items-center gap-2 transition-all"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>{att.name}</span>
                      <span className="text-[10px] text-slate-500">({att.size})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Faculty Announcement Publisher Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0e1422] border border-white/10 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Publish Official Notice</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Notice Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Schedule for Midterm Examinations Fall 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-blue-500"
                  >
                    {ANNOUNCEMENT_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.label} className="bg-[#0e1422]">{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-blue-500"
                  >
                    <option value="low" className="bg-[#0e1422]">Low Priority</option>
                    <option value="medium" className="bg-[#0e1422]">Medium Priority</option>
                    <option value="high" className="bg-[#0e1422]">High Priority</option>
                    <option value="urgent" className="bg-[#0e1422]">Urgent Advisory</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Notice Details
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide comprehensive details, instructions, and dates..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-xs text-white focus:border-blue-500 resize-none"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pinNotice"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="pinNotice" className="text-xs text-slate-300 cursor-pointer">
                  Pin this notice to top of campus feed
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-xl"
                >
                  Publish Officially
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
