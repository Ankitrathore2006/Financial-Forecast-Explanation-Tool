import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="bg-background text-on-surface antialiased overflow-x-hidden">
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[921px] flex items-center justify-center pt-20 pb-32 overflow-hidden">
          {/* Background Radial Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#4b8eff]/10 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#ef6719]/5 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/20 mb-8"
            >
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
              <span className="text-xs font-semibold tracking-widest uppercase text-on-surface-variant">Powered by Explainable AI</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-extrabold tracking-tighter text-on-surface mb-8 leading-[1.1] font-headline"
            >
              AI-Powered Stock <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">Forecast & Explanation</span> Engine
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-on-surface-variant max-w-3xl mx-auto mb-12 font-light leading-relaxed font-body"
            >
              Get intelligent predictions with clear reasoning. Our engine doesn't just show you the future; it tells you why it's happening.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col md:flex-row gap-6 justify-center items-center"
            >
              <Link to="/signup" className="bg-gradient-to-r from-primary to-primary-container text-[#001a41] font-bold text-lg px-10 py-5 rounded-full shadow-[0_0_40px_rgba(173,198,255,0.2)] hover:shadow-[0_0_60px_rgba(173,198,255,0.4)] transition-all duration-500 scale-95 active:scale-90">
                Start Analyzing
              </Link>
              <button className="flex items-center gap-2 px-10 py-5 rounded-full font-semibold border border-outline-variant/30 hover:bg-white/5 transition-all duration-300">
                <span className="material-symbols-outlined">play_circle</span>
                See how it works
              </button>
            </motion.div>

            {/* Abstract Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mt-24 relative max-w-5xl mx-auto"
            >
              <div className="rounded-xl overflow-hidden shadow-2xl shadow-blue-900/20 bg-surface-container-low p-2">
                <img alt="Financial Dashboard" className="rounded-lg w-full h-auto shadow-2xl" src="/assets/dashboard_preview.png" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-32 bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto px-8">
            <div className="mb-20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-headline">Precision Intelligence</h2>
              <p className="text-on-surface-variant text-lg max-w-2xl font-body">Sophisticated forecasting models built for the modern institutional investor.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Feature 1: Explainable AI */}
              <div className="md:col-span-8 group relative overflow-hidden bg-surface-container-low rounded-xl p-10 transition-all duration-500 hover:bg-surface-container">
                <div className="relative z-10 h-full flex flex-col justify-between font-body">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-4 font-headline">Explainable AI</h3>
                    <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
                      No more "Black Box" decisions. Every prediction comes with a detailed causal analysis, identifying the specific market drivers and sentiment shifts that fueled the forecast.
                    </p>
                  </div>
                  <div className="mt-12 flex gap-4">
                    <span className="px-4 py-2 rounded-full bg-primary/5 text-primary text-xs font-bold border border-primary/10">CAUSAL MAPPING</span>
                    <span className="px-4 py-2 rounded-full bg-primary/5 text-primary text-xs font-bold border border-primary/10">SENTIMENT DRIFT</span>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-1/2 h-full opacity-30 group-hover:opacity-50 transition-opacity duration-700">
                  <img alt="Abstract Data Visualization" className="w-full h-full object-cover rounded-tl-xl" src="/assets/ai_visualization.png" />
                </div>
              </div>

              {/* Feature 2: Real-time insights */}
              <div className="md:col-span-4 bg-surface-container-low rounded-xl p-10 flex flex-col justify-between transition-all duration-500 hover:bg-surface-container font-body">
                <div className="w-12 h-12 rounded-2xl bg-tertiary/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 font-headline">Real-time Insights</h3>
                  <p className="text-on-surface-variant leading-relaxed">
                    Millisecond processing of global financial news, regulatory filings, and social triggers to adjust your portfolio's risk profile instantly.
                  </p>
                </div>
              </div>

              {/* Feature 3: Smart predictions */}
              <div className="md:col-span-4 bg-surface-container-low rounded-xl p-10 flex flex-col justify-between transition-all duration-500 hover:bg-surface-container font-body">
                <div className="w-12 h-12 rounded-2xl bg-secondary-container/30 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>query_stats</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 font-headline">Smart Predictions</h3>
                  <p className="text-on-surface-variant leading-relaxed">
                    Our models simulate over 10,000 market scenarios per hour to provide a weighted probability of asset movement with 94% historical accuracy.
                  </p>
                </div>
              </div>

              {/* Feature 4: The Explainable.AI's Edge */}
              <div className="md:col-span-8 bg-gradient-to-br from-surface-container-low to-slate-900 rounded-xl p-10 flex flex-col md:flex-row items-start md:items-center justify-between transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/5 font-body">
                <div className="max-w-sm">
                  <h3 className="text-2xl font-bold mb-4 font-headline">The Explainable.AI's Edge</h3>
                  <p className="text-on-surface-variant mb-6">The first platform to combine deep macro-economic analysis with micro-social sentiment in a single unified forecast engine.</p>
                  <a className="text-primary font-bold inline-flex items-center gap-2 hover:underline" href="#">
                    Read whitepaper <span className="material-symbols-outlined">arrow_forward</span>
                  </a>
                </div>
                <div className="hidden lg:block w-48 h-48 bg-primary/20 rounded-full blur-[60px]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 opacity-40"></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto px-8 relative z-10 text-center glass-panel rounded-xl py-24 shadow-2xl border border-white/5"
          >
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-8 font-headline">Ready to see the future?</h2>
            <p className="text-xl text-on-surface-variant mb-12 max-w-2xl mx-auto font-body">Join the top 1% of quantitative traders leveraging Financial Forecast AI for their daily alpha generation.</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link to="/signup" className="bg-primary text-[#001a41] font-bold px-12 py-5 rounded-full hover:bg-primary-fixed transition-colors text-lg">Create Free Account</Link>
              <button className="px-12 py-5 rounded-full font-bold border border-outline hover:bg-white/5 transition-colors text-lg">Contact Sales</button>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default Home;
