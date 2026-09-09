import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  Eye, 
  EyeOff, 
  Check, 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  AlertCircle,
  KeyRound,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    authModalView,
    closeAuthModal,
    setAuthModalView,
    login,
    signup,
    requestPasswordReset,
    verifyOtp,
    resetPassword,
    resendOtp,
    otpCooldown,
    otpError,
    authError,
    isLoading,
    resetEmail,
    generatedOtp,
    quickLoginDemo
  } = useAuth();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Reset Password fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatchError, setPasswordsMatchError] = useState<string | null>(null);

  // 6-digit OTP input state
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset internal state when view or modal changes
  useEffect(() => {
    if (authModalOpen) {
      if (authModalView === 'login') {
        setEmail('');
        setPassword('');
      } else if (authModalView === 'signup') {
        setEmail('');
        setPassword('');
        setFullName('');
      } else if (authModalView === 'otp-verification') {
        setOtpDigits(['', '', '', '', '', '']);
        setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
      } else if (authModalView === 'reset-password') {
        setNewPassword('');
        setConfirmPassword('');
        setPasswordsMatchError(null);
      }
    }
  }, [authModalOpen, authModalView]);

  if (!authModalOpen) return null;

  // Password requirements calculation
  const hasMinLength = (pass: string) => pass.length >= 8;
  const hasUpperLower = (pass: string) => /[a-z]/.test(pass) && /[A-Z]/.test(pass);
  const hasNumberOrSymbol = (pass: string) => /[0-9!@#$%^&*(),.?":{}|<>]/.test(pass);

  // OTP handlers
  const handleOtpChange = (index: number, val: string) => {
    // Only accept single numeric digit
    const cleaned = val.replace(/[^0-9]/g, '');
    const newDigits = [...otpDigits];

    if (cleaned.length > 1) {
      // User pasted full code
      const pasted = cleaned.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setOtpDigits(newDigits);
      const nextIndex = Math.min(pasted.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    newDigits[index] = cleaned;
    setOtpDigits(newDigits);

    // Auto advance to next input
    if (cleaned && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pasteData) return;
    const newDigits = [...otpDigits];
    pasteData.split('').forEach((char, i) => {
      if (i < 6) newDigits[i] = char;
    });
    setOtpDigits(newDigits);
    const focusTarget = Math.min(pasteData.length, 5);
    otpInputRefs.current[focusTarget]?.focus();
  };

  // Submit Login
  const onLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  // Submit Signup
  const onSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert('Please accept the Deriv Terms & Conditions to proceed.');
      return;
    }
    await signup(fullName, email, password);
  };

  // Submit Forgot Password Email Request
  const onForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await requestPasswordReset(email);
  };

  // Submit OTP Verification
  const onOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpDigits.join('');
    verifyOtp(fullCode);
  };

  // Submit Password Reset
  const onResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordsMatchError('Passwords do not match. Please ensure both fields are identical.');
      return;
    }
    setPasswordsMatchError(null);
    await resetPassword(newPassword);
  };

  // Quick Demo fill
  const handleFillDemo = () => {
    setEmail('demo@deriv.com');
    setPassword('DerivPass123!');
  };

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-[#0e1014]/75 backdrop-blur-sm animate-fadeIn">
      {/* Modal Dialog Card */}
      <div 
        className="relative w-full max-w-[480px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Navigation / Brand Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-gray-50">
          <div className="flex items-center gap-2">
            {authModalView !== 'login' && authModalView !== 'reset-success' && (
              <button
                type="button"
                onClick={() => setAuthModalView(authModalView === 'otp-verification' ? 'forgot-password' : 'login')}
                className="p-1 -ml-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                title="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            {/* Deriv Brand Dot + Title */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF444F]" />
              <span className="text-[13px] font-bold tracking-wider uppercase text-gray-400">
                Deriv Account Portal
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={closeAuthModal}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8">
          {/* ======================================================== */}
          {/* VIEW 1: LOGIN */}
          {/* ======================================================== */}
          {authModalView === 'login' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-left">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Log in to access your trading courses, bots, and demo portfolio.
                </p>
              </div>

              {/* Social OAuth Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={quickLoginDemo}
                  className="flex items-center justify-center h-11 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  title="Google Login"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={quickLoginDemo}
                  className="flex items-center justify-center h-11 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  title="Facebook Login"
                >
                  <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={quickLoginDemo}
                  className="flex items-center justify-center h-11 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  title="Apple Login"
                >
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.84.94-2.91-.91.04-2.02.61-2.67 1.38-.58.67-1.1 1.76-.96 2.81 1.02.08 2.06-.51 2.69-1.28z"/>
                  </svg>
                </button>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-gray-200 w-full" />
                <span className="bg-white px-3 text-xs uppercase tracking-wider text-gray-400 font-medium">
                  Or continue with email
                </span>
              </div>

              {/* Error Banner */}
              {authError && (
                <div className="flex items-center gap-2.5 p-3.5 text-sm text-[#FF444F] bg-[#FFF5F5] border border-[#FFE0E2] rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={onLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="trader@deriv.com"
                      className="w-full h-11 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#FF444F] focus:ring-2 focus:ring-[#FF444F]/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthModalView('forgot-password')}
                      className="text-xs font-medium text-[#FF444F] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-11 pl-10 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#FF444F] focus:ring-2 focus:ring-[#FF444F]/10 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Primary Coral CTA */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 mt-2 bg-[#FF444F] hover:bg-[#EB3E48] text-white font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Log in'
                  )}
                </button>
              </form>

              {/* Quick test demo account filler helper */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="w-full py-2 px-3 bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-300 rounded-xl text-xs text-gray-600 flex items-center justify-center gap-2 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FF444F]" />
                  <span>Click to auto-fill verified Demo Credentials</span>
                </button>
              </div>

              {/* Switch to Signup */}
              <div className="pt-3 border-t border-gray-100 text-center text-sm text-gray-600">
                Don't have a Deriv account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalView('signup')}
                  className="font-semibold text-[#FF444F] hover:underline"
                >
                  Create account
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 2: SIGNUP */}
          {/* ======================================================== */}
          {authModalView === 'signup' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-left">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Join Academy of Binary</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Open a free $10,000 USD virtual demo account to practice trading and study courses.
                </p>
              </div>

              {authError && (
                <div className="flex items-center gap-2.5 p-3.5 text-sm text-[#FF444F] bg-[#FFF5F5] border border-[#FFE0E2] rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={onSignupSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ruwan Silva"
                      className="w-full h-11 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#FF444F] focus:ring-2 focus:ring-[#FF444F]/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full h-11 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#FF444F] focus:ring-2 focus:ring-[#FF444F]/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full h-11 pl-10 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#FF444F] focus:ring-2 focus:ring-[#FF444F]/10 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Checklist Requirement */}
                  {password.length > 0 && (
                    <div className="mt-2.5 p-3 bg-gray-50 rounded-xl space-y-1.5 text-xs">
                      <div className={`flex items-center gap-1.5 ${hasMinLength(password) ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                        <Check className="w-3.5 h-3.5" />
                        <span>Minimum 8 characters</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${hasUpperLower(password) ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                        <Check className="w-3.5 h-3.5" />
                        <span>Uppercase and lowercase letters</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${hasNumberOrSymbol(password) ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                        <Check className="w-3.5 h-3.5" />
                        <span>At least one number or special character</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-[#FF444F] focus:ring-[#FF444F]"
                  />
                  <label htmlFor="terms" className="text-xs text-gray-600 leading-relaxed cursor-pointer">
                    I agree to the <span className="text-[#FF444F] font-medium">Terms & Conditions</span> and verify that I am over 18 years of age.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 mt-3 bg-[#FF444F] hover:bg-[#EB3E48] text-white font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Create free demo account'
                  )}
                </button>
              </form>

              <div className="pt-3 border-t border-gray-100 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalView('login')}
                  className="font-semibold text-[#FF444F] hover:underline"
                >
                  Log in
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 3: FORGOT PASSWORD */}
          {/* ======================================================== */}
          {authModalView === 'forgot-password' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-left">
                <div className="w-12 h-12 bg-red-50 text-[#FF444F] rounded-2xl flex items-center justify-center mb-3">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Reset your password</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter your registered email address and we'll send you a 6-digit verification code to reset your password.
                </p>
              </div>

              {authError && (
                <div className="flex items-center gap-2.5 p-3.5 text-sm text-[#FF444F] bg-[#FFF5F5] border border-[#FFE0E2] rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={onForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="trader@deriv.com"
                      className="w-full h-11 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#FF444F] focus:ring-2 focus:ring-[#FF444F]/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-[#FF444F] hover:bg-[#EB3E48] text-white font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Send verification code'
                  )}
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthModalView('login')}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Return to Log in
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 4: OTP VERIFICATION */}
          {/* ======================================================== */}
          {authModalView === 'otp-verification' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-left">
                <div className="w-12 h-12 bg-red-50 text-[#FF444F] rounded-2xl flex items-center justify-center mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Two-Step Verification</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Please enter the 6-digit verification code sent to <strong className="text-gray-900">{resetEmail || 'your email'}</strong>.
                </p>
              </div>

              {/* Test Code Badge */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
                <span>Verification Code: <strong className="font-mono text-sm tracking-widest text-[#FF444F]">{generatedOtp}</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    const digits = generatedOtp.split('');
                    setOtpDigits(digits);
                  }}
                  className="underline font-semibold hover:text-amber-950"
                >
                  Auto-fill
                </button>
              </div>

              {otpError && (
                <div className="flex items-center gap-2.5 p-3.5 text-sm text-[#FF444F] bg-[#FFF5F5] border border-[#FFE0E2] rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              {/* 6-box input */}
              <form onSubmit={onOtpSubmit} className="space-y-5">
                <div className="flex justify-between gap-2 on-otp-container" onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        otpInputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 text-center text-xl font-bold font-mono bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#FF444F] focus:ring-2 focus:ring-[#FF444F]/15 outline-none transition-all"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={otpDigits.some((d) => !d)}
                  className="w-full h-11 bg-[#FF444F] hover:bg-[#EB3E48] text-white font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-40 cursor-pointer"
                >
                  Verify & Continue
                </button>
              </form>

              {/* Resend OTP */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                <span>Didn't receive code?</span>
                {otpCooldown > 0 ? (
                  <span className="font-medium text-gray-400">Resend in {otpCooldown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={resendOtp}
                    className="font-semibold text-[#FF444F] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Resend code
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 5: RESET PASSWORD */}
          {/* ======================================================== */}
          {authModalView === 'reset-password' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-left">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Create new password</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Choose a new, strong password to secure your Deriv trading account.
                </p>
              </div>

              {(authError || passwordsMatchError) && (
                <div className="flex items-center gap-2.5 p-3.5 text-sm text-[#FF444F] bg-[#FFF5F5] border border-[#FFE0E2] rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError || passwordsMatchError}</span>
                </div>
              )}

              <form onSubmit={onResetPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full h-11 pl-10 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#FF444F] focus:ring-2 focus:ring-[#FF444F]/10 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {newPassword.length > 0 && (
                    <div className="mt-2.5 p-3 bg-gray-50 rounded-xl space-y-1.5 text-xs">
                      <div className={`flex items-center gap-1.5 ${hasMinLength(newPassword) ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                        <Check className="w-3.5 h-3.5" />
                        <span>Minimum 8 characters</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${hasUpperLower(newPassword) ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                        <Check className="w-3.5 h-3.5" />
                        <span>Uppercase and lowercase letters</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${hasNumberOrSymbol(newPassword) ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                        <Check className="w-3.5 h-3.5" />
                        <span>At least one number or special character</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your new password"
                      className="w-full h-11 pl-10 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#FF444F] focus:ring-2 focus:ring-[#FF444F]/10 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !hasMinLength(newPassword)}
                  className="w-full h-11 bg-[#FF444F] hover:bg-[#EB3E48] text-white font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Reset password'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 6: RESET SUCCESS */}
          {/* ======================================================== */}
          {authModalView === 'reset-success' && (
            <div className="py-4 text-center space-y-5 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Password Reset Complete!</h2>
                <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                  Your password has been successfully updated. You can now log into your Deriv Academy account.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAuthModalView('login')}
                className="w-full h-11 bg-[#FF444F] hover:bg-[#EB3E48] text-white font-semibold rounded-xl text-sm transition-all shadow-sm cursor-pointer"
              >
                Log in to your account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
