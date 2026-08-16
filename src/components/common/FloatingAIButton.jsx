import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Bot } from 'lucide-react';

export default function FloatingAIButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide floating button on /ai page itself to avoid duplication
  if (location.pathname === '/ai') {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-5 z-[2000] animate-bounce-slow">
      <button
        onClick={() => navigate('/ai')}
        className="group relative flex items-center justify-center w-13 h-13 p-3.5 rounded-full bg-slate-900 hover:bg-blue-600 text-white shadow-2xl border-2 border-indigo-400/50 hover:border-white transition-all duration-300 transform hover:scale-110 active:scale-95 touch-target"
        title="Open CityRide AI Assistant"
      >
        {/* Glow Ring */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 opacity-40 group-hover:opacity-100 blur-sm transition-opacity pointer-events-none" />

        {/* Floating AI Icon */}
        <div className="relative z-10 flex items-center justify-center">
          <Bot className="w-6 h-6 text-indigo-300 group-hover:text-white transition-colors" />
          <Sparkles className="w-3.5 h-3.5 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
        </div>

        {/* Hover Tooltip Pill */}
        <span className="absolute right-full mr-3 hidden sm:group-hover:flex items-center px-3 py-1.5 rounded-xl bg-slate-950 text-white text-xs font-black whitespace-nowrap shadow-xl border border-slate-800 animate-fade-in pointer-events-none">
          ✨ Ask CityRide AI
        </span>
      </button>
    </div>
  );
}
