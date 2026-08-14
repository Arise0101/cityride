import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Bell, Bookmark, History, Shield, LogOut, Check, Star, Settings, Phone, Mail } from 'lucide-react';

export default function PassengerProfile() {
  const { currentUser, routes, stops } = useApp();

  const [notificationsEnabled, setNotificationsEnabled] = useState({
    busArrival: true,
    delays: true,
    serviceAlerts: true,
    lostFoundMatches: true
  });

  const travelHistory = [
    { id: 1, route: 'R102 - Airport Express', date: 'Today, 08:30 AM', fare: '$2.50', duration: '32 mins', status: 'Completed' },
    { id: 2, route: 'R204 - Metro Tech Corridor', date: 'Yesterday, 05:15 PM', fare: '$2.50', duration: '20 mins', status: 'Completed' },
    { id: 3, route: 'R305 - Harbor & Beach Loop', date: 'Aug 09, 02:40 PM', fare: '$3.00', duration: '28 mins', status: 'Completed' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 animate-fade-in pb-16 md:pb-12">
      {/* Profile Card Header */}
      <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-card-hover flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-white">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-1 flex-shrink-0 shadow-electric-glow">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500"
            alt={currentUser?.name || 'Passenger'}
            className="w-full h-full rounded-[14px] sm:rounded-[22px] object-cover"
          />
        </div>

        <div className="flex-1 text-center sm:text-left w-full">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{currentUser?.name || 'Alex Morgan'}</h2>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">PASSENGER ACCOUNT • PREMIUM TRANSIT PASS</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              PASS ACTIVE
            </span>
          </div>

          <div className="mt-4 flex flex-col xs:flex-row items-center justify-center sm:justify-start gap-2 xs:gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-blue-400" /> {currentUser?.email || 'customer@cityride.demo'}</span>
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-blue-400" /> +1 (555) 012-7788</span>
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Saved Routes & Favorite Stops */}
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-card-soft space-y-4">
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-blue-600" />
            <span>Favorite Routes & Stops</span>
          </h3>

          <div className="space-y-2.5">
            {routes.slice(0, 2).map(r => (
              <div key={r.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-xs text-blue-600">{r.routeNumber}</span>
                  <div className="font-bold text-sm text-slate-900 mt-0.5">{r.routeName}</div>
                </div>
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              </div>
            ))}
          </div>
        </div>

        {/* FCM Notification Settings */}
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-card-soft space-y-4">
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            <span>Notification Preferences (FCM)</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            {Object.entries({
              busArrival: 'Bus Arrival Proximity Alerts',
              delays: 'Route Delay & Detour Notifications',
              serviceAlerts: 'System Maintenance Alerts',
              lostFoundMatches: 'Lost & Found AI Matches'
            }).map(([key, label]) => (
              <label key={key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <span className="font-semibold text-slate-800 pr-2">{label}</span>
                <input
                  type="checkbox"
                  checked={notificationsEnabled[key]}
                  onChange={(e) => setNotificationsEnabled({ ...notificationsEnabled, [key]: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded touch-target"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Travel History */}
      <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-card-soft space-y-4">
        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
          <History className="w-5 h-5 text-emerald-600" />
          <span>Recent Travel History</span>
        </h3>

        <div className="space-y-2.5">
          {travelHistory.map(item => (
            <div key={item.id} className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">{item.route}</h4>
                <p className="text-slate-500 mt-0.5">{item.date} • {item.duration}</p>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-emerald-600 text-sm">{item.fare}</span>
                <span className="block text-[10px] text-slate-500 uppercase mt-0.5">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
