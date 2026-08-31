import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './app/store';
import { fetchCurrentUser } from './features/auth/authSlice';
import { fetchPortfolio } from './features/portfolio/portfolioSlice';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { AnalysisView } from './pages/AnalysisView';
import { ChatLeaderboardView } from './pages/ChatLeaderboardView';
import { ScreenerPortfolioView } from './pages/ScreenerPortfolioView';
import { TradeModal } from './pages/TradeModal';
import { ProfileModal } from './pages/ProfileModal';

export const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, token, isLoading } = useSelector((state: RootState) => state.auth);

  const [activeTab, setActiveTab] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [tradeModalTicker, setTradeModalTicker] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser());
      dispatch(fetchPortfolio());
    }
  }, [dispatch, token]);

  // When logged out, render Homepage / Landing Page (Image 1 style with floating top pill nav)
  if (!isAuthenticated && !isLoading) {
    if (showAuthModal) {
      return (
        <div className="relative font-poppins">
          <div className="fixed top-4 right-4 z-50">
            <button
              onClick={() => setShowAuthModal(false)}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-full shadow-lg"
            >
              Back to Home
            </button>
          </div>
          <AuthPage />
        </div>
      );
    }

    return (
      <LandingPage
        onOpenSignIn={() => setShowAuthModal(true)}
        onOpenSignUp={() => setShowAuthModal(true)}
      />
    );
  }

  // When logged in, render Dashboard with Top Header + Left Sidebar (Aside)
  return (
    <div className="min-h-screen flex flex-col font-poppins antialiased select-none">
      {/* Top Header Navbar */}
      <Navbar
        onOpenProfile={() => setProfileModalOpen(true)}
        onSelectTab={(tabIdx) => setActiveTab(tabIdx)}
      />

      <div className="flex-1 flex">
        {/* Dashboard Left Navigation Sidebar (Aside) */}
        <Sidebar activeTab={activeTab} onSelectTab={(tabIdx) => setActiveTab(tabIdx)} />

        {/* Main Workspace Content Area */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
          {activeTab === 0 && (
            <AnalysisView onOpenTradeModal={(ticker) => setTradeModalTicker(ticker)} />
          )}

          {activeTab === 1 && <ChatLeaderboardView />}

          {activeTab === 2 && (
            <ScreenerPortfolioView onOpenTradeModal={(ticker) => setTradeModalTicker(ticker)} />
          )}
        </main>
      </div>

      {/* Trade Order Modal */}
      {tradeModalTicker && (
        <TradeModal
          initialTicker={tradeModalTicker}
          onClose={() => setTradeModalTicker(null)}
        />
      )}

      {/* Account Settings Profile Modal */}
      {profileModalOpen && (
        <ProfileModal onClose={() => setProfileModalOpen(false)} />
      )}
    </div>
  );
};

export default App;
