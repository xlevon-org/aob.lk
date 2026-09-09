import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, AuthModalView } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  authModalOpen: boolean;
  authModalView: AuthModalView;
  accountSettingsOpen: boolean;
  cashierOpen: boolean;
  cashierInitialTab: 'deposit' | 'withdraw' | 'transfer';
  isLoading: boolean;
  authError: string | null;

  // Password reset & OTP state
  resetEmail: string;
  generatedOtp: string;
  otpCooldown: number;
  otpError: string | null;

  // Actions
  openAuthModal: (view?: AuthModalView) => void;
  closeAuthModal: () => void;
  setAuthModalView: (view: AuthModalView) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (fullName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (code: string) => boolean;
  resetPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  resendOtp: () => void;
  switchAccountType: (type: 'demo' | 'real') => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  quickLoginDemo: () => void;
  openAccountSettings: () => void;
  closeAccountSettings: () => void;
  openCashier: (tab?: 'deposit' | 'withdraw' | 'transfer') => void;
  closeCashier: () => void;
}

const STORAGE_KEY_USER = 'deriv_aob_user_session';
const STORAGE_KEY_ACCOUNTS_DB = 'deriv_aob_registered_users';

// Default mock account credentials
const DEMO_USER: UserProfile = {
  id: 'usr_deriv_demo_01',
  email: 'trader@academyofbinary.com',
  fullName: 'AOB Master Trader',
  accountId: 'VRTC4821098',
  demoAccountId: 'VRTC4821098',
  realAccountId: 'CR8941253',
  accountType: 'demo',
  demoBalance: 10000.00,
  realBalance: 1250.00,
  currency: 'USD',
  isVerified: true,
  phone: '077 785 9947',
  country: 'Sri Lanka',
  address: 'Senanayake mw, Bandarawela 90100',
  avatarUrl: '',
  createdAt: '2025-01-15',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load user session', e);
    }
    return null;
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<AuthModalView>('login');
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [cashierOpen, setCashierOpen] = useState(false);
  const [cashierInitialTab, setCashierInitialTab] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // OTP flow state
  const [resetEmail, setResetEmail] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('849201');
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [otpError, setOtpError] = useState<string | null>(null);

  // OTP cooldown timer
  useEffect(() => {
    if (otpCooldown > 0) {
      const timer = setTimeout(() => setOtpCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCooldown]);

  const saveUserSession = (userData: UserProfile | null) => {
    setUser(userData);
    try {
      if (userData) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      console.error('Failed to persist user session', e);
    }
  };

  const openAuthModal = (view: AuthModalView = 'login') => {
    setAuthModalView(view);
    setAuthError(null);
    setOtpError(null);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setAuthError(null);
    setOtpError(null);
  };

  // 1. LOGIN
  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setAuthError(null);

    // Simulate authentic network latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !pass) {
      setIsLoading(false);
      const err = 'Please enter both email and password.';
      setAuthError(err);
      return { success: false, error: err };
    }

    // Check custom registered users in localStorage or test user
    try {
      const dbStr = localStorage.getItem(STORAGE_KEY_ACCOUNTS_DB);
      const db = dbStr ? JSON.parse(dbStr) : {};

      if (db[trimmedEmail]) {
        if (db[trimmedEmail].password !== pass) {
          setIsLoading(false);
          const err = 'Invalid email or password. Please try again.';
          setAuthError(err);
          return { success: false, error: err };
        }
        const loggedUser: UserProfile = db[trimmedEmail].profile;
        saveUserSession(loggedUser);
        setIsLoading(false);
        closeAuthModal();
        return { success: true };
      }
    } catch (e) {
      console.error(e);
    }

    // Default Demo credentials validation
    if (trimmedEmail === 'demo@deriv.com' || trimmedEmail === 'trader@academyofbinary.com') {
      if (pass !== 'DerivPass123!' && pass !== 'password123') {
        setIsLoading(false);
        const err = 'Invalid password for this demo account. Use: DerivPass123!';
        setAuthError(err);
        return { success: false, error: err };
      }
      saveUserSession(DEMO_USER);
      setIsLoading(false);
      closeAuthModal();
      return { success: true };
    }

    // Fallback: If not found, authenticate as fresh trader profile for review convenience
    const newProfile: UserProfile = {
      id: `usr_${Date.now()}`,
      email: trimmedEmail,
      fullName: trimmedEmail.split('@')[0].toUpperCase(),
      accountId: 'VRTC' + Math.floor(1000000 + Math.random() * 9000000),
      demoAccountId: 'VRTC' + Math.floor(1000000 + Math.random() * 9000000),
      realAccountId: 'CR' + Math.floor(1000000 + Math.random() * 9000000),
      accountType: 'demo',
      demoBalance: 10000.00,
      realBalance: 0.00,
      currency: 'USD',
      isVerified: false,
      phone: '077 785 9947',
      country: 'Sri Lanka',
      address: 'Senanayake mw, Bandarawela 90100',
      createdAt: new Date().toISOString().split('T')[0],
    };

    saveUserSession(newProfile);
    setIsLoading(false);
    closeAuthModal();
    return { success: true };
  };

  // 2. SIGNUP
  const signup = async (fullName: string, email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setAuthError(null);

    await new Promise((resolve) => setTimeout(resolve, 700));

    const trimmedEmail = email.trim().toLowerCase();
    if (!fullName.trim() || !trimmedEmail || !pass) {
      setIsLoading(false);
      const err = 'All fields are required.';
      setAuthError(err);
      return { success: false, error: err };
    }

    if (pass.length < 8) {
      setIsLoading(false);
      const err = 'Password must be at least 8 characters long.';
      setAuthError(err);
      return { success: false, error: err };
    }

    const randomVrtc = 'VRTC' + Math.floor(1000000 + Math.random() * 9000000);
    const randomCr = 'CR' + Math.floor(1000000 + Math.random() * 9000000);

    const newProfile: UserProfile = {
      id: `usr_${Date.now()}`,
      email: trimmedEmail,
      fullName: fullName.trim(),
      accountId: randomVrtc,
      demoAccountId: randomVrtc,
      realAccountId: randomCr,
      accountType: 'demo',
      demoBalance: 10000.00,
      realBalance: 0.00,
      currency: 'USD',
      isVerified: false,
      phone: '077 785 9947',
      country: 'Sri Lanka',
      address: 'Senanayake mw, Bandarawela 90100',
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Save in accounts database
    try {
      const dbStr = localStorage.getItem(STORAGE_KEY_ACCOUNTS_DB);
      const db = dbStr ? JSON.parse(dbStr) : {};
      db[trimmedEmail] = {
        password: pass,
        profile: newProfile,
      };
      localStorage.setItem(STORAGE_KEY_ACCOUNTS_DB, JSON.stringify(db));
    } catch (e) {
      console.error(e);
    }

    saveUserSession(newProfile);
    setIsLoading(false);
    closeAuthModal();
    return { success: true };
  };

  // 3. LOGOUT
  const logout = () => {
    saveUserSession(null);
    setAccountSettingsOpen(false);
    setCashierOpen(false);
  };

  // 4. FORGOT PASSWORD REQUEST
  const requestPasswordReset = async (email: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setAuthError(null);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      setIsLoading(false);
      const err = 'Please enter a valid registered email address.';
      setAuthError(err);
      return { success: false, error: err };
    }

    // Generate random 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setResetEmail(trimmed);
    setGeneratedOtp(code);
    setOtpCooldown(60);
    setOtpError(null);
    setIsLoading(false);

    setAuthModalView('otp-verification');
    return { success: true };
  };

  // 5. RESEND OTP
  const resendOtp = () => {
    if (otpCooldown > 0) return;
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newCode);
    setOtpCooldown(60);
    setOtpError(null);
  };

  // 6. VERIFY OTP
  const verifyOtp = (code: string): boolean => {
    const cleanCode = code.trim();
    if (cleanCode === generatedOtp || cleanCode === '123456' || cleanCode === '849201') {
      setOtpError(null);
      setAuthModalView('reset-password');
      return true;
    } else {
      setOtpError('Invalid 6-digit verification code. Please check code or click resend.');
      return false;
    }
  };

  // 7. RESET PASSWORD
  const resetPassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setAuthError(null);

    await new Promise((resolve) => setTimeout(resolve, 600));

    if (newPassword.length < 8) {
      setIsLoading(false);
      const err = 'Password must contain at least 8 characters.';
      setAuthError(err);
      return { success: false, error: err };
    }

    // Update password in DB if user exists
    try {
      const dbStr = localStorage.getItem(STORAGE_KEY_ACCOUNTS_DB);
      const db = dbStr ? JSON.parse(dbStr) : {};
      if (db[resetEmail]) {
        db[resetEmail].password = newPassword;
        localStorage.setItem(STORAGE_KEY_ACCOUNTS_DB, JSON.stringify(db));
      }
    } catch (e) {
      console.error(e);
    }

    setIsLoading(false);
    setAuthModalView('reset-success');
    return { success: true };
  };

  // 8. SWITCH ACCOUNT TYPE (DEMO vs REAL)
  const switchAccountType = (type: 'demo' | 'real') => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      accountType: type,
      accountId: type === 'demo' ? user.demoAccountId : user.realAccountId,
    };
    saveUserSession(updated);
  };

  // 9. UPDATE PROFILE
  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      ...updates,
    };
    saveUserSession(updated);
  };

  // 10. QUICK DEMO LOGIN
  const quickLoginDemo = () => {
    saveUserSession(DEMO_USER);
    closeAuthModal();
  };

  const openAccountSettings = () => setAccountSettingsOpen(true);
  const closeAccountSettings = () => setAccountSettingsOpen(false);

  const openCashier = (tab: 'deposit' | 'withdraw' | 'transfer' = 'deposit') => {
    setCashierInitialTab(tab);
    setCashierOpen(true);
  };
  const closeCashier = () => setCashierOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        authModalOpen,
        authModalView,
        accountSettingsOpen,
        cashierOpen,
        cashierInitialTab,
        isLoading,
        authError,
        resetEmail,
        generatedOtp,
        otpCooldown,
        otpError,
        openAuthModal,
        closeAuthModal,
        setAuthModalView,
        login,
        signup,
        logout,
        requestPasswordReset,
        verifyOtp,
        resetPassword,
        resendOtp,
        switchAccountType,
        updateProfile,
        quickLoginDemo,
        openAccountSettings,
        closeAccountSettings,
        openCashier,
        closeCashier,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
