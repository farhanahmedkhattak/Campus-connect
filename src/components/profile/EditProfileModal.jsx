import React, { useState } from 'react';
import { X, User, CheckCircle2 } from 'lucide-react';
import { DEPARTMENTS, BATCH_YEARS } from '../../constants/auKamra';

export default function EditProfileModal({ isOpen, onClose, currentUser, onSaveProfile }) {
  const [bio, setBio] = useState(currentUser.bio || '');
  const [department, setDepartment] = useState(currentUser.department || DEPARTMENTS[0].name);
  const [studentId, setStudentId] = useState(currentUser.studentId || '');
  const [batchYear, setBatchYear] = useState(currentUser.batchYear || 2024);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile({
      bio: bio.trim(),
      department,
      studentId: studentId.trim(),
      batchYear: Number(batchYear),
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0e1422] border border-white/10 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-sm text-white">Edit Academic Profile</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {saved ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-xs font-semibold text-emerald-300">Profile Updated Successfully</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Bio / Academic Interests
              </label>
              <textarea
                rows={3}
                placeholder="Share your academic interests, focus areas, or society involvements..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={280}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-xs text-white focus:border-blue-500 resize-none"
              />
              <span className="text-[10px] text-slate-500 float-right">
                {280 - bio.length} chars left
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:border-blue-500"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d.id} value={d.name} className="bg-[#0e1422]">{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  AU Student ID
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:border-blue-500 uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Batch Year
              </label>
              <select
                value={batchYear}
                onChange={(e) => setBatchYear(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:border-blue-500"
              >
                {BATCH_YEARS.map((y) => (
                  <option key={y} value={y} className="bg-[#0e1422]">{y}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
