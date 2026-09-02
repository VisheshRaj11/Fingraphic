import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User as UserIcon, Settings, PieChart, LogOut, ChevronDown, Menu } from 'lucide-react';
import { RootState, AppDispatch } from '../../app/store';
import { logout } from '../../features/auth/authSlice';
import { RankBadge } from '../shared/Badge';
import { Logo } from '../shared/Logo';

interface NavbarProps {
  onOpenProfile: () => void;
  onSelectTab: (tabIndex: number) => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenProfile, onSelectTab, onToggleMobileMenu }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { portfolio } = useSelector((state: RootState) => state.portfolio);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const rankTier = portfolio?.rankTier || 'NOVICE';
  const roi = portfolio?.roi || 0;

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs font-poppins">
      {/* Left: Mobile Hamburger Toggle + Brand Logo */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 lg:hidden transition-colors border border-slate-200"
            title="Open Mobile Navigation"
          >
            <Menu className="w-5 h-5 text-slate-900" />
          </button>
        )}
        <Logo size="md" showTagline={true} />
      </div>

      {/* Right: User Actions & Profile Dropdown */}
      <div className="flex items-center gap-3 sm:gap-4">
        {user ? (
          <>
            <div className="hidden sm:block">
              <RankBadge rankTier={rankTier} roi={roi} />
            </div>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-200 bg-white"
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center overflow-hidden">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-900 max-w-[110px] truncate hidden sm:inline-block">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Signed in as</p>
                    <p className="text-xs font-black text-slate-900 truncate">{user.email}</p>
                  </div>

                  <button
                    onClick={onOpenProfile}
                    className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={() => onSelectTab(2)}
                    className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <PieChart className="w-3.5 h-3.5 text-slate-500" />
                    <span>Holdings & Portfolio</span>
                  </button>

                  <button
                    onClick={onOpenProfile}
                    className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    <span>Account Settings</span>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={() => dispatch(logout())}
                    className="w-full px-4 py-2 text-left text-xs font-extrabold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-xs font-bold text-slate-500">Guest Access</div>
        )}
      </div>
    </header>
  );
};
