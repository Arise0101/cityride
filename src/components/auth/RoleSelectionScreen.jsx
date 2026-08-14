import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bus, User, Shield, ArrowRight, Sparkles } from 'lucide-react';

export default function RoleSelectionScreen() {
  const { selectRole } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-3 xs:p-4 sm:p-6 lg:p-8 relative overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Background Art */}
      <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Branding */}
      <header className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Bus className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-wider text-slate-900">
            CITY<span className="text-blue-600">RIDE</span>
          </span>
        </div>

        <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-full text-[10px] sm:text-xs font-bold text-slate-600 shadow-sm flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>SMART TRANSIT</span>
        </span>
      </header>

      {/* Main Role Selection Container */}
      <main className="relative z-10 max-w-5xl mx-auto w-full my-auto py-6 sm:py-12 text-center animate-fade-in">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[11px] sm:text-xs font-bold mb-3 sm:mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>NEXT-GEN URBAN MOBILITY PLATFORM</span>
        </div>

        <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
          CITY<span className="text-blue-600">RIDE</span>
        </h1>
        <p className="text-sm xs:text-base sm:text-xl font-semibold text-slate-600 mt-1 sm:mt-2 italic">
          "Your City. Your Bus. Your Ride."
        </p>

        <div className="mt-6 sm:mt-10 mb-4 sm:mb-8">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400">Continue as</h2>
        </div>

        {/* 3 Large Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left">
          {/* CUSTOMER CARD */}
          <button
            onClick={() => selectRole('customer')}
            className="group relative p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-card-soft hover:shadow-card-hover hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between touch-target"
          >
            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <User className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-blue-600 block mb-1">Passenger / Customer</span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">CUSTOMER</h3>
              <p className="text-xs text-slate-500 mt-2 sm:mt-3 leading-relaxed">
                Find buses, track rides live on the interactive map, and plan your urban journey with AI.
              </p>
            </div>

            <div className="mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-blue-600 group-hover:translate-x-1 transition-transform">
              <span>Sign in as Customer</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* DRIVER CARD */}
          <button
            onClick={() => selectRole('driver')}
            className="group relative p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-card-soft hover:shadow-card-hover hover:border-emerald-500/50 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between touch-target"
          >
            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Bus className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-emerald-600 block mb-1">Driver</span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">DRIVER</h3>
              <p className="text-xs text-slate-500 mt-2 sm:mt-3 leading-relaxed">
                Manage your shift trips, broadcast real-time GPS telemetry, and report route incidents.
              </p>
            </div>

            <div className="mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-emerald-600 group-hover:translate-x-1 transition-transform">
              <span>Sign in as Driver</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* ADMIN CARD */}
          <button
            onClick={() => selectRole('admin')}
            className="group relative p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-card-soft hover:shadow-card-hover hover:border-indigo-500/50 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between touch-target"
          >
            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-indigo-600 block mb-1">Administrator</span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">ADMIN</h3>
              <p className="text-xs text-slate-500 mt-2 sm:mt-3 leading-relaxed">
                Full fleet oversight, driver assignment, route sequence configuration, and AI analytics.
              </p>
            </div>

            <div className="mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>Sign in as Administrator</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full text-center py-3 border-t border-slate-200/80 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>© 2026 CITYRIDE Platform. All rights reserved.</div>
        <div className="flex items-center gap-3 text-slate-400 font-medium text-[11px]">
          <span>Supabase Auth</span>
          <span>•</span>
          <span>Role Based Authorization</span>
        </div>
      </footer>
    </div>
  );
}
