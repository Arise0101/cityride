import React, { useState } from 'react';
import { Bus, Navigation, MapPin, Sparkles, ArrowRight } from 'lucide-react';

export default function SplashAndOnboarding({ onComplete }) {
  const [step, setStep] = useState(0); // 0: Splash, 1: Screen 1, 2: Screen 2, 3: Screen 3

  const onboardingScreens = [
    {
      icon: <MapPin className="w-12 h-12 text-blue-400" />,
      title: "Find Your Bus",
      subtitle: "Discover nearby stops, view scheduled departure times, and search city routes effortlessly."
    },
    {
      icon: <Navigation className="w-12 h-12 text-emerald-400" />,
      title: "Track in Real Time",
      subtitle: "Watch live bus locations move on the interactive map with 5G telemetry precision."
    },
    {
      icon: <Sparkles className="w-12 h-12 text-indigo-400" />,
      title: "Travel Smarter",
      subtitle: "Get Gemini AI-powered route suggestions, traffic delay predictions, and smart Lost & Found assistance."
    }
  ];

  if (step === 0) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Glowing Background Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-glow-blue mb-8 border border-white/20">
            <Bus className="w-12 h-12 text-white animate-bus-drive" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-wider text-white">
            CITY<span className="text-blue-500">RIDE</span>
          </h1>

          <p className="text-lg text-slate-300 font-semibold mt-3 italic tracking-wide">
            "Your City. Your Bus. Your Ride."
          </p>

          <p className="text-sm text-slate-400 max-w-sm mt-4 leading-relaxed">
            The Next-Generation AI Powered Smart City Transportation Platform.
          </p>

          <button
            onClick={() => setStep(1)}
            className="mt-10 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-base rounded-2xl shadow-glow-blue flex items-center gap-3 transform hover:scale-105 transition-all"
          >
            <span>GET STARTED</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  const currentScreen = onboardingScreens[step - 1];

  return (
    <div className="min-h-[85vh] flex flex-col justify-between p-6 sm:p-10 glass-panel rounded-3xl border border-slate-800 shadow-2xl relative">
      {/* Top Header: Skip */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Step {step} of 3</span>
        <button
          onClick={onComplete}
          className="text-xs font-bold text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800"
        >
          SKIP
        </button>
      </div>

      {/* Center Screen Content */}
      <div className="my-auto flex flex-col items-center text-center py-10 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="w-24 h-24 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-center shadow-xl mb-6">
          {currentScreen.icon}
        </div>
        <h2 className="text-3xl font-extrabold text-slate-100">{currentScreen.title}</h2>
        <p className="text-slate-400 max-w-md mt-3 text-sm sm:text-base leading-relaxed">
          {currentScreen.subtitle}
        </p>
      </div>

      {/* Bottom Step Indicator & Actions */}
      <div>
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-blue-500' : 'w-2 bg-slate-800'
              }`}
            ></div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-800"
            >
              BACK
            </button>
          )}

          <button
            onClick={() => {
              if (step < 3) setStep(step + 1);
              else onComplete();
            }}
            className="flex-1 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-glow-blue flex items-center justify-center gap-2"
          >
            <span>{step === 3 ? "EXPLORE CITYRIDE" : "NEXT"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
