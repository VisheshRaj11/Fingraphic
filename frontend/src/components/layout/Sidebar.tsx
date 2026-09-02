import React from 'react';
import { Sparkles, MessageSquare, Trophy, TrendingUp, Wallet, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activeTab: number;
  onSelectTab: (tabIndex: number) => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, mobileOpen = false, onCloseMobile }) => {
  const navItems = [
    {
      id: 0,
      label: 'Signal Analysis Agent',
      icon: Sparkles,
      description: 'Multi-factor evaluation engine',
    },
    {
      id: 1,
      label: 'Community & Leaderboard',
      icon: MessageSquare,
      secondaryIcon: Trophy,
      description: 'Live trader chat & ROI ranks',
    },
    {
      id: 2,
      label: 'Screener & Portfolio',
      icon: TrendingUp,
      secondaryIcon: Wallet,
      description: 'Trades, digest & watchlist',
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full space-y-4">
      <div className="space-y-4">
        {/* Mobile Header with Chevron Back Arrow / Close Button */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 lg:hidden">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">NAVIGATION</span>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1 text-xs font-bold"
            title="Close Drawer"
          >
            <ChevronLeft className="w-4 h-4 text-slate-800" />
            <span>Close</span>
          </button>
        </div>

        <div className="hidden lg:block px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
          DASHBOARD WORKSPACE NAV
        </div>

        {/* Nav Buttons List */}
        <div className="space-y-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const SecIcon = item.secondaryIcon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full text-left p-3.5 rounded-2xl flex items-center justify-between transition-all group border-2 ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-[0_6px_20px_rgba(15,23,42,0.25)] ring-2 ring-indigo-500/40 ring-offset-2'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400 hover:bg-slate-50/80 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`p-2 rounded-xl border transition-colors shrink-0 ${
                      isActive
                        ? 'bg-slate-800 border-slate-700 text-indigo-400'
                        : 'bg-indigo-50 border-indigo-100 text-indigo-600 group-hover:bg-indigo-100'
                    }`}
                  >
                    <div className="relative">
                      <Icon className="w-5 h-5" />
                      {SecIcon && (
                        <SecIcon className="w-3 h-3 absolute -bottom-1 -right-1 text-amber-500" />
                      )}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-black leading-snug truncate">{item.label}</div>
                    <div
                      className={`text-[10px] mt-0.5 font-bold truncate ${
                        isActive ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                </div>

                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive ? 'text-indigo-400 translate-x-0.5' : 'text-slate-300 group-hover:text-slate-500'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Status Badge Footer */}
      <div className="p-4 bg-slate-900 text-white rounded-2xl border-2 border-slate-800 shadow-md space-y-1.5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-extrabold">Real-Time Signals Connected</span>
        </div>
        <p className="text-[10px] font-medium text-slate-400 leading-relaxed">
          Multi-factor evaluation engine active with live market prices.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Slide-Over Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Slide-Over Drawer Side Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 p-4 transform transition-transform duration-300 ease-in-out font-poppins lg:hidden ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Permanent Left Sidebar */}
      <aside className="hidden lg:flex w-72 bg-white/80 backdrop-blur-md border-r border-slate-200 p-4 flex-col justify-between shrink-0 h-[calc(100vh-65px)] sticky top-[65px] font-poppins z-20">
        {sidebarContent}
      </aside>
    </>
  );
};
