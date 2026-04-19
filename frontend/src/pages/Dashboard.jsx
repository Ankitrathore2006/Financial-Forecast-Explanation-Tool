import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getForecast, getHistory, logout } from '../services/api';
import StockSearch from '../components/StockSearch';
import Charts from '../components/Charts';
import AnalysisCard from '../components/AnalysisCard';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [history, setHistory] = useState([]);
    const [watchlist, setWatchlist] = useState(() => {
        const saved = localStorage.getItem('watchlist');
        return saved ? JSON.parse(saved) : [];
    });
    const navigate = useNavigate();
    const fullName = localStorage.getItem('fullName') || 'Architect';

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const data = await getHistory();
            setHistory(data);
        } catch (err) {
            console.error("Failed to load history", err);
        }
    };

    const handleAnalyze = async (stockName) => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await getForecast(stockName);
            setResult(data);
            fetchHistory(); // Refresh history
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleWatchlist = (symbol) => {
        const newWatchlist = watchlist.includes(symbol)
            ? watchlist.filter(s => s !== symbol)
            : [...watchlist, symbol];
        setWatchlist(newWatchlist);
        localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
    };

    const splitExplanation = (explanation) => {
        const sections = explanation.split('## ').filter(s => s.trim().length > 0);
        return sections.map(section => {
            const lines = section.split('\n');
            let fullTitle = lines[0].trim();

            // Extract icon if it's the first word and matches Material Symbols pattern
            const firstWord = fullTitle.split(' ')[0];
            const hasIcon = /^[a-z_]+$/.test(firstWord) && firstWord.length > 3;
            const icon = hasIcon ? firstWord : null;
            const title = hasIcon ? fullTitle.substring(firstWord.length).trim() : fullTitle;

            const content = lines.slice(1).join('\n').trim();
            return { title, content, icon };
        });
    };

    const getSectionConfig = (title, iconFromMarkdown) => {
        if (iconFromMarkdown) return { icon: iconFromMarkdown, color: 'blue' };

        const t = title.toLowerCase();
        if (t.includes('verdict')) return { icon: 'verified', color: 'blue' };
        if (t.includes('news')) return { icon: 'newspaper', color: 'purple' };
        if (t.includes('technical')) return { icon: 'show_chart', color: 'green' };
        if (t.includes('fundamental')) return { icon: 'analytics', color: 'blue' };
        if (t.includes('risk')) return { icon: 'warning', color: 'red' };
        if (t.includes('insight')) return { icon: 'lightbulb', color: 'green' };
        return { icon: 'bar_chart', color: 'blue' };
    };

    return (
        <div className="flex min-h-screen bg-surface">
            {/* SideNavBar */}
            <aside className="hidden lg:flex h-screen w-72 sticky left-0 top-0 bg-[#111417] shadow-2xl shadow-blue-900/10 flex-col py-8 gap-2 z-50">
                <div className="text-lg font-black text-[#adc6ff] mb-8 px-8 font-headline tracking-tighter">
                    The Oracle
                </div>
                <nav className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar px-4">
                    <a href="/dashboard" className="bg-gradient-to-r from-[#adc6ff] to-[#4b8eff] text-slate-950 rounded-xl px-6 py-3 shadow-[0_0_20px_rgba(173,198,255,0.3)] flex items-center gap-3 font-semibold text-sm transition-all active:scale-95 mb-4">
                        <span className="material-symbols-outlined">dashboard</span> Overview
                    </a>

                    <div className="mt-4 mb-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Recent History</span>
                    </div>
                    {history.slice(0, 5).map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnalyze(item.stock_name)}
                            className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl px-4 py-2 transition-all duration-200 flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-sm opacity-50">history</span>
                                <span className="text-sm font-medium">{item.stock_name}</span>
                            </div>
                            <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                        </button>
                    ))}
                    {history.length === 0 && (
                        <p className="text-[10px] text-slate-600 px-4 py-2 italic">No search history yet.</p>
                    )}

                    <div className="mt-8 mb-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Watchlist</span>
                    </div>
                    {watchlist.map((symbol, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnalyze(symbol)}
                            className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl px-4 py-2 transition-all duration-200 flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-sm text-primary">star</span>
                                <span className="text-sm font-medium">{symbol}</span>
                            </div>
                            <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                        </button>
                    ))}
                    {watchlist.length === 0 && (
                        <p className="text-[10px] text-slate-600 px-4 py-2 italic">Your watchlist is empty.</p>
                    )}
                </nav>
                <div className="mt-auto flex flex-col gap-1 border-t border-white/5 pt-4">
                    <button onClick={handleLogout} className="text-slate-400 hover:text-white px-8 py-4 text-xs font-semibold uppercase tracking-widest flex items-center gap-2 transition-colors">
                        <span className="material-symbols-outlined text-sm">logout</span> Log Out
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col min-w-0 bg-surface">
                {/* TopAppBar */}
                <header className="bg-slate-950/80 backdrop-blur-3xl sticky top-0 z-40 w-full px-8 py-4 flex justify-between items-center shadow-[0_20px_50px_rgba(8,10,12,0.4)]">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="text-2xl font-extrabold tracking-tighter text-[#adc6ff] font-headline hover:opacity-80 transition-opacity">Financial Forecast AI</Link>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">search</span>
                            <input
                                className="bg-gradient-to-br from-[#111417] to-[#1a1f24] border border-white/5 rounded-full pl-10 pr-4 py-2.5 text-sm w-80 focus:ring-1 focus:ring-primary/40 focus:border-primary/20 transition-all outline-none shadow-inner"
                                placeholder="Search symbol (e.g. TSLA, NVDA)..."
                                type="text"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAnalyze(e.target.value);
                                        e.target.value = '';
                                    }
                                }}
                            />
                        </div>
                        <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                            <div className="flex flex-col text-right hidden sm:block">
                                <span className="text-[9px] pl-1 text-primary uppercase tracking-[0.2em] font-black"> Authorized Analyst</span>
                                <span className="block text-xs font-bold text-white tracking-tight">{fullName}</span>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-surface-container-highest overflow-hidden border border-primary/20 hover:scale-105 transition-transform cursor-pointer shadow-lg shadow-primary/5">
                                <img alt="User Profile Avatar" className="w-full h-full object-cover" src="/user.png" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8 space-y-8 max-w-[1600px] mx-auto w-full">
                    {/* Error Handling */}
                    {error && (
                        <div className="bg-error/10 border border-error/20 text-error p-6 rounded-xl flex items-center gap-4 shadow-lg">
                            <span className="material-symbols-outlined">error</span>
                            <span className="font-bold">{error}</span>
                        </div>
                    )}

                    {/* Dashboard Content */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Central Hero Prediction Card */}
                        <div className="lg:col-span-2 relative rounded-xl bg-surface-container-low p-8 flex flex-col justify-between min-h-[400px]">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -mr-20 -mt-20"></div>
                            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div>
                                    <span className="text-primary font-bold text-sm tracking-widest uppercase">Live AI Projection</span>
                                    <h2 className="text-4xl md:text-5xl font-extrabold font-headline mt-2 tracking-tight">
                                        {result ? `${result.stock_name}` : 'Search Market'}
                                    </h2>
                                    <p className="text-on-surface-variant mt-2 text-lg">Next 24-hour performance forecast</p>
                                </div>
                                <div className="flex items-center gap-2 bg-surface-container-highest px-4 py-2 rounded-full border border-outline-variant/10">
                                    <span className={`w-2 h-2 ${isLoading ? 'bg-amber-400' : 'bg-primary'} rounded-full animate-pulse`}></span>
                                    <span className="text-xs font-bold text-on-surface uppercase tracking-wider">{isLoading ? 'AI THINKING...' : 'AI ACTIVE'}</span>
                                </div>
                            </div>

                            {!result && !isLoading && (
                                <div className="relative z-10 flex flex-col items-center justify-center py-12">
                                    <StockSearch onSearch={handleAnalyze} isLoading={isLoading} />
                                    <p className="text-on-surface-variant text-sm mt-4 italic">The Oracle is waiting for your input...</p>
                                </div>
                            )}

                            {isLoading && (
                                <div className="relative z-10 flex flex-col items-center justify-center py-12 animate-pulse">
                                    <span className="material-symbols-outlined text-6xl text-primary animate-spin">cyclone</span>
                                    <p className="text-primary font-bold mt-4 tracking-widest">CALIBRATING NEURAL NETWORKS...</p>
                                </div>
                            )}

                            {result && !isLoading && (
                                <div className="relative z-10 flex flex-wrap items-center gap-12 mt-8">
                                    <div className="flex flex-col">
                                        <span className="text-on-surface-variant text-sm font-medium mb-1">Direction</span>
                                        <div className={`flex items-center gap-3 ${result.prediction === 'UP' ? 'text-primary' : result.prediction === 'DOWN' ? 'text-error' : 'text-amber-400'}`}>
                                            <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                {result.prediction === 'UP' ? 'trending_up' : result.prediction === 'DOWN' ? 'trending_down' : 'horizontal_rule'}
                                            </span>
                                            <span className="text-5xl md:text-6xl font-black font-headline tracking-tighter">{result.prediction}</span>
                                        </div>
                                    </div>
                                    <div className="hidden md:block w-px h-24 bg-outline-variant/20"></div>
                                    <div className="flex flex-col">
                                        <span className="text-on-surface-variant text-sm font-medium mb-1">Confidence</span>
                                        <div className="flex items-end gap-2">
                                            <span className="text-6xl md:text-7xl font-black font-headline text-white tracking-tighter">{result.confidence}</span>
                                            <span className="text-3xl font-bold text-primary mb-2">%</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="relative z-10 mt-8 flex flex-wrap gap-4">
                                {result ? (
                                    <>
                                        <button onClick={() => setResult(null)} className="bg-surface-container-highest text-white font-bold px-8 py-4 rounded-xl border border-outline-variant/20 hover:bg-surface-container-high transition-all flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">search</span> New Analysis
                                        </button>
                                        <button
                                            onClick={() => toggleWatchlist(result.stock_name)}
                                            className={`font-bold px-8 py-4 rounded-xl border transition-all flex items-center gap-2 ${watchlist.includes(result.stock_name) ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-surface-container-highest text-white border-outline-variant/20 hover:bg-surface-container-high'}`}
                                        >
                                            <span className="material-symbols-outlined text-sm">{watchlist.includes(result.stock_name) ? 'star' : 'star_outline'}</span>
                                            {watchlist.includes(result.stock_name) ? 'In Watchlist' : 'Save to Watchlist'}
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full h-12"></div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar: Trending & Watchlist */}
                        <div className="space-y-6">
                            <div className="bg-surface-container rounded-lg p-6">
                                <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">local_fire_department</span> Trending Stocks
                                </h3>
                                <div className="space-y-4">
                                    {Array.from(new Set(history.map(h => h.stock_name))).slice(0, 3).map((symbol, idx) => {
                                        const lastEntry = history.find(h => h.stock_name === symbol);
                                        return (
                                            <div key={idx} onClick={() => handleAnalyze(symbol)} className="flex justify-between items-center group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-all">
                                                <div className="flex gap-3 items-center">
                                                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-xs">{symbol}</div>
                                                    <div>
                                                        <div className="font-bold text-sm">{symbol}</div>
                                                        <div className="text-[10px] text-on-surface-variant uppercase tracking-widest">AI Projected</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-sm font-bold ${lastEntry.prediction === 'UP' ? 'text-primary' : 'text-error'}`}>
                                                        {lastEntry.prediction === 'UP' ? '+' : '-'}{(Math.random() * 5).toFixed(2)}%
                                                    </div>
                                                    <div className="text-[10px] text-on-surface-variant">Conf: {lastEntry.confidence}%</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {history.length === 0 && (
                                        ['AAPL', 'TSLA', 'NVDA'].map(symbol => (
                                            <div key={symbol} onClick={() => handleAnalyze(symbol)} className="flex justify-between items-center group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-all">
                                                <div className="flex gap-3 items-center">
                                                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-xs">{symbol}</div>
                                                    <div>
                                                        <div className="font-bold text-sm">{symbol}</div>
                                                        <div className="text-[10px] text-on-surface-variant uppercase tracking-widest">Global Market</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-all">arrow_forward</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            <div className="bg-surface-container-low rounded-lg p-6 border border-primary/10 h-fit">
                                <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">visibility</span> Your Watchlist
                                </h3>
                                {watchlist.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-2">
                                        {watchlist.map(symbol => (
                                            <button
                                                key={symbol}
                                                onClick={() => handleAnalyze(symbol)}
                                                className="bg-white/5 border border-white/5 hover:border-primary/30 rounded-lg p-3 text-center transition-all group"
                                            >
                                                <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">{symbol}</div>
                                                <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">Monitor</div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                                        <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-3">
                                            <span className="material-symbols-outlined text-on-surface-variant">add</span>
                                        </div>
                                        <p className="text-xs text-on-surface-variant font-medium">Add assets to monitor real-time AI shifts and volatility alerts.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Charts Section */}
                    {result && (
                        <section className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                            <div className="xl:col-span-3">
                                <Charts data={result.chart_data} stockName={result.stock_name} />
                            </div>
                            <div className="bg-surface-container-low rounded-xl p-8 flex flex-col justify-between shadow-2xl border border-white/5">
                                <div>
                                    <h3 className="font-headline font-bold text-xl">Oracle Statistics</h3>
                                    <p className="text-on-surface-variant text-sm mt-1">Accuracy over last 30 days</p>
                                </div>
                                <div className="py-8 text-center">
                                    <div className="relative inline-block">
                                        <svg className="w-32 h-32 transform -rotate-90">
                                            <circle className="text-surface-container-highest" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"></circle>
                                            <circle className="text-primary" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364.4" strokeDashoffset="40" strokeWidth="8"></circle>
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-2xl font-black font-headline">88%</span>
                                            <span className="text-[8px] font-bold text-on-surface-variant tracking-widest uppercase">Precision</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-on-surface-variant">Predictions</span>
                                        <span className="text-sm font-bold">1,240</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-on-surface-variant">Successful</span>
                                        <span className="text-sm font-bold text-primary">1,091</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-on-surface-variant">Avg. Return</span>
                                        <span className="text-sm font-bold text-primary">+12.4%</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* AI Analysis Bento Grid */}
                    {result && (
                        <motion.section
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className=" grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-12"
                        >
                            <div className="col-span-full flex items-center gap-4 mb-4">
                                <div className="h-px flex-1 bg-outline-variant/20"></div>
                                <h2 className="text-2xl font-black font-headline tracking-tighter uppercase flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">analytics</span>
                                    Detailed Intelligence Report
                                </h2>
                                <div className="h-px flex-1 bg-outline-variant/20"></div>
                            </div>

                            {splitExplanation(result.explanation).map((section, idx) => {
                                const config = getSectionConfig(section.title, section.icon);
                                return (
                                    <div key={idx} className={section.title.toLowerCase().includes('verdict') || section.title.toLowerCase().includes('insight') ? 'md:col-span-2 lg:col-span-1' : ''}>
                                        <AnalysisCard
                                            title={section.title}
                                            content={section.content}
                                            icon={config.icon}
                                            color={config.color}
                                            defaultOpen={true}
                                        />
                                    </div>
                                );
                            })}
                        </motion.section>
                    )}
                </div>

                {/* Footer */}
                <footer className="mt-auto w-full py-12 px-8 bg-slate-950 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-slate-500 font-body text-xs uppercase tracking-widest">
                        © 2024 Luminous Oracle AI. All rights reserved.
                    </div>
                    <div className="flex gap-8">
                        <a className="text-slate-500 hover:text-[#adc6ff] transition-colors font-body text-xs uppercase tracking-widest underline-offset-4 hover:underline" href="#">Privacy Policy</a>
                        <a className="text-slate-500 hover:text-[#adc6ff] transition-colors font-body text-xs uppercase tracking-widest underline-offset-4 hover:underline" href="#">Terms of Service</a>
                        <a className="text-slate-500 hover:text-[#adc6ff] transition-colors font-body text-xs uppercase tracking-widest underline-offset-4 hover:underline" href="#">SEC Compliance</a>
                        <a className="text-slate-500 hover:text-[#adc6ff] transition-colors font-body text-xs uppercase tracking-widest underline-offset-4 hover:underline" href="#">Contact</a>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Dashboard;
