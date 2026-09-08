import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Cpu,
  Smartphone
} from 'lucide-react';

export const DemoAccountModal: React.FC = () => {
  const { demoModalOpen, setDemoModalOpen, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<'trader' | 'mt5' | 'bot'>('trader');
  const [step, setStep] = useState<'form' | 'success'>('form');

  if (!demoModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'warning');
      return;
    }
    setStep('success');
    showToast('Demo trading sandbox provisioned with $10,000 USD virtual funds!', 'success');
  };

  const handleReset = () => {
    setStep('form');
    setEmail('');
    setDemoModalOpen(false);
  };

  return (
    <div id="deriv-demo-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={handleReset}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#e6e9ea] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button 
          onClick={handleReset}
          className="absolute top-4 right-4 p-2 text-[#6e6e6e] hover:text-[#111111] hover:bg-[#f2f3f5] rounded-full transition-colors z-20"
        >
          <X size={20} />
        </button>

        {step === 'form' ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fff1f2] text-[#ff444f] rounded-full text-[12px] font-semibold">
                <Sparkles size={14} />
                <span>100% Risk-Free Virtual Trading</span>
              </div>
              <h3 className="text-2xl font-bold text-[#111111] font-heading tracking-tight">
                Create your free Deriv demo account
              </h3>
              <p className="text-[14px] text-[#6e6e6e] leading-relaxed">
                Join over 2.5 million traders worldwide. Practice synthetic indices, forex, and commodities with $10,000 virtual balance.
              </p>
            </div>

            {/* Platform Selection Chips */}
            <div className="space-y-2">
              <label className="text-[12px] font-semibold text-[#6e6e6e] uppercase tracking-wider block">
                Select Your Preferred Platform
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPlatform('trader')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedPlatform === 'trader'
                      ? 'border-[#ff444f] bg-[#fff1f2] text-[#ff444f] font-semibold'
                      : 'border-[#e6e9ea] bg-[#f8f9fa] text-[#555555] hover:bg-[#f2f3f5]'
                  }`}
                >
                  <TrendingUp size={18} className="mx-auto mb-1 text-inherit" />
                  <div className="text-[12.5px]">Deriv Trader</div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPlatform('mt5')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedPlatform === 'mt5'
                      ? 'border-[#ff444f] bg-[#fff1f2] text-[#ff444f] font-semibold'
                      : 'border-[#e6e9ea] bg-[#f8f9fa] text-[#555555] hover:bg-[#f2f3f5]'
                  }`}
                >
                  <Smartphone size={18} className="mx-auto mb-1 text-inherit" />
                  <div className="text-[12.5px]">Deriv MT5</div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPlatform('bot')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedPlatform === 'bot'
                      ? 'border-[#ff444f] bg-[#fff1f2] text-[#ff444f] font-semibold'
                      : 'border-[#e6e9ea] bg-[#f8f9fa] text-[#555555] hover:bg-[#f2f3f5]'
                  }`}
                >
                  <Cpu size={18} className="mx-auto mb-1 text-inherit" />
                  <div className="text-[12.5px]">Deriv Bot</div>
                </button>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-[#333333] block">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-[#d6dadb] focus:border-[#ff444f] focus:ring-2 focus:ring-[#ff444f]/20 outline-none text-[15px] transition-all"
                />
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <input
                  id="terms-checkbox"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-[#ff444f] rounded border-[#d6dadb] focus:ring-[#ff444f]"
                />
                <label htmlFor="terms-checkbox" className="text-[12px] text-[#6e6e6e] leading-snug cursor-pointer">
                  I agree to the Terms & Conditions and understand that trading carries risk. No credit card or real deposit required.
                </label>
              </div>

              <button
                type="submit"
                disabled={!agreed}
                className="w-full py-3.5 bg-[#ff444f] hover:bg-[#eb3e48] active:bg-[#d4353e] disabled:opacity-50 text-white font-semibold text-[15px] rounded-lg transition-all shadow-md cursor-pointer"
              >
                Create $10,000 Demo Account
              </button>
            </form>

            <div className="pt-2 flex items-center justify-center gap-4 text-[12px] text-[#6e6e6e]">
              <span className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-[#008832]" />
                <span>Zero real financial risk</span>
              </span>
              <span>•</span>
              <span>Instant virtual activation</span>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-[#e8f7ee] text-[#008832] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#111111] font-heading">
                Demo Account Activated!
              </h3>
              <p className="text-[14.5px] text-[#555555] max-w-sm mx-auto">
                We've provisioned your virtual trading environment for <strong className="text-[#111111]">{email}</strong> with <strong className="text-[#008832]">$10,000.00 USD</strong> in practice funds.
              </p>
            </div>

            <div className="bg-[#f8f9fa] border border-[#e6e9ea] rounded-xl p-4 text-left space-y-2 text-[13px]">
              <div className="flex justify-between text-[#6e6e6e]">
                <span>Platform:</span>
                <span className="font-semibold text-[#111111] capitalize">Deriv {selectedPlatform}</span>
              </div>
              <div className="flex justify-between text-[#6e6e6e]">
                <span>Virtual Funds:</span>
                <span className="font-semibold text-[#008832]">$10,000.00 USD</span>
              </div>
              <div className="flex justify-between text-[#6e6e6e]">
                <span>Server Type:</span>
                <span className="font-semibold text-[#111111]">Deriv-Demo Simulated</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3.5 bg-[#111111] hover:bg-[#222222] text-white font-semibold text-[15px] rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Back to Deriv Academy</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
