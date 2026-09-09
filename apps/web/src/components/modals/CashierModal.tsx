import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  RefreshCw, 
  CreditCard, 
  Bitcoin, 
  Users, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export const CashierModal: React.FC = () => {
  const { user, cashierOpen, cashierInitialTab, closeCashier, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'transfer'>(cashierInitialTab || 'deposit');
  const [amount, setAmount] = useState('100');
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  if (!cashierOpen || !user) return null;

  const isDemo = user.accountType === 'demo';

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;

    if (isDemo) {
      updateProfile({ demoBalance: user.demoBalance + val });
      setActionSuccess(`Successfully added $${val.toFixed(2)} USD virtual funds to your Demo account.`);
    } else {
      updateProfile({ realBalance: user.realBalance + val });
      setActionSuccess(`Deposit of $${val.toFixed(2)} USD processed successfully via ${selectedMethod.toUpperCase()}.`);
    }
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;

    if (isDemo) {
      if (user.demoBalance < val) {
        alert('Insufficient virtual balance.');
        return;
      }
      updateProfile({ demoBalance: user.demoBalance - val });
      setActionSuccess(`Simulated withdrawal of $${val.toFixed(2)} USD completed.`);
    } else {
      if (user.realBalance < val) {
        alert('Insufficient real account balance.');
        return;
      }
      updateProfile({ realBalance: user.realBalance - val });
      setActionSuccess(`Withdrawal request of $${val.toFixed(2)} USD submitted to compliance.`);
    }
    setTimeout(() => setActionSuccess(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-[#0e1014]/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-[560px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-[#FF444F] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Deriv Cashier</h3>
              <p className="text-xs text-gray-500">
                Active: <span className="font-semibold text-gray-800">{isDemo ? 'Virtual Demo Account' : 'Live Real Account'}</span> ({user.accountId})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCashier}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => { setActiveTab('deposit'); setActionSuccess(null); }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'deposit'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
              <span>Deposit</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('withdraw'); setActionSuccess(null); }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'withdraw'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-red-500" />
              <span>Withdraw</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('transfer'); setActionSuccess(null); }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'transfer'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
              <span>Transfer</span>
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-6">
          {actionSuccess && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-medium animate-fadeIn">
              <Check className="w-4 h-4 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Current Balance Banner */}
          <div className="mb-5 p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-gray-400 block">
                Available {isDemo ? 'Virtual' : 'Real'} Balance
              </span>
              <span className="text-xl font-bold font-mono text-gray-900">
                ${(isDemo ? user.demoBalance : user.realBalance).toFixed(2)} USD
              </span>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              isDemo ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {isDemo ? 'Virtual Funds' : 'Real Cash'}
            </span>
          </div>

          {/* DEPOSIT FORM */}
          {activeTab === 'deposit' && (
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                      selectedMethod === 'card'
                        ? 'border-[#FF444F] bg-red-50/30 text-gray-900 font-bold ring-1 ring-[#FF444F]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#FF444F]" />
                    <span>Card / Visa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('crypto')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                      selectedMethod === 'crypto'
                        ? 'border-[#FF444F] bg-red-50/30 text-gray-900 font-bold ring-1 ring-[#FF444F]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <Bitcoin className="w-4 h-4 text-amber-500" />
                    <span>Crypto / USDT</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('p2p')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                      selectedMethod === 'p2p'
                        ? 'border-[#FF444F] bg-red-50/30 text-gray-900 font-bold ring-1 ring-[#FF444F]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>Deriv P2P / Agent</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Deposit Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full h-11 pl-8 pr-4 text-sm font-mono font-bold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#FF444F] outline-none"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {['50', '100', '250', '500', '1000'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                    >
                      ${preset}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 mt-2 bg-[#FF444F] hover:bg-[#EB3E48] text-white font-semibold rounded-xl text-sm transition-all shadow-sm cursor-pointer"
              >
                Deposit ${amount} USD
              </button>
            </form>
          )}

          {/* WITHDRAW FORM */}
          {activeTab === 'withdraw' && (
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Withdrawal Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full h-11 pl-8 pr-4 text-sm font-mono font-bold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#FF444F] outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Withdrawals are processed through the same payment channel used for deposit within 24 hours.</span>
              </div>

              <button
                type="submit"
                className="w-full h-11 mt-2 bg-[#181C25] hover:bg-black text-white font-semibold rounded-xl text-sm transition-all shadow-sm cursor-pointer"
              >
                Request Withdrawal of ${amount} USD
              </button>
            </form>
          )}

          {/* TRANSFER FORM */}
          {activeTab === 'transfer' && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/60 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">From:</span>
                  <span className="font-bold text-gray-900">Virtual Demo Account ({user.demoAccountId})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">To:</span>
                  <span className="font-bold text-gray-900">Deriv Bot / MT5 Synthetic Account</span>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                Transfers between Deriv Academy and linked trading bots are free and instantaneous.
              </p>

              <button
                type="button"
                onClick={() => {
                  setActionSuccess('Simulated funds transfer to Deriv Bot completed successfully.');
                  setTimeout(() => setActionSuccess(null), 3500);
                }}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all cursor-pointer shadow-sm"
              >
                Transfer $100 to Trading Bot
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
