import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bus, User, Mail, Lock, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function RegisterForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer'); // 'customer' (passenger) | 'driver'
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Complete registration and log user in with specified role
      login(role, { name, email, password });
      setIsLoading(false);
      if (role === 'driver') {
        navigate('/driver');
      } else {
        navigate('/home');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Background Graphic Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-between py-2">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            <Bus className="w-5 h-5" />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-wider">
            CITY<span className="text-blue-600">RIDE</span>
          </span>
        </div>
      </header>

      {/* Main Registration Form Container */}
      <main className="relative z-10 max-w-md mx-auto w-full my-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft space-y-6">

          <div className="text-center sm:text-left">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-extrabold uppercase tracking-wider">
              NEW PASSENGER / DRIVER REGISTRATION
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">Create Your Account</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Join CityRide Tumakuru for live transit tracking and route navigation.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Role Selection Tabs */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Select Account Role</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    role === 'customer' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Passenger
                </button>
                <button
                  type="button"
                  onClick={() => setRole('driver')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    role === 'driver' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Driver
                </button>
              </div>
            </div>

            {/* Name Field */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors font-medium text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors font-medium text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors font-medium text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors font-medium text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm tracking-wider shadow-electric-glow transition-all flex items-center justify-center gap-2 touch-target"
            >
              {isLoading ? <span>Creating Account...</span> : <span>Create Account</span>}
            </button>
          </form>

          {/* Login Redirection Link */}
          <div className="text-center pt-2 text-xs text-slate-500 border-t border-slate-100">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-extrabold hover:underline">
              Login here
            </Link>
          </div>

        </div>
      </main>

      <footer className="relative z-10 max-w-5xl mx-auto w-full text-center py-2 text-xs text-slate-400">
        © 2026 CITYRIDE • Unified Smart Transit
      </footer>
    </div>
  );
}
