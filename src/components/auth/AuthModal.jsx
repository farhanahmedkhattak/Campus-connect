import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DEPARTMENTS, BATCH_YEARS, AU_CAMPUS_NAME, APP_NAME } from '../../constants/auKamra';
import { GraduationCap, ShieldAlert, X, AlertCircle, CheckCircle2, Lock } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    authError, 
    setAuthError,
    isConfigured 
  } = useAuth();

  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0].name);
  const [studentId, setStudentId] = useState('');
  const [batchYear, setBatchYear] = useState(2024);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg('');

    if (mode === 'signin') {
      const res = await signInWithEmail(email, password);
      if (!res.error) {
        onClose();
      }
    } else {
      const res = await signUpWithEmail({
        email,
        password,
        fullName,
        department,
        studentId,
        batchYear,
      });

      if (!res.error) {
        setSuccessMsg('Account created successfully! Check your email to verify your .edu account.');
      }
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signInWithGoogle();
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0e1422] border border-white/10 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-2">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">
            {mode === 'signin' ? `Sign In to ${APP_NAME}` : `Join ${APP_NAME}`}
          </h2>
          <p className="text-xs text-slate-400">
            Exclusive to {AU_CAMPUS_NAME} students & faculty
          </p>
        </div>

        {/* Domain Constraint Notice */}
        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            Authentication is restricted to verified university emails ending in{' '}
            <span className="font-mono text-blue-200">.edu.pk</span> or{' '}
            <span className="font-mono text-blue-200">.edu</span>.
          </p>
        </div>

        {/* Google OAuth Button */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-[0.98]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Air University Google Account</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="flex-1 border-t border-white/10" />
          <span>or use university credentials</span>
          <div className="flex-1 border-t border-white/10" />
        </div>

        {/* Error / Success Feedback */}
        {authError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px]">{authError}</p>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px]">{successMsg}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Full Student / Faculty Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Farhan Khattak"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:border-blue-500"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d.id} value={d.name} className="bg-[#0e1422]">
                        {d.code} - {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    AU Reg / Roll No
                  </label>
                  <input
                    type="text"
                    placeholder="220198-BSCY"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 uppercase"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Campus Email Address
            </label>
            <input
              type="email"
              placeholder="username@kamra.au.edu.pk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? 'Processing...' : mode === 'signin' ? 'Sign In to CampusConnect' : 'Register Student Account'}
          </button>
        </form>

        {/* Toggle between Sign In and Sign Up */}
        <div className="text-center pt-1">
          {mode === 'signin' ? (
            <p className="text-xs text-slate-400">
              New to Air University Kamra?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setAuthError(null);
                }}
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                Create an account
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-400">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setAuthError(null);
                }}
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
