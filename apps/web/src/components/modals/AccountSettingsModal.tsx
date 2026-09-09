import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  User, 
  Lock, 
  ShieldCheck, 
  Sliders, 
  Phone, 
  MapPin, 
  Mail, 
  Check, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

export const AccountSettingsModal: React.FC = () => {
  const { user, accountSettingsOpen, closeAccountSettings, updateProfile, resetPassword } = useAuth();
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'limits'>('personal');

  // Form states for personal details
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '077 785 9947');
  const [address, setAddress] = useState(user?.address || 'Senanayake mw, Bandarawela 90100');
  const [country, setCountry] = useState(user?.country || 'Sri Lanka');
  const [personalSaveStatus, setPersonalSaveStatus] = useState<string | null>(null);

  // Form states for password change
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passChangeStatus, setPassChangeStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!accountSettingsOpen || !user) return null;

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      phone,
      address,
      country,
    });
    setPersonalSaveStatus('Profile information updated successfully!');
    setTimeout(() => setPersonalSaveStatus(null), 3000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass) {
      setPassChangeStatus({ type: 'error', message: 'Please enter your current password.' });
      return;
    }
    if (newPass.length < 8) {
      setPassChangeStatus({ type: 'error', message: 'New password must be at least 8 characters long.' });
      return;
    }
    if (newPass !== confirmNewPass) {
      setPassChangeStatus({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    const res = await resetPassword(newPass);
    if (res.success) {
      setPassChangeStatus({ type: 'success', message: 'Password has been updated successfully.' });
      setCurrentPass('');
      setNewPass('');
      setConfirmNewPass('');
      setTimeout(() => setPassChangeStatus(null), 4000);
    } else {
      setPassChangeStatus({ type: 'error', message: res.error || 'Failed to update password.' });
    }
  };

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-[#0e1014]/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-[700px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side Navigation (Deriv Enterprise Settings style) */}
        <div className="w-full md:w-[220px] bg-gray-50 border-r border-gray-100 p-5 flex flex-col justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF444F]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Account Settings</h3>
            </div>

            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveTab('personal')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'personal'
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200/60'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                }`}
              >
                <User className="w-4 h-4 text-[#FF444F]" />
                <span>Personal details</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200/60'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                }`}
              >
                <Lock className="w-4 h-4 text-[#FF444F]" />
                <span>Security & Password</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('limits')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'limits'
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200/60'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                }`}
              >
                <Sliders className="w-4 h-4 text-[#FF444F]" />
                <span>Trading limits</span>
              </button>
            </nav>
          </div>

          <div className="pt-4 border-t border-gray-200/70 text-[11px] text-gray-400">
            Account: <strong className="font-mono text-gray-700">{user.accountId}</strong>
          </div>
        </div>

        {/* Right Side Content Panel */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {/* Header Close Button */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {activeTab === 'personal' && 'Personal details'}
                {activeTab === 'security' && 'Security & Password'}
                {activeTab === 'limits' && 'Account & Trading limits'}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage your verified credentials and trading profile.
              </p>
            </div>
            <button
              type="button"
              onClick={closeAccountSettings}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* TAB 1: PERSONAL DETAILS */}
          {activeTab === 'personal' && (
            <form onSubmit={handleSavePersonal} className="space-y-4 animate-fadeIn">
              {personalSaveStatus && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-medium">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{personalSaveStatus}</span>
                </div>
              )}

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
                    className="w-full h-10 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#FF444F] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full h-10 pl-10 pr-4 text-sm bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                  />
                </div>
                <span className="text-[11px] text-gray-400 mt-1 block">To change email, contact Deriv compliance.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="077 785 9947"
                    className="w-full h-10 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#FF444F] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Physical Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Senanayake mw, Bandarawela 90100"
                    className="w-full h-10 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#FF444F] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Country of Residence
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Sri Lanka"
                  className="w-full h-10 px-3.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#FF444F] outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="h-10 px-6 bg-[#FF444F] hover:bg-[#EB3E48] text-white font-semibold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                >
                  Save changes
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="space-y-4 animate-fadeIn">
              {passChangeStatus && (
                <div className={`flex items-center gap-2 p-3 rounded-xl text-xs font-medium border ${
                  passChangeStatus.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {passChangeStatus.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{passChangeStatus.message}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 px-3.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#FF444F] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full h-10 pl-3.5 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#FF444F] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmNewPass}
                  onChange={(e) => setConfirmNewPass(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full h-10 px-3.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#FF444F] outline-none"
                />
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/60 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Two-Factor Authentication (2FA)</h4>
                  <p className="text-[11px] text-gray-500">Add an extra layer of protection via 6-digit OTP codes.</p>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Enabled
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="h-10 px-6 bg-[#FF444F] hover:bg-[#EB3E48] text-white font-semibold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                >
                  Update password
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: TRADING LIMITS */}
          {activeTab === 'limits' && (
            <div className="space-y-4 animate-fadeIn text-sm">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/70 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Maximum Virtual Demo Balance</span>
                  <span className="font-mono font-bold text-gray-900">$10,000.00 USD</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Max Open Positions (Demo)</span>
                  <span className="font-mono font-bold text-gray-900">50 Trades</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Daily Payout Threshold</span>
                  <span className="font-mono font-bold text-emerald-600">$50,000.00 USD</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Identity Verification Status</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-400">
                Limits are calibrated according to Deriv Enterprise regulations and Academy of Binary tier standards.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
