import React from 'react';

interface DerivLogoProps {
  variant?: 'light' | 'dark';
  className?: string;
  onClick?: () => void;
}

export const DerivLogo: React.FC<DerivLogoProps> = ({ variant = 'dark', className = '', onClick }) => {
  const isLightText = variant === 'light';

  return (
    <div 
      id="deriv-brand-logo"
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group ${className}`}
    >
      {/* Deriv Coral Red Icon */}
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      >
        <rect width="32" height="32" rx="6" fill="#FF444F" />
        <path 
          d="M9 11.5C9 10.1193 10.1193 9 11.5 9H16.5C19.5376 9 22 11.4624 22 14.5C22 17.5376 19.5376 20 16.5 20H13V23H9V11.5Z" 
          fill="white" 
        />
        <path 
          d="M13 13H16.2C17.1941 13 18 13.8059 18 14.8C18 15.7941 17.1941 16.6 16.2 16.6H13V13Z" 
          fill="#FF444F" 
        />
      </svg>

      {/* Brand Text & Academy Sub-badge */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span className={`text-[21px] font-bold tracking-tight font-heading ${isLightText ? 'text-white' : 'text-[#111111]'}`}>
            deriv
          </span>
          <span className="w-1 h-1 rounded-full bg-[#ff444f]" />
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-[10px] font-semibold tracking-wider uppercase text-[#ff444f]">
            Traders Academy
          </span>
        </div>
      </div>
    </div>
  );
};
