import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LineChart, LogOut, User } from 'lucide-react';
import { logout } from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-slate-950/80 backdrop-blur-3xl text-slate-400 font-headline tracking-tight antialiased fixed top-0 w-full z-50 shadow-[0_20px_50px_rgba(8,10,12,0.4)] border-b border-white/5">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1920px] mx-auto">
        <div className="text-2xl font-extrabold tracking-tighter text-[#adc6ff]">
          <Link to="/">
            <img alt="Financial Forecast AI Logo" className="h-10 w-auto object-contain" src="/logo.png" />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className={`font-medium transition-all duration-300 px-3 py-1 rounded-full ${location.pathname === '/' ? 'text-white bg-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>Markets</Link>
          <Link to="/" className="text-slate-400 font-medium hover:text-white hover:bg-white/5 transition-all duration-300 px-3 py-1 rounded-full">Forecasts</Link>
          <Link to="/" className="text-slate-400 font-medium hover:text-white hover:bg-white/5 transition-all duration-300 px-3 py-1 rounded-full">Advisory</Link>
          {isAuthenticated && (
            <Link to="/dashboard" className={`font-medium transition-all duration-300 px-3 py-1 rounded-full ${location.pathname === '/dashboard' ? 'text-white bg-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>Dashboard</Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-6">
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-error/80 hover:text-error transition-colors uppercase tracking-widest"
              >
                Logout
              </button>
              <Link to="/dashboard" className="h-10 w-10 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant/20 hover:scale-110 transition-transform cursor-pointer">
                <img alt="User Profile Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtewDQHrieedQks-xS_DLQft4rTPK5YwlaOuQES2K0l63rwXQc8VwTqU_99NmRR9fgfOYamu8W-ZX5UaZu_bo4KDXKZsEklOHM3wZaESq0MCGMV8AS1DsMa-ZMiGR3TILn9lgzc2JNwxlJn_3cFC-6jfpY58vbBN-Gj6Ki-mV73bo4VvhlfEDDceIleDPlemv1wci8ST6te2Sc5hmW23Rzdp52b_E5-Fr7aKW8c4uFq3_mJ2boq-LNePe-2fMFK8V_GVAMqXXCALU" />
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login" className="px-6 py-2 rounded-full font-semibold text-[#adc6ff] hover:bg-white/5 transition-all duration-300 scale-95 active:opacity-80">Sign In</Link>
              <Link to="/signup" className="bg-gradient-to-r from-[#adc6ff] to-[#4b8eff] text-slate-950 px-6 py-2 rounded-full font-bold shadow-[0_0_20px_rgba(173,198,255,0.3)] transition-all duration-300 scale-95 active:opacity-80">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
