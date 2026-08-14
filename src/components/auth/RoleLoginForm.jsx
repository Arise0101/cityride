import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bus, User, Shield, Lock, Mail, Eye, EyeOff, ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function RoleLoginForm() {
  const { selectedRoleForLogin, login, backToRoleSelection, demoUsers } = useAuth();

  const role = selectedRoleForLogin || 'customer';

  // Form Field State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-fill demo credentials
  const fillDemoCredentials = () => {
    const demo = demoUsers[role];
    if (demo) {
      setIdentifier(demo.email || demo.driverId);
      setPassword('demo12345');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      login(role, { identifier, password });
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Background Graphic Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Bar with Back Button */}
      <header className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-between py-2">
        <button
          onClick={backToRoleSelection}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to role selection</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            <Bus className="w-5 h-5" />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-wider">
            CITY<span className="text-blue-600">RIDE</span>
          </span>
        </div>
      </header>

      {/* Center Layout: Split on Desktop / Centered Card */}
      <main className="relative z-10 max-w-4xl mx-auto w-full my-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Branding Illustration & Info (Desktop) */}
          <div className="md:col-span-5 space-y-6 hidden md:block">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-extrabold uppercase tracking-wider">
              {role === 'admin' ? 'SYSTEM MANAGEMENT' : role === 'driver' ? 'TELEMETRY DISPATCH' : 'PASSENGER HUB'}
            </div>

            <h2 className="text-3xl font-black text-slate-900 leading-tight">
              {role === 'customer' && "Travel Smarter with CityRide Real-Time Radar"}
              {role === 'driver' && "Broadcast Live GPS & Control Shift Schedules"}
              {role === 'admin' && "Secure Central Transit Command Center"}
            </h2>

            <p className="text-xs text-slate-600 leading-relaxed">
              Experience modern urban transportation with automated AI route navigation, live 5G telemetry, and intelligent Lost & Found.
            </p>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card-soft space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Encrypted Session Credentials</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Supabase Auth & Role Authorization Ready</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dedicated Login Card */}
          <div className="md:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft space-y-6 relative">

              {/* Security Badge for Admin */}
              {role === 'admin' && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold w-full justify-center">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>🔒 Secure Administrator Access</span>
                </div>
              )}

              {/* Form Title & Subtitle */}
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-black text-slate-900">
                  {role === 'customer' && "Welcome Back"}
                  {role === 'driver' && "Driver Login"}
                  {role === 'admin' && "Administrator Login"}
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {role === 'customer' && "Sign in to continue your CityRide journey."}
                  {role === 'driver' && "Sign in to manage your trips."}
                  {role === 'admin' && "Secure access to CityRide management."}
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                {/* Field 1: Email / Phone / Driver ID */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">
                    {role === 'customer' && "Email / Phone Number"}
                    {role === 'driver' && "Driver ID / Email"}
                    {role === 'admin' && "Admin Email"}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={
                        role === 'customer' ? 'customer@cityride.demo' :
                        role === 'driver' ? 'DRV-102 or driver@cityride.demo' :
                        'admin@cityride.demo'
                      }
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors font-medium text-xs sm:text-sm"
                    />
                  </div>
                </div>

                {/* Field 2: Password with Eye Toggle */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors font-medium text-xs sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Options: Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-1">
                  {role === 'customer' && (
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 accent-blue-600 rounded"
                      />
                      <span>Remember me</span>
                    </label>
                  )}

                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link sent to registered email!"); }} className="text-blue-600 font-bold hover:underline ml-auto">
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm tracking-wider shadow-electric-glow transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span>Signing in...</span>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>

                {/* Customer Account Creation Link */}
                {role === 'customer' && (
                  <div className="text-center pt-2 text-xs text-slate-500">
                    Don't have an account?{' '}
                    <button type="button" onClick={fillDemoCredentials} className="text-blue-600 font-bold hover:underline">
                      Create Account
                    </button>
                  </div>
                )}
              </form>

              {/* Discrete Demo Credentials Shortcut Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Testing in Demo Mode?</span>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  <span>Auto-fill Demo Credentials</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-5xl mx-auto w-full text-center py-2 text-xs text-slate-400">
        © 2026 CITYRIDE • Unified Mobility Platform
      </footer>
    </div>
  );
}
