/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useTrades } from './useTrades';
import { TradeForm, STRATEGY_OPTIONS } from './components/TradeForm';
import { TradeCard } from './components/TradeCard';
import { PerformanceChart } from './components/PerformanceChart';
import { exportToCSV } from './exportUtils';
import { Plus, ListFilter, TrendingUp, Activity, Download, Moon, Sun, Search, Calendar, LogIn, LogOut } from 'lucide-react';
import { auth } from './firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const { trades, addTrade, updateTrade, deleteTrade } = useTrades();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editTrade, setEditTrade] = useState<any>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const [user, setUser] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Filtering states
  const [searchPair, setSearchPair] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterStrategy, setFilterStrategy] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    // Initial theme setup
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
    
    // Auth Listener
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUser(user);
      setAuthChecking(false);
    });

    return () => unsubscribeAuth();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
  };

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    }
  };

  // Monthly stats
  const currentMonthDate = new Date();
  const currentMonth = currentMonthDate.getMonth();
  const currentYear = currentMonthDate.getFullYear();
  
  const monthlyTrades = trades.filter(t => {
    const d = new Date(t.dateTime);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const mTotalTrades = monthlyTrades.length;
  const mWins = monthlyTrades.filter(t => t.resultStatus === 'Win').length;
  const mWinRate = mTotalTrades > 0 ? Math.round((mWins / mTotalTrades) * 100) : 0;
  const mTotalPips = monthlyTrades.reduce((acc, t) => acc + (Number(t.resultPips) || 0), 0);

  // Overall Quick stats
  const totalTrades = trades.length;
  const wins = trades.filter(t => t.resultStatus === 'Win').length;
  const winRate = totalTrades > 0 ? Math.round((wins / totalTrades) * 100) : 0;
  const totalPips = trades.reduce((acc, t) => acc + (Number(t.resultPips) || 0), 0);

  // Filtered Trades
  const filteredTrades = trades.filter(t => {
    if (searchPair && !t.pair.toLowerCase().includes(searchPair.toLowerCase())) return false;
    if (filterStatus !== 'All' && t.resultStatus !== filterStatus) return false;
    if (filterStrategy !== 'All' && (!t.strategyTags || !t.strategyTags.includes(filterStrategy))) return false;
    
    if (dateFrom) {
      if (new Date(t.dateTime) < new Date(dateFrom)) return false;
    }
    if (dateTo) {
      if (new Date(t.dateTime) > new Date(dateTo + 'T23:59:59')) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20 transition-colors duration-200">
      <Toaster position="bottom-right" />
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
              <img src="/logo.jpg" alt="AlphaLog" className="w-full h-full object-cover" onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.classList.add('bg-indigo-600', 'shadow-[0_0_15px_-4px_rgba(79,70,229,0.6)]');
                e.currentTarget.parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity text-white"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>';
              }} />
            </div>
            <h1 className="text-xl font-mono font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">AlphaLog</h1>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button 
              onClick={toggleTheme}
              className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {user ? (
              <>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => {
                    setEditTrade(null);
                    setIsFormOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-full font-medium hover:bg-zinc-800 dark:hover:bg-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Log Trade</span>
                </button>
              </>
            ) : (
              <button 
                onClick={handleLogin}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-500 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In with Google</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 mt-8">
        {authChecking ? (
           <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
           </div>
        ) : !user ? (
           <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
             <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center overflow-hidden">
                <img src="/logo.jpg" alt="AlphaLog" className="w-full h-full object-cover" onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.classList.add('bg-indigo-600', 'shadow-[0_0_15px_-4px_rgba(79,70,229,0.6)]');
                  e.currentTarget.parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity text-white"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>';
                }} />
             </div>
             <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-2">Welcome to AlphaLog</h2>
             <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm mx-auto">Sign in to start tracking your trading performance and journal entries securely.</p>
             <button 
                onClick={handleLogin}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
              >
                <LogIn className="w-4 h-4" />
                Sign In with Google
              </button>
           </div>
        ) : (
          <>
            {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Overall Stats */}
          <div className="grid grid-cols-2 gap-4">
             <div className="col-span-2 mb-1">
               <h2 className="text-sm font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">Overall Performance</h2>
             </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Win Rate & Trades</p>
              <p className="text-3xl font-mono text-indigo-600 dark:text-indigo-400 mb-1">{winRate}%</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">{totalTrades} logged</p>
            </div>
             <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Total Pips</p>
               <p className={`text-3xl font-mono mb-1 ${totalPips >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {totalPips >= 0 ? '+' : ''}{totalPips}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium pb-[1px]">net profit/loss</p>
            </div>
          </div>

          {/* Monthly Stats */}
          <div className="grid grid-cols-2 gap-4">
             <div className="col-span-2 mb-1">
               <h2 className="text-sm font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">{currentMonthDate.toLocaleString('default', { month: 'long' })} Performance</h2>
             </div>
            <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-emerald-700 dark:text-emerald-500/80 mb-1">Monthly Win Rate</p>
              <p className="text-3xl font-mono text-emerald-600 dark:text-emerald-400 mb-1">{mWinRate}%</p>
              <p className="text-xs text-emerald-600/70 dark:text-emerald-500/60 font-medium">{mTotalTrades} trades</p>
            </div>
            <div className="bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-indigo-700 dark:text-indigo-500/80 mb-1">Monthly Pips</p>
               <p className={`text-3xl font-mono mb-1 ${mTotalPips >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-red-600 dark:text-red-400'}`}>
                {mTotalPips >= 0 ? '+' : ''}{mTotalPips}
              </p>
              <p className="text-xs text-indigo-600/70 dark:text-indigo-500/60 font-medium">net this month</p>
            </div>
          </div>
        </div>

        {/* Trade Chart */}
        <PerformanceChart trades={trades} />

        {/* Toolbar (Search, Filter, Export) */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-end shadow-sm">
          <div className="w-full md:w-auto flex-1">
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">Search Pair</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                type="text" 
                placeholder="e.g. BTCUSD" 
                value={searchPair}
                onChange={(e) => setSearchPair(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>
          
          <div className="w-full md:w-auto">
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">Result Status</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer min-w-[120px]"
            >
              <option value="All">All Results</option>
              <option value="Win">Win</option>
              <option value="Loss">Loss</option>
              <option value="Breakeven">Breakeven</option>
              <option value="Open/Pending">Open/Pending</option>
            </select>
          </div>

          <div className="w-full md:w-auto">
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">Strategy</label>
            <select 
              value={filterStrategy}
              onChange={(e) => setFilterStrategy(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer min-w-[120px]"
            >
              <option value="All">All Strategies</option>
              {STRATEGY_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-auto flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">From Date</label>
              <div className="relative">
                 <input 
                  type="date" 
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">To Date</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto pt-2 md:pt-0">
             <button 
              onClick={() => exportToCSV(filteredTrades)}
              disabled={filteredTrades.length === 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Trade List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <ListFilter className="w-5 h-5 text-indigo-500" />
              Journal Entries 
              <span className="text-sm text-zinc-500 dark:text-zinc-400 font-normal">({filteredTrades.length})</span>
            </h2>
          </div>

          {filteredTrades.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 border-dashed rounded-2xl shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 mb-4">
                <Search className="w-8 h-8 text-zinc-400 dark:text-zinc-600" />
              </div>
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-300 mb-2">No matching trades found</h3>
              <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm mx-auto">Adjust your filters or start tracking new entries to populate your journal.</p>
              {trades.length === 0 && (
                <button 
                  onClick={() => {
                    setEditTrade(null);
                    setIsFormOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
                >
                  <Plus className="w-4 h-4" />
                  Add First Trade
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTrades.map(trade => (
                <TradeCard 
                  key={trade.id} 
                  trade={trade} 
                  onEdit={() => {
                    setEditTrade(trade);
                    setIsFormOpen(true);
                  }}
                  onDelete={deleteTrade}
                />
              ))}
            </div>
          )}
        </div>
          </>
        )}
      </main>

      {isFormOpen && user && (
        <TradeForm
          initialData={editTrade}
          onSubmit={async (tradeData) => {
            if (editTrade) {
              await updateTrade(editTrade.id, tradeData);
            } else {
              await addTrade(tradeData);
            }
          }} 
          onCancel={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
}

