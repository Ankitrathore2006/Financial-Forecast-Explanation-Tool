import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const MobileNav = () => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');

  if (!isAuthenticated) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-4 bg-[#111417]/90 backdrop-blur-2xl rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,122,255,0.05)] border-t border-white/5">
      <Link 
        to="/dashboard" 
        className={`flex flex-col items-center px-6 py-2 transition-all ${location.pathname === '/dashboard' ? 'bg-gradient-to-br from-[#adc6ff] to-[#4b8eff] text-black rounded-full shadow-[0_0_20px_rgba(173,198,255,0.2)]' : 'text-[#c1c6d7]'}`}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/dashboard' ? "'FILL' 1" : "" }}>dashboard</span>
        <span className="text-[10px] font-medium tracking-wide font-body">Dashboard</span>
      </Link>
      <Link 
        to="/" 
        className={`flex flex-col items-center px-6 py-2 transition-all ${location.pathname === '/' ? 'text-[#adc6ff]' : 'text-[#c1c6d7]'}`}
      >
        <span className="material-symbols-outlined">home</span>
        <span className="text-[10px] font-medium tracking-wide font-body">Home</span>
      </Link>
      <div className="flex flex-col items-center text-[#c1c6d7] px-6 py-2 opacity-50">
        <span className="material-symbols-outlined">account_circle</span>
        <span className="text-[10px] font-medium tracking-wide font-body">Profile</span>
      </div>
    </nav>
  );
};

export default MobileNav;
