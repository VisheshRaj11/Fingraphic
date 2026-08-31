import React from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', showTagline = true, size = 'md' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Exact Logo Graphic matching Image 2 */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="finGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00d2b5" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="barGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#00d2b5" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>

          {/* Stylized 'F' Top Bar & Spine */}
          <path
            d="M25 15 C45 15 75 18 80 32 C75 42 55 42 42 42 L42 52 C52 52 65 48 70 58 C60 66 42 64 42 64 L42 85 H25 V15 Z"
            fill="url(#finGrad)"
          />

          {/* Upward Stock Growth Bars */}
          <rect x="25" y="70" width="10" height="15" rx="3" fill="#00d2b5" />
          <rect x="39" y="58" width="10" height="27" rx="3" fill="#0891b2" />
          <rect x="53" y="44" width="10" height="41" rx="3" fill="#2563eb" />

          {/* Upward Trend Arc & Dot */}
          <path
            d="M22 88 C40 88 65 80 75 45"
            stroke="url(#finGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="78" cy="38" r="5" fill="#00d2b5" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col justify-center leading-none">
        <div className={`font-black tracking-tight ${textSizes[size]} flex items-center`}>
          <span className="text-slate-900">fin</span>
          <span className="text-cyan-500">graphic</span>
        </div>
        {showTagline && (
          <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-[0.2em] text-slate-500 mt-1">
            Trade . Analyze . Grow .
          </span>
        )}
      </div>
    </div>
  );
};
