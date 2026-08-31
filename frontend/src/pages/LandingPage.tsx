import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, Zap, BarChart3, Users, Mail, ShieldCheck, ChevronDown, ChevronUp, Sparkles, Activity } from 'lucide-react';
import { Logo } from '../components/shared/Logo';

interface LandingPageProps {
  onOpenSignIn: () => void;
  onOpenSignUp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenSignIn, onOpenSignUp }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const stockTickerItems = [
    { ticker: 'MICROSOFT', change: '+0.82%', positive: true },
    { ticker: 'NVIDIA', change: '-0.41%', positive: false },
    { ticker: 'TESLA', change: '+2.15%', positive: true },
    { ticker: 'META', change: '+1.05%', positive: true },
    { ticker: 'AMAZON', change: '-0.22%', positive: false },
    { ticker: 'ALPHABET', change: '+0.95%', positive: true },
    { ticker: 'NETFLIX', change: '+1.40%', positive: true },
    { ticker: 'APPLE', change: '+1.24%', positive: true },
  ];

  const sampleScreener = [
    { ticker: 'NVDA', name: 'NVIDIA Corp', price: '$128.50', change: '+3.40%', verdict: 'INVEST', confidence: '92%' },
    { ticker: 'AAPL', name: 'Apple Inc.', price: '$224.20', change: '+1.20%', verdict: 'INVEST', confidence: '88%' },
    { ticker: 'MSFT', name: 'Microsoft Corp', price: '$448.90', change: '+0.80%', verdict: 'HOLD', confidence: '75%' },
    { ticker: 'AMZN', name: 'Amazon.com Inc.', price: '$186.40', change: '+2.10%', verdict: 'INVEST', confidence: '86%' },
    { ticker: 'TSLA', name: 'Tesla Inc.', price: '$210.60', change: '-1.80%', verdict: 'AVOID', confidence: '62%' },
  ];

  const faqs = [
    {
      q: 'How does the quantitative signal engine evaluate stocks?',
      a: 'FinGraphic uses an automated multi-factor engine that analyzes company financials, revenue growth, profit margins, balance sheet debt, and market momentum to generate clear INVEST, HOLD, or AVOID verdicts.',
    },
    {
      q: 'Is paper trading free on FinGraphic?',
      a: 'Yes! Every registered account is credited with a $100,000 virtual portfolio balance to practice trade execution and compete on the global ROI leaderboard.',
    },
    {
      q: 'How do daily email digests work?',
      a: 'Opted-in users receive a daily intelligence briefing delivered straight to their inbox every weekday morning, highlighting top market signals and key bullish/bearish catalysts.',
    },
    {
      q: 'How is trader ROI and leaderboard rank calculated?',
      a: 'Leaderboard ranks are updated in real-time based on your total portfolio performance relative to your initial $100,000 capital. High-performing traders earn Master Trader and Pro Trader badges.',
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden font-poppins bg-slate-50/70">
      {/* Premium Light Pink / Rose Ambient Radial Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-300/30 via-purple-200/15 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="absolute top-[35%] right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-200/25 via-pink-100/10 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-200/20 via-indigo-100/10 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Clean Header */}
      <header className="pt-6 px-4 flex justify-center sticky top-0 z-40">
        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-full px-6 py-2.5 flex items-center justify-between w-full max-w-4xl shadow-xl shadow-rose-900/5">
          <Logo size="sm" showTagline={false} />

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSignIn}
              className="text-xs font-extrabold text-slate-800 hover:text-indigo-600 px-3 py-1.5 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onOpenSignUp}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-extrabold shadow-md shadow-indigo-500/30 transition-all transform hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-pink-200/80 text-[11px] font-extrabold text-slate-800 shadow-sm shadow-pink-500/10 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>The Most Adaptable Stock Market Intelligence Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
            Bring The Future Of Market Analysis To Your Device.
          </h1>

          <p className="text-sm sm:text-base font-medium text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Manage your portfolio with real-time updates and quantitative signal automation — mobile and web, whenever you need.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button
              onClick={onOpenSignUp}
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-full shadow-xl shadow-indigo-500/30 text-xs sm:text-sm flex items-center justify-center gap-2 transition-all transform hover:scale-105"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenSignIn}
              className="w-full sm:w-auto px-8 py-3.5 bg-white/90 hover:bg-white text-slate-900 border border-slate-300 font-bold rounded-full text-xs sm:text-sm shadow-sm transition-all"
            >
              Live Demo
            </button>
          </div>
        </div>

        {/* Right Column Device with Graph & Dynamic Visuals */}
        <div className="lg:col-span-5 relative flex justify-center z-10">
          <div className="relative w-full max-w-[320px] aspect-[9/18] bg-slate-900 rounded-[40px] p-3 shadow-2xl shadow-pink-900/15 border-4 border-slate-800">
            {/* Phone Screen */}
            <div className="w-full h-full bg-slate-50 rounded-[32px] overflow-hidden p-4 space-y-3 relative border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="w-16 h-3.5 bg-slate-900 rounded-full mx-auto mb-3" />
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">A</div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Apple Inc.</div>
                      <div className="text-[9px] text-slate-500 font-semibold">AAPL</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-slate-900">$224.20</div>
                    <div className="text-[9px] font-extrabold text-emerald-600">+1.24%</div>
                  </div>
                </div>

                {/* SVG Mini Stock Chart Graph inside Hero Phone */}
                <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-slate-500">Live Trend</span>
                    <span className="font-black text-emerald-600 flex items-center gap-0.5">
                      <Activity className="w-3 h-3" /> 30D Performance
                    </span>
                  </div>
                  <svg viewBox="0 0 200 60" className="w-full h-12 overflow-visible">
                    <path
                      d="M0 45 Q 30 30, 60 38 T 120 20 T 180 10 L 200 5"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M0 45 Q 30 30, 60 38 T 120 20 T 180 10 L 200 5 L 200 60 L 0 60 Z"
                      fill="rgba(16, 185, 129, 0.12)"
                    />
                    <circle cx="200" cy="5" r="4" fill="#10b981" />
                  </svg>
                </div>

                {/* Signal Badge */}
                <div className="mt-3 p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-left space-y-1">
                  <div className="text-[10px] font-bold text-emerald-700">Quantitative Signal</div>
                  <div className="text-xs font-black text-slate-900">Strong Q4 Revenue Growth</div>
                  <div className="inline-block px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-black rounded-full">
                    INVEST VERDICT
                  </div>
                </div>
              </div>

              {/* Bottom Quick Metrics */}
              <div className="grid grid-cols-3 gap-1.5">
                <div className="p-2 bg-white rounded-xl border border-slate-200 text-center">
                  <div className="text-[8px] font-bold text-slate-400">P/E Ratio</div>
                  <div className="text-[10px] font-extrabold text-slate-900">28.4x</div>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-200 text-center">
                  <div className="text-[8px] font-bold text-emerald-600">Margins</div>
                  <div className="text-[10px] font-extrabold text-slate-900">26.3%</div>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-200 text-center">
                  <div className="text-[8px] font-bold text-slate-400">Action</div>
                  <div className="text-[10px] font-extrabold text-slate-900">BUY</div>
                </div>
              </div>
            </div>

            {/* Floating Top Card */}
            <div className="absolute -left-12 top-10 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-xl shadow-pink-900/10 w-48 space-y-1 animate-bounce" style={{ animationDuration: '6s' }}>
              <div className="text-[9px] font-bold text-slate-400">Live Signal Audit</div>
              <div className="text-xs font-black text-slate-900">Strong Bullish Catalyst</div>
              <span className="inline-block text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Invest Rating →
              </span>
            </div>

            {/* Floating Right Card */}
            <div className="absolute -right-10 bottom-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-xl shadow-pink-900/10 w-48 space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-slate-500">Portfolio Value</span>
                <span className="font-black text-emerald-600">+14.2%</span>
              </div>
              <div className="text-sm font-black text-slate-900">$124,592.00</div>
              <svg viewBox="0 0 120 20" className="w-full h-4">
                <path d="M0 18 Q 30 5, 60 12 T 120 2" fill="none" stroke="#2563eb" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Scrolling Stock Ticker Bar */}
      <section className="relative z-10 w-full bg-white/80 backdrop-blur-md border-y border-pink-100 py-3 overflow-hidden">
        <div className="animate-marquee flex items-center gap-10">
          {[...stockTickerItems, ...stockTickerItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-extrabold uppercase text-slate-900 tracking-wider">{item.ticker}</span>
              <span className={`text-xs font-black ${item.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Key Stats Banner */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 w-full">
        <div className="bg-slate-900 text-white rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-2xl shadow-pink-950/20 border border-slate-800">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-pink-400">$1.2B+</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">Simulated Volume</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-cyan-400">50,000+</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">Active Traders</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">&lt; 100ms</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">Signal Latency</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">99.9%</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">Platform Uptime</div>
          </div>
        </div>
      </section>

      {/* Live Market Signal Screener Preview */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 space-y-6 w-full">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Live Market Signal Screener</h2>
          <p className="text-xs font-semibold text-slate-500 max-w-md mx-auto">
            Real-time quantitative signal evaluation across top market capitalization equities.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-pink-100 shadow-xl shadow-pink-900/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-extrabold uppercase text-slate-500 border-b border-slate-200">
                  <th className="p-4">Symbol</th>
                  <th className="p-4">Company Name</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">24h Change</th>
                  <th className="p-4">Confidence</th>
                  <th className="p-4 text-right">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-800">
                {sampleScreener.map((s) => (
                  <tr key={s.ticker} className="hover:bg-pink-50/40 transition-colors">
                    <td className="p-4 font-black text-indigo-600">${s.ticker}</td>
                    <td className="p-4 font-bold text-slate-900">{s.name}</td>
                    <td className="p-4 font-black">{s.price}</td>
                    <td className={`p-4 font-black ${s.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {s.change}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-extrabold text-slate-700">
                        {s.confidence}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black ${
                          s.verdict === 'INVEST'
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.verdict === 'HOLD'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {s.verdict}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3-Step Process Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 space-y-10 w-full">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">How FinGraphic Works</h2>
          <p className="text-xs font-semibold text-slate-500 max-w-md mx-auto">
            From quantitative stock analysis to social trader leaderboard ranking in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-pink-100 shadow-lg shadow-pink-950/5 space-y-3 relative">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
              1
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Search Any Ticker</h3>
            <p className="text-xs font-medium text-slate-600 leading-relaxed">
              Enter any stock symbol to trigger an automated multi-factor quantitative financial analysis.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-pink-100 shadow-lg shadow-pink-950/5 space-y-3 relative">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
              2
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Audit Signal Catalysts</h3>
            <p className="text-xs font-medium text-slate-600 leading-relaxed">
              Review 12 quantitative metrics, analyst confidence ratings, and green/red bullish/bearish flags.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-pink-100 shadow-lg shadow-pink-950/5 space-y-3 relative">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
              3
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Trade & Rank ROI</h3>
            <p className="text-xs font-medium text-slate-600 leading-relaxed">
              Execute virtual trades with your $100k capital, discuss strategy in live rooms, and earn leaderboard rank badges.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-12 space-y-6 w-full">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs font-semibold text-slate-500">Everything you need to know about the platform.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="bg-white/90 backdrop-blur-md rounded-2xl border border-pink-100 overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-extrabold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-4 hover:bg-pink-50/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs font-medium text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 w-full">
        <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-10 text-center space-y-5 shadow-2xl shadow-pink-950/20 relative overflow-hidden border border-slate-800">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Ready To Master Stock Analysis?</h2>
          <p className="text-xs sm:text-sm font-medium text-slate-300 max-w-md mx-auto">
            Create your account now to claim your $100,000 virtual portfolio and start evaluating quantitative signals.
          </p>
          <button
            onClick={onOpenSignUp}
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-full text-xs sm:text-sm shadow-xl transition-all transform hover:scale-105 inline-flex items-center gap-2"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full bg-white/90 backdrop-blur-md border-t border-slate-200 py-6 px-6 text-center text-xs font-medium text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" showTagline={false} />
          <div>© 2026 FinGraphic. All rights reserved. Trade. Analyze. Grow.</div>
        </div>
      </footer>
    </div>
  );
};
