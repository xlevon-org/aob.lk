import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  User,
  Settings,
  CreditCard,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Check,
  Copy,
  BookOpen,
  Bookmark,
  Bot,
  ExternalLink,
  Wallet
} from 'lucide-react';

export const ProfileDropdown: React.FC = () => {
  const { 
    user, 
    logout, 
    switchAccountType, 
    openAccountSettings, 
    openCashier 
  } = useAuth();
  const { navigate, courseProgress, bookmarks } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Esc
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!user) return null;

  // Calculate initials from user name
  const initials = user.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'TR';

  // Copy account ID to clipboard
  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(user.accountId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDemo = user.accountType === 'demo';
  const activeBalance = isDemo ? user.demoBalance : user.realBalance;

  // Count total completed courses
  const completedLessonsCount: number = Object.values(courseProgress).reduce<number>(
    (acc, c: any) => acc + (c?.completedLessonIds?.length || 0),
    0
  );

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Circle Profile Button + Balance Pill Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-2.5 pr-2 py-1 bg-white/95 hover:bg-gray-50 border border-gray-200/90 rounded-full shadow-sm hover:shadow transition-all duration-200 cursor-pointer select-none group"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Account Profile & Settings"
      >
        {/* Balance & Account Type Indicator */}
        <div className="hidden sm:flex flex-col text-right pr-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
            {isDemo ? 'Demo Account' : 'Real Account'}
          </span>
          <span className="text-[13px] font-extrabold text-gray-900 tracking-tight font-mono">
            {activeBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {user.currency}
          </span>
        </div>

        {/* Circular Shape Profile Icon */}
        <div className="relative flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF444F] to-[#FF6B74] text-white flex items-center justify-center text-xs font-bold tracking-wider shadow-sm ring-2 ring-white">
            {initials}
          </div>
          {/* Active Online Dot */}
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
        </div>

        {/* Small Chevron Toggle */}
        <ChevronDown 
          className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Real Deriv Profile Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-[330px] sm:w-[360px] bg-white rounded-2xl shadow-2xl border border-gray-100/90 overflow-hidden z-[5500] animate-fadeIn">
          {/* 1. Profile Header */}
          <div className="p-4 bg-gradient-to-b from-gray-50/80 to-white border-b border-gray-100">
            <div className="flex items-start gap-3">
              {/* Circular Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF444F] to-[#FF6B74] text-white flex items-center justify-center text-base font-bold tracking-wider shadow shrink-0">
                {initials}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-gray-900 truncate">
                    {user.fullName}
                  </h4>
                  {user.isVerified && (
                    <span title="Verified Deriv Trader">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>

                {/* Account ID Pill + Copy button */}
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-[11px] font-mono font-medium text-gray-700">
                    {user.accountId}
                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="text-gray-400 hover:text-gray-700 ml-0.5"
                      title="Copy Account ID"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </span>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isDemo 
                      ? 'bg-amber-100/80 text-amber-800' 
                      : 'bg-emerald-100/80 text-emerald-800'
                  }`}>
                    {isDemo ? 'Virtual Account' : 'Live Real Account'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Demo vs Real Account Switcher */}
            <div className="mt-4 p-1 bg-gray-100/80 rounded-xl grid grid-cols-2 gap-1 text-xs">
              <button
                type="button"
                onClick={() => switchAccountType('real')}
                className={`py-2 px-2.5 rounded-lg flex flex-col items-center justify-center transition-all ${
                  !isDemo
                    ? 'bg-white font-bold text-gray-900 shadow-sm border border-gray-200/50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Real Account</span>
                <span className="font-mono font-bold text-[13px] text-gray-900">
                  ${user.realBalance.toFixed(2)} USD
                </span>
              </button>

              <button
                type="button"
                onClick={() => switchAccountType('demo')}
                className={`py-2 px-2.5 rounded-lg flex flex-col items-center justify-center transition-all ${
                  isDemo
                    ? 'bg-white font-bold text-[#FF444F] shadow-sm border border-gray-200/50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Demo Account</span>
                <span className="font-mono font-bold text-[13px] text-[#FF444F]">
                  ${user.demoBalance.toFixed(2)} USD
                </span>
              </button>
            </div>
          </div>

          {/* 3. Action Links Grid */}
          <div className="p-2 space-y-0.5">
            {/* Cashier button */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                openCashier('deposit');
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-[#FF444F] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-900">Cashier & Funds</span>
                  <span className="text-[11px] text-gray-400">Deposit, withdraw, or transfer</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#FF444F] bg-red-50 px-2 py-0.5 rounded-full">
                Deposit
              </span>
            </button>

            {/* Account Settings */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                openAccountSettings();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-900">Account Settings</span>
                  <span className="text-[11px] text-gray-400">Personal details, password, phone</span>
                </div>
              </div>
            </button>

            {/* Deriv Bot Direct Link */}
            <a
              href="https://bot.deriv.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-900">Deriv Trading Bot</span>
                  <span className="text-[11px] text-gray-400">Automate your trading strategy</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </a>

            {/* My Courses & Progress */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate('/trading-courses');
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-900">My Learning Academy</span>
                  <span className="text-[11px] text-gray-400">
                    {completedLessonsCount > 0 ? `${completedLessonsCount} lessons finished` : 'Track courses & progress'}
                  </span>
                </div>
              </div>
            </button>

            {/* Saved Bookmarks */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate('/bookmarks');
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-900">Saved Library</span>
                  <span className="text-[11px] text-gray-400">{bookmarks.length} items saved</span>
                </div>
              </div>
            </button>
          </div>

          {/* 4. Footer & Logout */}
          <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-medium">
              Academy of Binary (AOB)
            </span>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-[#FF444F] hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
