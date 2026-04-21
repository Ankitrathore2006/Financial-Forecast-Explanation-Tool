import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login } from '../services/api';

const Login = () => {
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
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary/30 min-h-screen flex flex-col relative overflow-hidden items-center justify-center p-6">
      {/* Ambient Glow Effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary-container/20 blur-[150px] rounded-full pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="glass-panel rounded-xl shadow-[0_40px_60px_-15px_rgba(0,0,0,0.5)] border border-outline-variant/10 p-10 md:p-14 relative overflow-hidden">
          <div className="absolute inset-0 glow-overlay pointer-events-none"></div>

          <div className="relative z-10 mb-10 text-center">
            <div className="flex justify-center mb-6">
              <img alt="Explainable" className="h-16 w-auto object-contain" src="/logo.png" />
            </div>
            <h2 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight mb-2">Welcome Back</h2>
            <p className="text-on-surface-variant font-medium">Access your financial foresight dashboard.</p>
          </div>

          {error && (
            <div className="relative z-10 bg-error/10 border border-error/20 text-error p-4 rounded-xl mb-6 text-sm text-center font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="font-label text-sm font-semibold text-on-surface-variant ml-1 tracking-wide" htmlFor="email">Email Address</label>
              <div className="relative group">
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-slate-500 focus:ring-1 focus:ring-primary/40 focus:bg-white/10 transition-all outline-none"
                  id="email"
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="absolute inset-0 rounded-xl border border-outline-variant/10 pointer-events-none group-focus-within:border-primary/20"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="font-label text-sm font-semibold text-on-surface-variant tracking-wide" htmlFor="password">Password</label>
                <a className="text-xs font-bold text-primary hover:text-primary-container transition-colors" href="#">Forgot Password?</a>
              </div>
              <div className="relative group">
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-slate-500 focus:ring-1 focus:ring-primary/40 focus:bg-white/10 transition-all outline-none"
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="absolute inset-0 rounded-xl border border-outline-variant/10 pointer-events-none group-focus-within:border-primary/20"></div>
              </div>
            </div>
            <button
              disabled={loading}
              className="w-full py-5 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-headline font-bold text-lg rounded-full shadow-[0_10px_30px_-10px_rgba(75,142,255,0.4)] hover:shadow-[0_15px_40px_-10px_rgba(75,142,255,0.6)] active:scale-[0.98] transition-all duration-300 disabled:opacity-50"
              type="submit"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-on-surface-variant font-medium relative z-10">
            New to Explainable AI? <Link className="text-primary font-bold hover:underline underline-offset-4" to="/signup">Create an account</Link>
          </p>
        </div>

        <div className="mt-8 text-center">
          <p className="font-label text-xs text-outline tracking-wider uppercase opacity-50">© 2024 Explainable. DATA-DRIVEN FORESIGHT.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
