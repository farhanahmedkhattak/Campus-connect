import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Upload, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  X,
  FileCheck
} from 'lucide-react';
import { DEPARTMENTS, SEMESTERS, EXAM_TERMS } from '../../constants/auKamra';

export default function PastPapersView({ 
  pastPapers, 
  currentUser, 
  onUploadPaper 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload Form State
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [uploadDept, setUploadDept] = useState(DEPARTMENTS[0].name);
  const [uploadSemester, setUploadSemester] = useState(3);
  const [uploadTerm, setUploadTerm] = useState('midterm');
  const [uploadYear, setUploadYear] = useState(2025);

  const filteredPapers = pastPapers.filter((paper) => {
    if (selectedDept !== 'all' && paper.department !== selectedDept) return false;
    if (selectedSemester !== 'all' && paper.semester !== Number(selectedSemester)) return false;
    if (selectedTerm !== 'all' && paper.examType !== selectedTerm) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        paper.courseCode.toLowerCase().includes(q) ||
        paper.courseName.toLowerCase().includes(q) ||
        paper.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!courseCode.trim() || !courseName.trim()) return;

    onUploadPaper({
      id: `pp-${Date.now()}`,
      courseCode: courseCode.trim().toUpperCase(),
      courseName: courseName.trim(),
      department: uploadDept,
      semester: Number(uploadSemester),
      examType: uploadTerm,
      year: Number(uploadYear),
      fileSize: '1.5 MB',
      uploadedBy: currentUser.fullName,
      downloads: 0,
      status: 'approved', // Auto-approved in demo mode or pending
    });

    setCourseCode('');
    setCourseName('');
    setShowUploadModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-[#0e1422] to-blue-950/30 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white">
              Air University Kamra Academic Bank
            </h2>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Verified Exams
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Browse verified midterm and final examination papers organized by department and semester.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-600/20 transition-all flex-shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Past Paper</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-[#0e1422] border border-white/5 rounded-2xl p-3.5 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by course code (e.g. CS-201, CY-301) or course title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Department Picker */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:border-cyan-500"
            >
              <option value="all" className="bg-[#0e1422]">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.name} className="bg-[#0e1422]">
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          {/* Semester Picker */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:border-cyan-500"
            >
              <option value="all" className="bg-[#0e1422]">All Semesters (1 - 8)</option>
              {SEMESTERS.map((s) => (
                <option key={s} value={s} className="bg-[#0e1422]">
                  Semester {s}
                </option>
              ))}
            </select>
          </div>

          {/* Exam Term Picker */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Examination Term
            </label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:border-cyan-500"
            >
              <option value="all" className="bg-[#0e1422]">All Exam Types</option>
              {EXAM_TERMS.map((t) => (
                <option key={t.id} value={t.id} className="bg-[#0e1422]">
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Past Papers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredPapers.map((paper) => (
          <div
            key={paper.id}
            className="p-4 rounded-2xl bg-[#0e1422] border border-white/5 hover:border-cyan-500/30 transition-all space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  {paper.courseCode}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  paper.examType === 'midterm'
                    ? 'bg-blue-500/20 text-blue-300'
                    : 'bg-purple-500/20 text-purple-300'
                }`}>
                  {paper.examType} {paper.year}
                </span>
              </div>

              <h4 className="font-semibold text-sm text-slate-100 mt-2">
                {paper.courseName}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {paper.department} • Semester {paper.semester}
              </p>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px] text-slate-500">
                Uploaded by {paper.uploadedBy} ({paper.fileSize})
              </span>
              <button
                onClick={() => alert(`Simulating PDF download for ${paper.courseCode} (${paper.courseName})`)}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-300 flex items-center gap-1.5 transition-all text-[11px]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPapers.length === 0 && (
        <div className="text-center py-12 rounded-2xl bg-[#0e1422] border border-white/5 space-y-2">
          <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">No past papers match your filter</p>
          <p className="text-xs text-slate-500">
            Try choosing a different department or semester, or upload one to help fellow students.
          </p>
        </div>
      )}

      {/* Upload Past Paper Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0e1422] border border-white/10 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Upload Past Exam Paper</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CY-301"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Course Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Digital Forensics"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Department
                  </label>
                  <select
                    value={uploadDept}
                    onChange={(e) => setUploadDept(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-cyan-500"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d.id} value={d.name} className="bg-[#0e1422]">{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Semester
                  </label>
                  <select
                    value={uploadSemester}
                    onChange={(e) => setUploadSemester(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-cyan-500"
                  >
                    {SEMESTERS.map((s) => (
                      <option key={s} value={s} className="bg-[#0e1422]">Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Exam Term
                  </label>
                  <select
                    value={uploadTerm}
                    onChange={(e) => setUploadTerm(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-cyan-500"
                  >
                    {EXAM_TERMS.map((t) => (
                      <option key={t.id} value={t.id} className="bg-[#0e1422]">{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Exam Year
                  </label>
                  <input
                    type="number"
                    min={2018}
                    max={2026}
                    value={uploadYear}
                    onChange={(e) => setUploadYear(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              {/* Upload file simulation */}
              <div className="p-4 rounded-xl border border-dashed border-white/20 bg-white/[0.02] text-center space-y-1">
                <FileCheck className="w-6 h-6 text-cyan-400 mx-auto" />
                <p className="text-xs font-medium text-slate-200">
                  Select clean PDF exam paper
                </p>
                <p className="text-[10px] text-slate-500">
                  Maximum 10 MB • PDFs only • Must be legible
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl"
                >
                  Upload for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
