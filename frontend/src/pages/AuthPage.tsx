import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import { api } from '../lib/api';
import { setAuthSuccess } from '../features/auth/authSlice';
import { AppDispatch } from '../app/store';
import { Logo } from '../components/shared/Logo';

export const AuthPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const response = await api.post('/auth/login', { email, password });
        dispatch(setAuthSuccess(response.data));
      } else {
        const response = await api.post('/auth/register', { email, password, name });
        dispatch(setAuthSuccess(response.data));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoUser = (userType: 'master' | 'pro' | 'novice') => {
    if (userType === 'master') {
      setEmail('master.trader@fingraphic.com');
      setName('Elena Rostova');
    } else if (userType === 'pro') {
      setEmail('pro.trader@fingraphic.com');
      setName('Alex Vance');
    } else {
      setEmail('novice.investor@fingraphic.com');
      setName('Jordan Lee');
    }
    setPassword('Password123!');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 font-poppins">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 space-y-6">
        {/* Header with Exact Brand Logo */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <Logo size="lg" showTagline={true} />

          <div className="pt-2">
            <h2 className="text-xl font-black tracking-tight text-slate-900">
              {isLogin ? 'Sign In to FinGraphic' : 'Create FinGraphic Account'}
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              {isLogin ? 'Access market signals & social trading' : 'Join social trading community'}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="Alex Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="trader@fingraphic.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl shadow-lg transition-all text-xs disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Demo User Quick Preset Fillers */}
        <div className="pt-2 border-t border-slate-100">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase text-center mb-2">QUICK DEMO ACCESSIBILITY</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => fillDemoUser('master')}
              type="button"
              className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-[10px] font-bold text-amber-800"
            >
              Master Trader
            </button>
            <button
              onClick={() => fillDemoUser('pro')}
              type="button"
              className="py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-[10px] font-bold text-indigo-800"
            >
              Pro Trader
            </button>
            <button
              onClick={() => fillDemoUser('novice')}
              type="button"
              className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-[10px] font-bold text-slate-800"
            >
              Novice Trader
            </button>
          </div>
        </div>

        {/* Toggle Auth Mode */}
        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            {isLogin ? "Don't have an account? Register here" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};
