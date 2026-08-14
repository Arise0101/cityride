import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Navigation, Plus, MapPin, ArrowRight, CheckCircle2, X } from 'lucide-react';

export default function RouteAndStopManagement() {
  const { routes, stops, addRoute } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    routeNumber: '',
    routeName: '',
    startStop: 'Central Station',
    endStop: 'International Airport',
    totalDistanceKm: 12,
    estimatedDurationMins: 28
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.routeName) return;
    addRoute(formData);
    setShowAddModal(false);
    setFormData({ routeNumber: '', routeName: '', startStop: 'Central Station', endStop: 'International Airport', totalDistanceKm: 12, estimatedDurationMins: 28 });
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-full">
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <Navigation className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Route & Stop Network Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 sm:mt-0.5">Map city corridors, configure stop sequences, distance & timetables</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto min-h-[44px] px-5 py-3 rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-glow-emerald flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>CREATE NEW ROUTE</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {routes.map((route) => (
          <div key={route.id} className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl glass-card border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 sm:pb-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl font-black text-sm shrink-0">
                  {route.routeNumber}
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-white leading-tight">{route.routeName}</h3>
              </div>
              <div className="text-xs text-slate-400 font-medium bg-slate-900/50 p-2 sm:p-0 rounded-lg w-full sm:w-auto sm:bg-transparent flex sm:block items-center justify-between">
                <span>Distance: <strong className="text-slate-200">{route.totalDistanceKm} km</strong></span>
                <span className="hidden sm:inline"> • </span>
                <span>Est: <strong className="text-slate-200">{route.estimatedDurationMins} mins</strong></span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 sm:mb-3">Configured Stop Sequence:</span>
              <div className="flex flex-wrap items-center gap-2">
                {route.stops.map((stop, idx) => (
                  <React.Fragment key={stop.id || idx}>
                    <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 whitespace-nowrap">
                      {stop.name}
                    </span>
                    {idx < route.stops.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-4 sm:p-6 rounded-t-3xl sm:rounded-3xl glass-panel border border-slate-800 shadow-2xl space-y-4 max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white">Create New Route</h3>
              <button onClick={() => setShowAddModal(false)} className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-white -mr-2">
                <X className="w-5 h-5 shrink-0" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1.5">Route Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. R501"
                  value={formData.routeNumber}
                  onChange={(e) => setFormData({ ...formData, routeNumber: e.target.value })}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1.5">Route Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Downtown Financial Circular"
                  value={formData.routeName}
                  onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-300 block mb-1.5">Start Terminal</label>
                  <input
                    type="text"
                    value={formData.startStop}
                    onChange={(e) => setFormData({ ...formData, startStop: e.target.value })}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1.5">End Terminal</label>
                  <input
                    type="text"
                    value={formData.endStop}
                    onChange={(e) => setFormData({ ...formData, endStop: e.target.value })}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full min-h-[44px] py-3 mt-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-glow-emerald flex items-center justify-center transition-all"
              >
                CREATE ROUTE CORRIDOR
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
