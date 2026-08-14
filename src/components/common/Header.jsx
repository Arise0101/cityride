import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Bus, Shield, UserCheck, Bell, Activity, LogOut, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Header() {
  const { userRole, currentUser, logout } = useAuth();
  const { notifications, isDemoSimulating, setIsDemoSimulating, toastAlert } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/90 px-3 xs:px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Bus className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg md:text-xl font-black tracking-wider text-slate-900">
                CITY<span className="text-blue-600">RIDE</span>
              </span>
              <span className="hidden xs:inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {userRole === 'admin' ? 'ADMIN' : userRole === 'driver' ? 'DRIVER' : 'PASSENGER'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold hidden sm:block">"Your City. Your Bus. Your Ride."</p>
          </div>
        </div>

        {/* Authenticated User Profile Pill & Actions */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Demo GPS Simulation Toggle */}
          <button
            onClick={() => setIsDemoSimulating(!isDemoSimulating)}
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              isDemoSimulating
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
            title="Toggle Live Simulated Telemetry"
          >
            <span className={`w-2 h-2 rounded-full ${isDemoSimulating ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
            <Activity className="w-3.5 h-3.5" />
            <span>GPS: {isDemoSimulating ? 'LIVE FEED' : 'PAUSED'}</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex items-center justify-center min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Bell className="w-4 h-4 md:w-5 md:h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4.5 h-4.5 rounded-full bg-blue-600 text-white font-extrabold text-[10px] flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {showNotifications && (
              <>
                {/* Backdrop for mobile */}
                <div 
                  className="fixed inset-0 bg-black/20 z-40 sm:hidden" 
                  onClick={() => setShowNotifications(false)}
                />
                <div className="fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-auto sm:top-full sm:right-0 sm:mt-3 w-full sm:w-96 bg-white border-t sm:border border-slate-200 rounded-t-2xl sm:rounded-2xl p-4 shadow-card-hover z-50 animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-blue-600" />
                      <h4 className="font-bold text-sm text-slate-900">Live Notifications</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                      FCM REALTIME
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 max-h-72 sm:max-h-80 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 py-4 text-center">No new notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{n.title}</span>
                            <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                          </div>
                          <p className="text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Pill & Sign Out Button */}
          <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200 ml-1">
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-extrabold text-xs text-slate-900">{currentUser?.name || 'User'}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">{userRole}</span>
            </div>

            <button
              onClick={logout}
              className="flex items-center justify-center min-w-[44px] min-h-[44px] p-2 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 border border-slate-200 text-slate-600 transition-colors gap-1.5 text-xs font-bold"
              title="Sign Out / Switch Role"
            >
              <LogOut className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification Banner */}
      {toastAlert && (
        <div className="fixed left-3 right-3 bottom-20 md:bottom-6 md:left-auto md:right-6 z-50 max-w-sm bg-white border border-blue-200 rounded-2xl p-4 shadow-card-hover flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4">
          {toastAlert.type === 'warning' ? (
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <h5 className="font-bold text-sm text-slate-900">{toastAlert.title}</h5>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toastAlert.message}</p>
          </div>
        </div>
      )}
    </header>
  );
}
