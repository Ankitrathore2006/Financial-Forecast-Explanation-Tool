import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 w-full py-12 px-8 font-body text-[10px] uppercase tracking-widest border-t border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-[1920px] mx-auto">
        <div className="text-slate-500 flex items-center gap-2">
          © 2024
          <img alt="Financial Forecast AI Logo" className="h-4 w-auto object-contain opacity-70" src="/logo.png" />
          All rights reserved.
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <a className="text-slate-500 hover:text-[#adc6ff] transition-colors underline-offset-4 hover:underline" href="#">Privacy Policy</a>
          <a className="text-slate-500 hover:text-[#adc6ff] transition-colors underline-offset-4 hover:underline" href="#">Terms of Service</a>
          <a className="text-slate-500 hover:text-[#adc6ff] transition-colors underline-offset-4 hover:underline" href="#">SEC Compliance</a>
          <a className="text-slate-500 hover:text-[#adc6ff] transition-colors underline-offset-4 hover:underline" href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
