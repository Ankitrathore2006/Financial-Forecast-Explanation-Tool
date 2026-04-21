import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AnalysisCard = ({ title, content, defaultOpen = true, icon: Icon, color = 'blue' }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const colorMap = {
    blue: 'text-[#adc6ff] bg-[#adc6ff]/10 border-[#adc6ff]/20',
    green: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    red: 'text-error bg-error/10 border-error/20',
    purple: 'text-[#ffb595] bg-[#ffb595]/10 border-[#ffb595]/20',
    amber: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  };

  return (
    <div className="glass-panel rounded-xl overflow-hidden mb-6 border border-white/5 hover:border-white/10 transition-all shadow-xl shadow-black/20">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-surface-container-highest/20 transition-colors group"
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all group-hover:scale-110 ${colorMap[color]}`}>
            {Icon && typeof Icon === 'string' ? (
              <span className="material-symbols-outlined text-2xl">{Icon}</span>
            ) : (
              Icon && <Icon className="h-5 w-5" />
            )}
          </div>
          <h3 className="font-headline font-bold text-lg text-on-surface tracking-tight">{title}</h3>
        </div>
        <span className={`material-symbols-outlined text-outline transition-transform duration-500 ${isOpen ? 'rotate-180 text-[#adc6ff]' : ''}`}>expand_more</span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="p-8 pt-4 border-t border-white/5 text-on-surface-variant prose prose-invert prose-blue max-w-none 
              prose-p:leading-[1.8] prose-p:mb-6
              prose-li:my-3 prose-li:leading-relaxed
              prose-strong:text-white prose-strong:font-bold
              prose-headings:font-headline prose-headings:font-bold prose-headings:mb-4
              prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-6
            ">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnalysisCard;
