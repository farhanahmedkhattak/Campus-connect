import React, { useState } from 'react';
import { MessageSquare, ShieldCheck, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function FeedbackView({ currentUser }) {
  const [category, setCategory] = useState('Campus Facilities');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubject('');
      setMessage('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-[#0e1422] to-indigo-950/30 border border-white/10 space-y-1">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-400" />
          <h2 className="text-base font-bold text-white">Student Voice & Campus Feedback</h2>
        </div>
        <p className="text-xs text-slate-400">
          Direct, confidential channel to Air University Kamra administration, facility managers, and IT services.
        </p>
      </div>

      <div className="p-5 sm:p-6 rounded-2xl bg-[#0e1422] border border-white/5 space-y-4">
        {submitted ? (
          <div className="py-10 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Feedback Submitted Successfully</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your message has been routed to the respective AU Kamra administration committee. Thank you for helping improve our campus.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Feedback Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-blue-500"
                >
                  <option value="Campus Facilities" className="bg-[#0e1422]">Campus Facilities & Labs</option>
                  <option value="Academic Services" className="bg-[#0e1422]">Academic Services & Examinations</option>
                  <option value="Transportation & Cafeteria" className="bg-[#0e1422]">Transportation & Cafeteria</option>
                  <option value="CampusConnect Platform Bug" className="bg-[#0e1422]">CampusConnect Bug / Feature Suggestion</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Subject / Summary
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lab 3 projector malfunction during evening session"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Detailed Feedback or Complaint
              </label>
              <textarea
                rows={5}
                placeholder="Please describe the issue clearly with location, date, or course code where applicable..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-xs text-white focus:border-blue-500 resize-none"
                required
              />
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="text-xs font-semibold text-slate-200">Submit Anonymously</p>
                  <p className="text-[10px] text-slate-500">
                    Omit your student ID and name from the submission ticket.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-white/20 bg-white/5 text-blue-600 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Submit Confidential Feedback</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
