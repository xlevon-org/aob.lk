import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} className="text-[#008832]" />,
    info: <Info size={18} className="text-[#2196f3]" />,
    warning: <AlertTriangle size={18} className="text-[#f59e0b]" />,
  };

  const borderColors = {
    success: 'border-[#008832]/30 bg-white text-[#111111]',
    info: 'border-[#2196f3]/30 bg-white text-[#111111]',
    warning: 'border-[#f59e0b]/30 bg-white text-[#111111]',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border ${borderColors[toast.type]} min-w-[280px] max-w-md`}>
        {icons[toast.type]}
        <span className="text-[14px] font-medium leading-snug">{toast.message}</span>
      </div>
    </div>
  );
};
