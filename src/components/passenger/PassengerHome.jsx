import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getTimeAwareGreeting } from '../../utils/greeting';
import LiveBusMap from '../maps/LiveBusMap';
import {
  Search, MapPin, Bus, Navigation, Bot, ArrowRight, Clock, ShieldCheck,
  ChevronRight, Sparkles, Compass
} from 'lucide-react';

export default function PassengerHome({ onNavigate }) {
  const { buses, stops, routes, setSelectedBusForTracking } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);

  // Time-aware greeting
  const greeting = getTimeAwareGreeting();

  const filteredBuses = buses.filter(b =>
    b.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.routeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close search suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Quick search suggestions with intent categories
  const searchSuggestions = {
    popularDestinations: ['Tumakuru KSRTC Bus Stand', 'Tumakuru Railway Station', 'SIT College Campus', 'SSIT Siddhartha Campus'],
    busRoutes: ['R101 - Kyatsandra Line', 'R102 - SSIT College Line', 'R103 - Siddaganga Math Shuttle'],
    nearbyStops: ['near bus stop', 'ST-101 - Tumakuru Bus Stand', 'ST-102 - B.H. Road Junction', 'ST-103 - SIT Campus Gate']
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-20 md:pb-12">

      {/* DASHBOARD HERO SECTION WITH MODERN NAVY-BLUE-TEAL GRADIENT & VECTOR TRANSIT GRAPHICS */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-card-hover overflow-hidden text-white">
        {/* Subtle Navy-Blue-Teal Vector Glow */}
        <div className="absolute -right-16 -top-16 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Low-Opacity Geometric Transit Line Grid */}
        <svg className="absolute inset-0 w-full h-full stroke-slate-800/40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0 80 Q 300 10 600 100 T 1200 40" fill="none" strokeWidth="1.5" strokeDasharray="6 6" />
          <path d="M 0 180 Q 450 60 900 220" fill="none" strokeWidth="1.5" strokeDasharray="8 8" />
        </svg>

        <div className="relative z-10 max-w-2xl">
          {/* Smart City Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-extrabold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            TUMAKURU SMART TRANSIT • LIVE RADAR
          </div>

          {/* Time-Aware Greeting & Prompt */}
          <h1 className="text-2xl xs:text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2">
            <span>{greeting.text} 👋</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-1.5 font-bold text-teal-400">
            Where do you want to go today?
          </p>

          {/* VISUALLY PROMINENT SEARCH BAR WITH INTENT DROPDOWN */}
          <div ref={searchRef} className="relative mt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destination, bus stop, or route (e.g. 'near bus stop', 'BUS-101')..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-950/90 border border-slate-700/80 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-base font-medium shadow-inner transition-all"
              />
            </div>

            {/* Suggestions Dropdown on Focus */}
            {isSearchFocused && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white text-slate-900 border border-slate-200 rounded-2xl p-4 shadow-card-hover z-50 animate-fade-in text-xs space-y-3">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" /> Nearby Bus Stops
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {searchSuggestions.nearbyStops.map((stop, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSearchQuery(stop);
                          setIsSearchFocused(false);
                          onNavigate('bus-search');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold border border-amber-200 transition-colors"
                      >
                        🚏 {stop}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <Bus className="w-3.5 h-3.5 text-blue-600" /> Popular Bus Routes
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {searchSuggestions.busRoutes.map((route, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSearchQuery(route);
                          setIsSearchFocused(false);
                          onNavigate('bus-search');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold border border-blue-200 transition-colors"
                      >
                        🚌 {route}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QUICK ACTION CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => onNavigate('bus-search')}
          className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-card-soft hover:shadow-card-hover hover:border-blue-500/50 transition-all text-left group touch-target"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all flex-shrink-0">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-xs sm:text-sm text-slate-900 block leading-tight">Find Bus</span>
            <span className="text-[10px] text-slate-500 font-medium">Schedules</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('bus-search')}
          className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-card-soft hover:shadow-card-hover hover:border-amber-500/50 transition-all text-left group touch-target"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all flex-shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-xs sm:text-sm text-slate-900 block leading-tight">Nearby Stops</span>
            <span className="text-[10px] text-slate-500 font-medium">KSRTC & SIT</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('live-tracking')}
          className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-card-soft hover:shadow-card-hover hover:border-indigo-500/50 transition-all text-left group touch-target"
        >
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all flex-shrink-0">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-xs sm:text-sm text-slate-900 block leading-tight">Live Map</span>
            <span className="text-[10px] text-slate-500 font-medium">GPS Radar</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('ai-assistant')}
          className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-card-soft hover:shadow-card-hover hover:border-teal-500/50 transition-all text-left group touch-target"
        >
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all flex-shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-xs sm:text-sm text-slate-900 block leading-tight">CityRide AI</span>
            <span className="text-[10px] text-slate-500 font-medium">Assistant</span>
          </div>
        </button>
      </div>

      {/* NEARBY BUS STOPS SECTION */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-card-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">Nearby Bus Stops</h3>
            <span className="px-2 py-0.5 text-[10px] font-black bg-amber-50 text-amber-900 rounded-full border border-amber-200">
              TUMAKURU SECTOR
            </span>
          </div>
          <button
            onClick={() => onNavigate('bus-search')}
            className="text-xs font-extrabold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>View All Stops</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {stops.slice(0, 3).map((stop) => (
            <div
              key={stop.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2 hover:border-amber-400 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 text-[10px] font-black bg-amber-500 text-slate-950 rounded">
                    🚏 {stop.code || 'ST-101'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">0.8 km</span>
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 mt-2">{stop.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Routes: {stop.routes?.join(', ') || 'R101, R102'}</p>
              </div>

              <button
                onClick={() => onNavigate('bus-search')}
                className="w-full py-1.5 text-center bg-white hover:bg-slate-900 hover:text-white text-slate-800 border border-slate-200 font-extrabold text-[11px] rounded-lg transition-colors"
              >
                View Stop
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* LIVE MAP PREVIEW CARD */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-card-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">Live Buses Near You</h3>
              <span className="px-2.5 py-0.5 text-[10px] font-black bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                ● LIVE RADAR
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Real-time GPS coordinates in Tumakuru, Karnataka</p>
          </div>

          <button
            onClick={() => onNavigate('live-tracking')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-electric-glow flex items-center gap-1.5 transition-all touch-target"
          >
            <span>Open Live Map</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Map Container */}
        <div className="h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-slate-200">
          <LiveBusMap
            buses={buses}
            routes={routes}
            stops={stops}
            selectedBus={buses[0]}
            onSelectBus={(bus) => {
              setSelectedBusForTracking(bus);
              onNavigate('live-tracking');
            }}
            height="100%"
            zoom={13}
          />
        </div>
      </div>

      {/* LIVE BUS CARDS FLEET SECTION */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">Active Bus Fleet</h3>
            <span className="px-2.5 py-0.5 text-[10px] font-black bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              {filteredBuses.length} ACTIVE
            </span>
          </div>
          <button
            onClick={() => onNavigate('bus-search')}
            className="text-xs font-extrabold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>View All Fleet</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBuses.slice(0, 3).map((bus) => (
            <div
              key={bus.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card-soft hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl bg-blue-600 font-extrabold text-white text-xs shadow-sm">
                    {bus.busNumber}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                    bus.status === 'delayed'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {bus.status === 'delayed' ? '● DELAYED' : '● LIVE'}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mt-3">{bus.routeName}</h4>
                <p className="text-xs text-slate-500 mt-1">Next Stop: <span className="text-slate-800 font-semibold">{bus.nextStopName}</span></p>

                <div className="mt-4 flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Arriving in <strong className="text-emerald-600 font-extrabold">{bus.etaMins} min</strong></span>
                  </div>
                  <span className="text-slate-500 font-medium">{bus.speedKmh} km/h</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedBusForTracking(bus);
                  onNavigate('live-tracking');
                }}
                className="mt-4 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-2 touch-target"
              >
                <span>Track Bus Live</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CITYRIDE AI ASSISTANT CARD */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-card-hover text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">AI Route Assistant</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">GEMINI</span>
            </div>
            <h3 className="text-lg font-black text-white mt-1">Need help planning your journey in Tumakuru?</h3>
            <p className="text-xs text-slate-300 mt-1 italic">"How do I reach Tumakuru Railway Station from SIT College?"</p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('ai-assistant')}
          className="relative z-10 w-full md:w-auto px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-electric-glow flex items-center justify-center gap-2 transition-all touch-target"
        >
          <span>Ask AI Assistant</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
