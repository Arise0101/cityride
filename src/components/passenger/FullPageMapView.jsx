import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import LiveBusMap from '../maps/LiveBusMap';
import { findNearestStopAndRoute } from '../../utils/routingEngine';
import { searchCityRideData, INTENT_TYPES } from '../../utils/searchIntentEngine';
import { Navigation, Search, MapPin, Bus, Clock, RefreshCw, Compass, ArrowRight, X } from 'lucide-react';

export default function FullPageMapView() {
  const { buses, routes, stops, selectedBusForTracking, setSelectedBusForTracking, isDemoSimulating, setIsDemoSimulating } = useApp();

  const [activeBus, setActiveBus] = useState(selectedBusForTracking || buses[0]);
  const [activeStop, setActiveStop] = useState(null);
  const [activeRoutePath, setActiveRoutePath] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [isFindingRoute, setIsFindingRoute] = useState(false);

  // Synchronize when selectedBusForTracking changes globally
  useEffect(() => {
    if (selectedBusForTracking) {
      setActiveBus(selectedBusForTracking);
    }
  }, [selectedBusForTracking]);

  // Perform "Find Nearest Bus Stop & Calculate OSRM Route" action
  const handleFindNearestStopRoute = async () => {
    setIsFindingRoute(true);

    let loc = userLocation;
    if (!loc && 'geolocation' in navigator) {
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 4000 });
        });
        loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
      } catch {
        loc = { lat: 13.3400, lng: 77.1000 };
      }
    }

    const res = await findNearestStopAndRoute(loc, stops);
    if (res && res.nearestStop) {
      setActiveStop(res.nearestStop);
      if (res.routeData && res.routeData.positions) {
        setActiveRoutePath(res.routeData);
      }
    }
    setIsFindingRoute(false);
  };

  // Perform Intent Search
  const searchResults = searchCityRideData({
    query: searchQuery,
    buses,
    stops,
    routes,
    userLocation
  });

  const activeRoute = routes.find(r => r.id === activeBus?.routeId) || routes[0];

  return (
    <div className="space-y-4 animate-fade-in pb-16 md:pb-12">
      {/* Top Map Action & Search Header */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
            <Navigation className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Tumakuru Full-Page Transit Map</h2>
            <p className="text-xs text-slate-500">Live 5G Telemetry & Real-Time Route Navigation</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleFindNearestStopRoute}
            disabled={isFindingRoute}
            className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition-all touch-target"
          >
            <Compass className={`w-4 h-4 ${isFindingRoute ? 'animate-spin' : ''}`} />
            <span>{isFindingRoute ? 'Calculating Route...' : 'Find Nearest Stop & Route'}</span>
          </button>

          <button
            onClick={() => setIsDemoSimulating(!isDemoSimulating)}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
              isDemoSimulating ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isDemoSimulating ? 'animate-spin' : ''}`} />
            <span>{isDemoSimulating ? 'Telemetry Live' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* Main Full-Screen Leaflet Map Area */}
      <div className="relative w-full h-[calc(100vh-220px)] min-h-[500px] rounded-3xl overflow-hidden border border-slate-200 shadow-card-hover">

        {/* Map Component */}
        <LiveBusMap
          buses={buses}
          routes={routes}
          stops={stops}
          selectedBus={activeBus}
          selectedStop={activeStop}
          selectedRoute={activeRoute}
          onSelectBus={(bus) => {
            setActiveBus(bus);
            setSelectedBusForTracking(bus);
          }}
          onSelectStop={(stop) => setActiveStop(stop)}
          height="100%"
          zoom={14}
        />

        {/* Floating Active Route Information Banner if calculated */}
        {activeRoutePath && (
          <div className="absolute top-16 left-4 right-4 md:right-auto md:max-w-md z-[1000] p-3.5 rounded-2xl bg-slate-950/90 backdrop-blur-md text-white border border-amber-500/40 shadow-2xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px] uppercase">
                ROUTE CALCULATED
              </span>
              <button onClick={() => setActiveRoutePath(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs font-bold text-slate-200">
              Nearest Stop: <span className="text-amber-400 font-extrabold">{activeStop?.name}</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 text-slate-300">
              <span>Distance: <strong className="text-white">{activeRoutePath.distanceKm} km</strong></span>
              <span>Est. Walk: <strong className="text-emerald-400">~{activeRoutePath.walkingDurationMins} mins</strong></span>
            </div>
          </div>
        )}

        {/* Floating Bottom Telemetry Card for Active Bus */}
        {activeBus && !activeStop && (
          <div className="absolute bottom-6 left-4 right-4 md:right-auto md:max-w-sm bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-card-hover z-[1000]">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-blue-600 text-white font-black text-xs rounded-lg shadow-sm">
                {activeBus.busNumber}
              </span>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                activeBus.status === 'delayed' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {activeBus.status === 'delayed' ? '● DELAYED' : '● LIVE TELEMETRY'}
              </span>
            </div>

            <h4 className="font-extrabold text-sm text-slate-900 mt-2">{activeBus.routeName}</h4>
            <p className="text-xs text-slate-500 mt-0.5">Heading to: <strong className="text-slate-800">{activeBus.nextStopName}</strong></p>

            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center">
              <div>
                <span className="text-[10px] text-slate-500 block font-semibold">ETA</span>
                <strong className="text-emerald-600 text-xs font-black">{activeBus.etaMins} mins</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block font-semibold">Speed</span>
                <strong className="text-slate-900 text-xs font-black">{activeBus.speedKmh} km/h</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block font-semibold">Pass.</span>
                <strong className="text-slate-900 text-xs font-black">{activeBus.currentOccupancy}/{activeBus.capacity}</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
