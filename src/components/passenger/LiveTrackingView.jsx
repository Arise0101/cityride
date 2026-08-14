import React from 'react';
import { useApp } from '../../context/AppContext';
import LiveBusMap from '../maps/LiveBusMap';
import { Navigation, RefreshCw, Bus, Clock } from 'lucide-react';

export default function LiveTrackingView() {
  const { buses, routes, stops, selectedBusForTracking, setSelectedBusForTracking, isDemoSimulating, setIsDemoSimulating } = useApp();

  const activeBus = selectedBusForTracking || buses[0];
  const activeRoute = routes.find(r => r.id === activeBus.routeId) || routes[0];

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-12">
      {/* Top Map Action Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-card-soft">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 md:w-10 md:h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
            <Navigation className="w-6 h-6 md:w-5 md:h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg md:text-base font-extrabold text-slate-900">Real-Time City Bus Radar</h2>
            <p className="text-sm md:text-xs text-slate-500">5G Telemetry & WebSocket Live Stream</p>
          </div>
        </div>

        {/* Bus Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <select
            value={activeBus?.id || ''}
            onChange={(e) => {
              const b = buses.find(x => x.id === e.target.value);
              if (b) setSelectedBusForTracking(b);
            }}
            className="px-4 py-3 min-h-[44px] rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm md:text-xs font-bold focus:outline-none focus:border-blue-500 w-full md:w-auto"
          >
            {buses.map(b => (
              <option key={b.id} value={b.id}>
                {b.busNumber} — {b.routeName}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsDemoSimulating(!isDemoSimulating)}
            className={`p-3 min-h-[44px] rounded-xl border text-sm md:text-xs font-bold flex items-center justify-center gap-2 transition-all w-full sm:w-auto ${
              isDemoSimulating ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
            title="Toggle Live Telemetry Simulation"
          >
            <RefreshCw className={`w-5 h-5 md:w-4 md:h-4 ${isDemoSimulating ? 'animate-spin' : ''}`} />
            <span className="sm:hidden">Toggle Simulation</span>
          </button>
        </div>
      </div>

      {/* Main Full-Screen Map Area */}
      <div className="relative flex flex-col md:block">
        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[620px] rounded-2xl overflow-hidden relative z-0">
          <LiveBusMap
            buses={buses}
            routes={routes}
            stops={stops}
            selectedBus={activeBus}
            selectedRoute={activeRoute}
            onSelectBus={(bus) => setSelectedBusForTracking(bus)}
            height="100%"
            zoom={14}
          />
        </div>

        {/* Floating / Stacked Live Telemetry Overlay Card */}
        {activeBus && (
          <div className="mt-4 md:mt-0 md:absolute md:bottom-6 md:left-6 md:right-auto w-full md:max-w-sm bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-5 shadow-card-hover z-[1000]">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1.5 min-w-[44px] text-center bg-blue-600 text-white font-black text-xs rounded-lg shadow-sm">
                {activeBus.busNumber}
              </span>
              <span className={`text-[10px] md:text-xs font-extrabold px-3 py-1 rounded-full border ${
                activeBus.status === 'delayed'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {activeBus.status === 'delayed' ? 'DELAYED (+8m)' : '● LIVE TELEMETRY'}
              </span>
            </div>

            <h4 className="font-extrabold text-base text-slate-900 mt-3">{activeBus.routeName}</h4>
            <p className="text-sm text-slate-500 mt-1">Heading to: <strong className="text-slate-800">{activeBus.nextStopName}</strong></p>

            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 text-center">
              <div>
                <span className="text-xs text-slate-500 block font-medium">ETA</span>
                <strong className="text-emerald-600 text-base md:text-sm font-extrabold">{activeBus.etaMins} mins</strong>
              </div>
              <div>
                <span className="text-xs text-slate-500 block font-medium">Speed</span>
                <strong className="text-slate-900 text-base md:text-sm font-extrabold">{activeBus.speedKmh} km/h</strong>
              </div>
              <div>
                <span className="text-xs text-slate-500 block font-medium">Pass.</span>
                <strong className="text-slate-900 text-base md:text-sm font-extrabold">{activeBus.currentOccupancy}/{activeBus.capacity}</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
