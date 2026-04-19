import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { register } from '../services/api';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password, name);
      navigate('/login');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary/30 min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-6">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary/5 blur-[100px] rounded-full pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <img alt="Luminous Oracle Logo" className="w-12 h-12 object-contain shadow-lg shadow-primary/10" src="/logo.png" />
            <h1 className="font-headline text-3xl font-black tracking-tighter text-primary">Luminous Oracle</h1>
          </div>
          <p className="text-on-surface-variant font-medium tracking-wide">Enter the realm of predictive clarity.</p>
        </div>

        <div className="glass-panel rounded-xl p-10 md:p-14 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] border border-outline-variant/10 ring-1 ring-white/5 relative overflow-hidden">
          <div className="absolute inset-0 glow-overlay pointer-events-none"></div>

          <header className="mb-10 relative z-10">
            <h2 className="font-headline text-2xl font-bold mb-2">Create your account</h2>
            <p className="text-on-surface-variant text-sm">Join the elite network of data-driven architects.</p>
          </header>

          {error && (
            <div className="relative z-10 bg-error/10 border border-error/20 text-error p-4 rounded-xl mb-6 text-sm text-center font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="block font-label text-xs font-semibold tracking-widest text-on-surface-variant/80 ml-1">FULL NAME</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </div>
                <input
                  className="w-full bg-white/5 border border-white/10 ring-1 ring-white/5 focus:ring-2 focus:ring-primary/40 focus:bg-white/10 rounded-lg py-4 pl-14 pr-6 text-white placeholder:text-slate-500 transition-all duration-300 outline-none"
                  placeholder="Financial Architect"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block font-label text-xs font-semibold tracking-widest text-on-surface-variant/80 ml-1">EMAIL ADDRESS</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">alternate_email</span>
                </div>
                <input
                  className="w-full bg-white/5 border border-white/10 ring-1 ring-white/5 focus:ring-2 focus:ring-primary/40 focus:bg-white/10 rounded-lg py-4 pl-14 pr-6 text-white placeholder:text-slate-500 transition-all duration-300 outline-none"
                  placeholder="name@luminousoracle.ai"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block font-label text-xs font-semibold tracking-widest text-on-surface-variant/80 ml-1">PASSWORD</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">lock_open</span>
                </div>
                <input
                  className="w-full bg-white/5 border border-white/10 ring-1 ring-white/5 focus:ring-2 focus:ring-primary/40 focus:bg-white/10 rounded-lg py-4 pl-14 pr-14 text-white placeholder:text-slate-500 transition-all duration-300 outline-none"
                  placeholder="••••••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>
            <div className="pt-4">
              <button
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary-container font-headline font-extrabold text-sm tracking-widest rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? 'INITIALIZING...' : 'INITIALIZE ARCHITECT PROFILE'}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </form>

          <footer className="mt-10 pt-8 border-t border-outline-variant/10 text-center space-y-4 relative z-10">
            <p className="text-sm text-on-surface-variant pt-2">
              Already a member? <Link className="text-on-surface font-bold hover:text-primary transition-colors" to="/login">Sign in here</Link>
            </p>
          </footer>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
