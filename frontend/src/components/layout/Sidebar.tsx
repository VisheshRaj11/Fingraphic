import React, { useState } from 'react';
import { Sparkles, MessageSquare, Trophy, TrendingUp, Wallet, Menu, X, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activeTab: number;
  onSelectTab: (tabIndex: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <>
      {/* Mobile Drawer Toggle Button */}
      <div className="md:hidden sticky top-[65px] z-20 bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shadow-xs font-poppins">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 rounded-xl text-xs font-black text-slate-900"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>Workspace Navigation</span>
        </button>
        <span className="text-xs font-extrabold text-indigo-600">
          {navItems[activeTab]?.label}
        </span>
      </div>

      {/* Sidebar Aside Container */}
      <aside
        className={`w-full md:w-72 bg-white/80 backdrop-blur-md border-r border-slate-200 p-4 flex flex-col justify-between shrink-0 h-[calc(100vh-65px)] sticky top-[65px] font-poppins z-20 transition-all ${
          mobileMenuOpen ? 'block fixed inset-0 top-[110px] bg-white z-50' : 'hidden md:flex'
        }`}
      >
        <div className="space-y-3">
          <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
            DASHBOARD WORKSPACE NAV
          </div>

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
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl flex items-center justify-between transition-all group border-2 ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-[0_6px_20px_rgba(15,23,42,0.25)] ring-2 ring-indigo-500/40 ring-offset-2'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400 hover:bg-slate-50/80 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`p-2 rounded-xl border transition-colors ${
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

                    <div>
                      <div className="text-xs font-black leading-snug">{item.label}</div>
                      <div
                        className={`text-[10px] mt-0.5 font-bold ${
                          isActive ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isActive ? 'text-indigo-400 translate-x-0.5' : 'text-slate-300 group-hover:text-slate-500'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Badge Footer */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl border-2 border-slate-800 shadow-md space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-extrabold">Real-Time Signals Connected</span>
          </div>
          <p className="text-[10px] font-medium text-slate-400 leading-relaxed">
            Multi-factor evaluation engine active with live market prices.
          </p>
        </div>
      </aside>
    </>
  );
};
