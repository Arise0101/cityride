import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Bus, MapPin, Clock, AlertTriangle, Sparkles, Navigation, ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react';
import { predictETAWithAI } from '../../services/aiService';

export default function BusSearchAndDetails({ onNavigate }) {
  const { buses, routes, stops, setSelectedBusForTracking, selectedBusForTracking } = useApp();

  const [activeTab, setActiveTab] = useState('search');
  const [selectedBus, setSelectedBus] = useState(selectedBusForTracking || buses[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBuses = buses.filter(b =>
    b.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.routeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const aiPrediction = predictETAWithAI({
    bus: selectedBus,
    targetStop: selectedBus.nextStopName,
    trafficLevel: selectedBus.status === 'delayed' ? 'heavy' : 'moderate'
  });

  const activeRoute = routes.find(r => r.id === selectedBus.routeId) || routes[0];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in pb-16 md:pb-12">
      {/* Top Header Selector */}
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
        {activeTab === 'details' ? (
          <button
            onClick={() => setActiveTab('search')}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2.5 rounded-xl bg-white border border-slate-200 shadow-card-soft touch-target"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Bus List</span>
          </button>
        ) : (
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-slate-900">Route & Bus Explorer</h2>
            <p className="text-xs text-slate-500 mt-0.5">Search live city routes and check arrival schedules</p>
          </div>
        )}

        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-card-soft w-full xs:w-auto">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 xs:flex-none px-3 py-2 rounded-lg text-xs font-bold transition-colors ${activeTab === 'search' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            SEARCH ROUTES
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 xs:flex-none px-3 py-2 rounded-lg text-xs font-bold transition-colors ${activeTab === 'details' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            BUS DETAILS
          </button>
        </div>
      </div>

      {activeTab === 'search' ? (
        <div className="space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Bus number, Route name, or Stop..."
              className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 shadow-card-soft"
            />
          </div>

          {/* Bus Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {filteredBuses.map((bus) => (
              <div
                key={bus.id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-card-soft hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-xl bg-blue-600 text-white font-extrabold text-xs">
                      {bus.busNumber}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      bus.status === 'delayed' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {bus.status.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mt-3">{bus.routeName}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Route: <span className="text-slate-800">{activeRoute.startStop} → {activeRoute.endStop}</span>
                  </p>

                  <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 text-[10px] block">Next Arrival</span>
                      <strong className="text-emerald-600 font-bold text-sm">{bus.etaMins} mins</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 text-[10px] block">Speed</span>
                      <strong className="text-slate-900 font-bold text-sm">{bus.speedKmh} km/h</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 flex flex-col xs:flex-row items-stretch xs:items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedBus(bus);
                      setActiveTab('details');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 transition-colors touch-target"
                  >
                    View Details & AI ETA
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBusForTracking(bus);
                      onNavigate('live-tracking');
                    }}
                    className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-electric-glow flex items-center justify-center gap-1.5 touch-target"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Track Map</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Detailed Bus View */
        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          {/* Main Bus Status Banner */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-card-hover relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="w-full sm:w-auto">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3.5 py-1 rounded-xl bg-blue-600 font-extrabold text-white text-sm shadow-md">
                    {selectedBus.busNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-400">Reg: {selectedBus.registrationNumber}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="hidden xs:inline">LIVE</span> TELEMETRY
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white mt-3">{selectedBus.routeName}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Driver: <span className="text-slate-200 font-bold">{selectedBus.driverName}</span> • {selectedBus.currentOccupancy}/{selectedBus.capacity} pax
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedBusForTracking(selectedBus);
                  onNavigate('live-tracking');
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-electric-glow flex items-center justify-center gap-2 touch-target"
              >
                <Navigation className="w-4 h-4" />
                <span>OPEN LIVE MAP</span>
              </button>
            </div>

            {/* AI Predicted Arrival Card */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-950/80 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">AI Predicted Arrival</div>
                  <div className="text-base sm:text-lg font-extrabold text-white">
                    Arriving at {selectedBus.nextStopName} in ~{aiPrediction.predictedArrivalMins} min
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Delay: <span className="text-amber-400 font-semibold">+{aiPrediction.expectedDelayMins} min</span> • Confidence: {(aiPrediction.confidenceScore * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              <span className="px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono text-[10px] sm:text-xs font-bold whitespace-nowrap">
                XGBoost Verified
              </span>
            </div>
          </div>

          {/* Upcoming Stops Timeline */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-card-soft">
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>Route Stop Timeline & Live Progress</span>
            </h4>

            <div className="space-y-3 sm:space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {activeRoute.stops.map((stop, idx) => {
                const isPassed = idx < (selectedBus.currentStopIndex || 0);
                const isCurrent = idx === (selectedBus.currentStopIndex || 0);

                return (
                  <div key={stop.id} className="relative flex items-start gap-3 sm:gap-4 pl-8">
                    <div className={`absolute left-1.5 top-1 -translate-x-1/2 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      isCurrent
                        ? 'bg-blue-500 border-white shadow-electric-glow'
                        : isPassed
                        ? 'bg-slate-300 border-slate-200'
                        : 'bg-white border-slate-300'
                    }`}>
                      {isPassed && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                    </div>

                    <div className="flex-1 p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-slate-900 flex flex-wrap items-center gap-2">
                          <span>{stop.name}</span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 text-[9px] bg-blue-600 text-white rounded font-extrabold uppercase">
                              NEXT STOP
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">Stop Code: ST-{100 + idx}</div>
                      </div>

                      <div className="text-xs font-bold text-slate-700">
                        {isPassed ? 'Passed' : isCurrent ? `~${aiPrediction.predictedArrivalMins} mins` : `+${(idx - (selectedBus.currentStopIndex || 0)) * 6} mins`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
