import React from 'react';
import { FloatingNavbar } from '../components/landing/FloatingNavbar';
import { HeroTextBlock } from '../components/landing/HeroTextBlock';
import { PhoneMockup } from '../components/landing/PhoneMockup';
import { AiAnalysisCard } from '../components/landing/AiAnalysisCard';
import { PortfolioValueCard } from '../components/landing/PortfolioValueCard';
import { TickerTape } from '../components/landing/TickerTape';

interface LandingPageProps {
  onOpenSignIn: () => void;
  onOpenSignUp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenSignIn, onOpenSignUp }) => {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden font-poppins selection:bg-[#5B4FE0] selection:text-white"
      style={{
        background: 'linear-gradient(135deg, #fbfaff 0%, #f2eefc 50%, #eae2fb 100%)',
      }}
    >
      {/* Layer 2: Radial Dot Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-70 z-0"
        style={{
          backgroundImage: 'radial-gradient(#d6cdec 2px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* 1. Floating Navbar */}
      <FloatingNavbar onOpenSignIn={onOpenSignIn} onOpenSignUp={onOpenSignUp} />

      {/* 5. Hero Main Section Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 md:pt-16 pb-24 min-h-[calc(100vh-140px)] flex items-center">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          {/* 2. Hero Text Block (Left ~50-55%) */}
          <div className="w-full  lg:w-[52%] shrink-0">
            <HeroTextBlock onOpenSignUp={onOpenSignUp} />
          </div>

          {/* 3. Hero Visual Block (Right ~45-50%, Phone + Floating Cards) */}
          <div className="w-full lg:w-[48%] relative flex justify-center lg:justify-end lg:-mr-6 pt-8 lg:pt-0">
            <div className="relative w-full max-w-md flex justify-center">
              {/* 3.1 Phone Mockup */}
              <PhoneMockup />

              {/* 3.2 Floating Card 1 — AI Analysis */}
              {/* <AiAnalysisCard /> */}

              {/* 3.3 Floating Card 2 — Portfolio Value */}
              {/* <PortfolioValueCard /> */}
            </div>
          </div>
        </div>
      </main>

      {/* 4. Bottom Ticker Tape */}
      <TickerTape />
    </div>
  );
};
