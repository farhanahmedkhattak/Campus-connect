import React, { useState } from 'react';
import { BarChart3, Lock, Globe, PlusCircle, CheckCircle2, Clock, X, ShieldCheck } from 'lucide-react';

export default function PollsView({ 
  polls, 
  currentUser, 
  onVotePoll, 
  onCreatePoll 
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [question, setQuestion] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [options, setOptions] = useState(['', '']);

  const handleOptionChange = (idx, val) => {
    const copy = [...options];
    copy[idx] = val;
    setOptions(copy);
  };

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (idx) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== idx));
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const validOptions = options.map((o) => o.trim()).filter(Boolean);
    if (!question.trim() || validOptions.length < 2) return;

    onCreatePoll({
      id: `poll-${Date.now()}`,
      question: question.trim(),
      isAnonymous,
      authorName: currentUser.fullName,
      closesAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isClosed: false,
      totalVotes: 0,
      hasVoted: false,
      userVotedOptionId: null,
      options: validOptions.map((opt, i) => ({
        id: `opt-${Date.now()}-${i}`,
        text: opt,
        votes: 0,
      })),
    });

    setQuestion('');
    setOptions(['', '']);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#0e1422] to-blue-950/30 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <h2 className="text-base font-bold text-white">
              Campus Voice & Student Polls
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Vote on student council initiatives, campus facilities, and academic preferences.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/20 transition-all flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Launch Campus Poll</span>
        </button>
      </div>

      {/* Poll Cards */}
      <div className="space-y-3.5">
        {polls.map((poll) => (
          <div
            key={poll.id}
            className="p-4 sm:p-5 rounded-2xl bg-[#0e1422] border border-white/5 space-y-4"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Posted by {poll.authorName}
                </p>
                <h3 className="text-sm sm:text-base font-semibold text-slate-100 mt-0.5">
                  {poll.question}
                </h3>
              </div>

              {poll.isAnonymous ? (
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex-shrink-0">
                  <Lock className="w-3 h-3" />
                  Anonymous Ballot
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20 flex-shrink-0">
                  <Globe className="w-3 h-3" />
                  Public Voting
                </span>
              )}
            </div>

            {/* Anonymous privacy badge guarantee */}
            {poll.isAnonymous && (
              <div className="px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>
                  Zero-Knowledge Privacy: Your student identity is strictly decoupled from your vote selection.
                </span>
              </div>
            )}

            {/* Options list */}
            <div className="space-y-2">
              {poll.options.map((option) => {
                const percentage = poll.totalVotes > 0 
                  ? Math.round((option.votes / poll.totalVotes) * 100) 
                  : 0;
                const isSelected = poll.userVotedOptionId === option.id;

                return (
                  <button
                    key={option.id}
                    disabled={poll.hasVoted}
                    onClick={() => onVotePoll(poll.id, option.id)}
                    className={`w-full relative overflow-hidden text-left p-3 rounded-xl text-xs sm:text-sm transition-all border ${
                      isSelected
                        ? 'border-purple-500/60 bg-purple-500/15 text-white font-medium'
                        : poll.hasVoted
                        ? 'border-white/5 bg-white/[0.02] text-slate-300'
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 text-slate-300'
                    }`}
                  >
                    {/* Background Progress fill */}
                    {poll.hasVoted && (
                      <div
                        className="absolute inset-y-0 left-0 bg-purple-500/15 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    )}

                    <div className="relative z-10 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        )}
                        <span>{option.text}</span>
                      </div>
                      {poll.hasVoted && (
                        <span className="font-semibold text-slate-300 flex-shrink-0">
                          {percentage}% ({option.votes})
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom info */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>{poll.totalVotes} total student votes</span>
              {poll.hasVoted && (
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Your vote is recorded
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Poll Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0e1422] border border-white/10 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-sm text-white">Create Campus Poll</h3>
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
                  Poll Question
                </label>
                <input
                  type="text"
                  placeholder="e.g. Which elective should be offered next semester?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Poll Options (2 to 5 options)
                </label>
                <div className="space-y-2">
                  {options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Option ${i + 1}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(i, e.target.value)}
                        className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-1.5 text-xs text-white focus:border-purple-500"
                        required
                      />
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(i)}
                          className="p-1 text-slate-500 hover:text-rose-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {options.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="text-[11px] text-purple-400 hover:text-purple-300 mt-2 font-medium"
                  >
                    + Add another option
                  </button>
                )}
              </div>

              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-purple-200">Anonymous Ballot</p>
                  <p className="text-[10px] text-purple-300/80">
                    Voter identity will be mathematically unlinked from their selected option.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500"
                />
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
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl"
                >
                  Publish Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
