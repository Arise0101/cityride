import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Bus, MapPin, Clock, Navigation, ArrowRight, ChevronLeft, Map, Compass } from 'lucide-react';
import { predictETAWithAI } from '../../services/aiService';
import { searchCityRideData, INTENT_TYPES } from '../../utils/searchIntentEngine';
import LiveBusMap from '../maps/LiveBusMap';

export default function BusSearchAndDetails({ onNavigate }) {
  const { buses, routes, stops, setSelectedBusForTracking, selectedBusForTracking } = useApp();

  const [activeTab, setActiveTab] = useState('search');
  const [selectedBus, setSelectedBus] = useState(selectedBusForTracking || buses[0]);
  const [selectedStop, setSelectedStop] = useState(stops[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  // Request user GPS for "Near Me" search
  const requestGPSLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setIsLocating(false);
        },
        () => {
          // Fallback to Tumakuru center
          setUserLocation({ lat: 13.3400, lng: 77.1000 });
          setIsLocating(false);
        }
      );
    } else {
      setUserLocation({ lat: 13.3400, lng: 77.1000 });
      setIsLocating(false);
    }
  };

  // Perform search with intent classification algorithm
  const searchResults = searchCityRideData({
    query: searchQuery,
    buses,
    stops,
    routes,
    userLocation
  });

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
        {activeTab !== 'search' ? (
          <button
            onClick={() => setActiveTab('search')}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 shadow-card-soft touch-target"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Explorer</span>
          </button>
        ) : (
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-slate-900">Route & Bus Explorer</h2>
            <p className="text-xs text-slate-500 mt-0.5">Search Tumakuru buses, physical stops, and live schedules</p>
          </div>
        )}

        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-card-soft w-full xs:w-auto">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 xs:flex-none px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'search' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            SEARCH & INTENT
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 xs:flex-none px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'details' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            BUS DETAILS
          </button>

          {selectedStop && (
            <button
              onClick={() => setActiveTab('stop-details')}
              className={`flex-1 xs:flex-none px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'stop-details' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              STOP VIEW
            </button>
          )}
        </div>
      </div>

      {activeTab === 'search' ? (
        <div className="space-y-4">
          {/* Search Box with GPS Button */}
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search buses ('bus 102'), stops ('near bus stop'), or places ('Railway Station')..."
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-blue-500 shadow-card-soft font-medium"
              />
            </div>

            <button
              onClick={requestGPSLocation}
              disabled={isLocating}
              className="px-4 py-3 min-h-[44px] rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-extrabold flex items-center justify-center gap-2 transition-all touch-target whitespace-nowrap shadow-sm"
            >
              <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : 'Use My GPS'}</span>
            </button>
          </div>

          {/* Quick Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 text-xs">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Quick Intent:</span>
            <button
              onClick={() => setSearchQuery('near bus stop')}
              className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                searchResults.intent === INTENT_TYPES.BUS_STOP
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              🚏 Nearest Bus Stops
            </button>
            <button
              onClick={() => setSearchQuery('live buses')}
              className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                searchResults.intent === INTENT_TYPES.BUS
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              🚌 Active Buses
            </button>
            <button
              onClick={() => setSearchQuery('route to Bengaluru')}
              className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                searchResults.intent === INTENT_TYPES.ROUTE
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              🗺️ Bengaluru Routes
            </button>
          </div>

          {/* Search Result Category Header */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span>Classified Intent:</span>
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black">
                {searchResults.intent}
              </span>
            </span>
          </div>

          {/* BUS STOP RESULTS (Rendered when intent is BUS_STOP or stops match) */}
          {searchResults.stops.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>Bus Stop Locations ({searchResults.stops.length})</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {searchResults.stops.map((stop) => (
                  <div
                    key={stop.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-card-soft hover:shadow-card-hover transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-xs">
                          🚏 BUS STOP
                        </span>
                        <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                          {stop.distanceKm} km away
                        </span>
                      </div>

                      <h4 className="text-base font-extrabold text-slate-900 mt-3">{stop.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Stop Code: <strong className="text-slate-800">{stop.code || 'ST-100'}</strong></p>

                      <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Upcoming Buses:</div>
                        <div className="flex items-center justify-between font-semibold text-slate-800">
                          <span>BUS 101 (Kyatsandra Line)</span>
                          <span className="text-emerald-600 font-extrabold">~5 min</span>
                        </div>
                        <div className="flex items-center justify-between font-semibold text-slate-800">
                          <span>BUS 102 (SSIT Express)</span>
                          <span className="text-emerald-600 font-extrabold">~12 min</span>
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-slate-500">
                        Routes: <strong className="text-slate-800">{stop.routes?.join(', ') || '101, 102, 105'}</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStop(stop);
                        setActiveTab('stop-details');
                      }}
                      className="mt-4 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-2 touch-target"
                    >
                      <Map className="w-3.5 h-3.5 text-amber-400" />
                      <span>View Stop</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BUS RESULTS (Rendered when intent is BUS or buses match) */}
          {searchResults.buses.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Bus className="w-4 h-4 text-blue-600" />
                <span>Active Bus Vehicles ({searchResults.buses.length})</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {searchResults.buses.map((bus) => (
                  <div
                    key={bus.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-card-soft hover:shadow-card-hover transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-sm">
                          {bus.busNumber}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                          bus.status === 'delayed' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {bus.status === 'delayed' ? '● DELAYED' : '● LIVE'}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mt-3">{bus.routeName}</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Route: <span className="text-slate-800 font-medium">{activeRoute.startStop} → {activeRoute.endStop}</span>
                      </p>

                      <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-slate-500 text-[10px] font-semibold block">Next Arrival</span>
                          <strong className="text-emerald-600 font-extrabold text-sm">{bus.etaMins} mins</strong>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-slate-500 text-[10px] font-semibold block">Speed</span>
                          <strong className="text-slate-900 font-extrabold text-sm">{bus.speedKmh} km/h</strong>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 sm:mt-4 flex flex-col xs:flex-row items-stretch xs:items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedBus(bus);
                          setActiveTab('details');
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors touch-target"
                      >
                        View Details & ETA
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
          )}

          {/* ROUTE RESULTS */}
          {searchResults.routes.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Map className="w-4 h-4 text-emerald-600" />
                <span>Matching Transit Routes ({searchResults.routes.length})</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {searchResults.routes.map((route) => (
                  <div key={route.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card-soft">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-extrabold text-xs">
                        {route.routeNumber}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">{route.totalDistanceKm} km • ~{route.estimatedDurationMins} min</span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900 mt-2">{route.routeName}</h4>
                    <p className="text-xs text-slate-500 mt-1">{route.startStop} ➔ {route.endStop}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : activeTab === 'stop-details' && selectedStop ? (
        /* Dedicated Bus Stop Detail View */
        <div className="space-y-4 animate-fade-in">
          <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-card-hover space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-black text-xs">
                🚏 BUS STOP
              </span>
              <span className="text-xs font-bold text-slate-400">Code: {selectedStop.code || 'ST-101'}</span>
            </div>

            <div>
              <h3 className="text-xl font-black text-white">{selectedStop.name}</h3>
              <p className="text-xs text-slate-300 mt-1">
                Tumakuru Transit Sector • Served Routes: <span className="text-amber-400 font-bold">{selectedStop.routes?.join(', ') || 'R101, R102'}</span>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-950/80">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Distance</span>
                <strong className="text-amber-400 font-extrabold text-sm">{selectedStop.distanceKm || 0.8} km</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Next Bus</span>
                <strong className="text-emerald-400 font-extrabold text-sm">~4 mins</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                <strong className="text-white font-extrabold text-sm">Active</strong>
              </div>
            </div>
          </div>

          {/* Centered Map Card for Bus Stop */}
          <div className="h-72 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-card-soft">
            <LiveBusMap
              buses={buses}
              routes={routes}
              stops={stops}
              selectedStop={selectedStop}
              height="100%"
              zoom={15}
            />
          </div>
        </div>
      ) : (
        /* Detailed Bus View */
        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          {/* Main Bus Status Banner */}
          <div className="p-4 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-card-hover text-white relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3.5 py-1 rounded-xl bg-blue-600 font-extrabold text-white text-sm shadow-md">
                    {selectedBus.busNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-400">Reg: {selectedBus.registrationNumber}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>LIVE TELEMETRY</span>
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white mt-3">{selectedBus.routeName}</h3>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  Driver: <span className="text-white font-bold">{selectedBus.driverName}</span> • {selectedBus.currentOccupancy}/{selectedBus.capacity} passengers
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
          </div>

          {/* Upcoming Stops Timeline */}
          <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-card-soft">
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>Route Stop Timeline & Live Progress</span>
            </h4>

            <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {activeRoute.stops.map((stop, idx) => {
                const isPassed = idx < (selectedBus.currentStopIndex || 0);
                const isCurrent = idx === (selectedBus.currentStopIndex || 0);

                return (
                  <div key={stop.id} className="relative flex items-start gap-3 pl-8">
                    <div className={`absolute left-1.5 top-1 -translate-x-1/2 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      isCurrent
                        ? 'bg-blue-600 border-white shadow-electric-glow'
                        : isPassed
                        ? 'bg-slate-300 border-slate-200'
                        : 'bg-white border-slate-300'
                    }`} />

                    <div className="flex-1 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                          <span>{stop.name}</span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 text-[9px] bg-blue-600 text-white rounded font-black uppercase">
                              NEXT STOP
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Stop Code: ST-{100 + idx}</div>
                      </div>

                      <div className="text-xs font-extrabold text-slate-800">
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
