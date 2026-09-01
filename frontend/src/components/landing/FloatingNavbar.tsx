import React from 'react';

interface FloatingNavbarProps {
  onOpenSignIn: () => void;
  onOpenSignUp: () => void;
}

export const FloatingNavbar: React.FC<FloatingNavbarProps> = ({ onOpenSignIn, onOpenSignUp }) => {
  return (
    <header className="pt-6 px-4 flex justify-center sticky top-0 z-40">
      {/* Floating Centered Pill Navbar */}
      <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-full px-6 py-3 flex items-center gap-8 shadow-md max-w-fit mx-auto">
        {/* Left Cluster: Monogram Avatar + Wordmark */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-9 h-9 rounded-full bg-[#1E1B3A] text-white font-bold text-sm flex items-center justify-center shadow-xs">
            F
          </div>
          <span className="font-bold text-lg text-[#1E1B3A] tracking-tight">
            FinGraphic
          </span>
        </div>

        {/* Right Cluster: Sign In Link + Get Started Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenSignIn}
            className="text-sm font-medium text-[#1E1B3A]/80 hover:text-[#1E1B3A] transition-colors hidden sm:inline-block"
          >
            Sign In
          </button>

          <button
            onClick={onOpenSignUp}
            className="rounded-full bg-[#5B4FE0] hover:bg-[#4B3FD1] text-white font-bold text-sm px-5 py-2.5 shadow-md shadow-[#5B4FE0]/25 transition-all transform hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
};
