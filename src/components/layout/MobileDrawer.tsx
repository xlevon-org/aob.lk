import React from 'react';
import { useApp } from '../../context/AppContext';
import { DerivAcademyLogo } from '../common/DerivAcademyLogo';
import { 
  X, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  ExternalLink, 
  Globe, 
  ArrowRight,
  ShieldCheck 
} from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { currentRoute, navigate, setIsDemoModalOpen } = useApp();

  if (!isOpen) return null;

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  const navItems = [
    { label: 'Courses', path: '/trading-courses', icon: GraduationCap },
    { label: 'Guides', path: '/trading-guides', icon: BookOpen },
    { label: 'Ebooks', path: '/trading-ebooks', icon: FileText },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Drawer */}
      <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="p-4 border-b border-[#e6e9ea] flex items-center justify-between">
            <div onClick={() => handleNav('/')} className="cursor-pointer">
              <DerivAcademyLogo className="h-5 w-auto text-[#111111]" />
            </div>
            <button
              onClick={onClose}
              className="p-1 text-[#6e6e6e] hover:text-[#111111] hover:bg-[#f2f3f5] rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#fff1f2] text-[#ff444f] font-bold'
                      : 'text-[#333333] hover:bg-[#f8f9fa]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-[#ff444f]' : 'text-[#6e6e6e]'} />
                    <span>{item.label}</span>
                  </div>
                  <ArrowRight size={16} className="text-[#cccccc]" />
                </button>
              );
            })}

            {/* External Blog */}
            <a
              href="https://deriv.com/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-medium text-[#333333] hover:bg-[#f8f9fa] transition-colors"
            >
              <div className="flex items-center gap-3">
                <ExternalLink size={18} className="text-[#6e6e6e]" />
                <span>Deriv Blog</span>
              </div>
              <ExternalLink size={14} className="text-[#999999]" />
            </a>
          </div>
        </div>

        {/* Bottom CTA Block */}
        <div className="p-5 border-t border-[#e6e9ea] space-y-3 bg-[#f8f9fa]">
          <button
            onClick={() => {
              setIsDemoModalOpen(true);
              onClose();
            }}
            className="w-full py-3 bg-[#ff444f] hover:bg-[#eb3e48] text-white font-bold rounded-xl text-[14px] shadow-sm transition-colors text-center cursor-pointer"
          >
            Open account
          </button>

          <button
            onClick={() => {
              setIsDemoModalOpen(true);
              onClose();
            }}
            className="w-full py-3 bg-white border border-[#d6dadb] text-[#111111] font-bold rounded-xl text-[14px] hover:bg-[#f2f3f5] transition-colors text-center cursor-pointer"
          >
            Login
          </button>

          <div className="flex items-center justify-center gap-2 pt-2 text-[12px] text-[#6e6e6e]">
            <ShieldCheck size={14} className="text-[#008832]" />
            <span>Regulated & Trusted Broker</span>
          </div>
        </div>
      </div>
    </div>
  );
};
