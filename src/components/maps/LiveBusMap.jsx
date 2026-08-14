import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Create custom bus SVG marker icon generator
const createBusIcon = (busNumber, status, speed) => {
  const isDelayed = status === 'delayed';
  const colorClass = isDelayed ? '#ef4444' : '#10b981';

  const html = `
    <div class="relative flex flex-col items-center group cursor-pointer">
      <div class="px-2 py-0.5 text-[10px] font-bold tracking-wider rounded-md text-white shadow-lg border border-slate-700 bg-slate-900/90 whitespace-nowrap mb-1 flex items-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full animate-ping" style="background-color: ${colorClass}"></span>
        ${busNumber} • ${speed} km/h
      </div>
      <div class="w-9 h-9 rounded-full flex items-center justify-center shadow-glow-blue border-2 border-slate-900 text-white font-bold text-xs transform transition-transform group-hover:scale-110" style="background-color: ${colorClass}">
        🚌
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-bus-marker',
    iconSize: [80, 50],
    iconAnchor: [40, 45],
  });
};

const createStopIcon = (stopName) => {
  const html = `
    <div class="flex items-center justify-center w-5 h-5 bg-blue-600 rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-125 transition-transform" title="${stopName}">
      <div class="w-2 h-2 bg-white rounded-full"></div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-stop-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Component to dynamically re-center map
function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom || map.getZoom(), { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function LiveBusMap({
  buses = [],
  routes = [],
  stops = [],
  selectedBus = null,
  selectedRoute = null,
  onSelectBus = () => {},
  height = '100%',
  zoom = 13
}) {
  // Default map center: Tumakuru, Karnataka, India (13.3400, 77.1000)
  const defaultCenter = selectedBus && selectedBus.lat && selectedBus.lng
    ? [selectedBus.lat, selectedBus.lng]
    : [13.3400, 77.1000];

  // Generate polylines for routes
  const routePolylines = (selectedRoute ? [selectedRoute] : routes).map(route => {
    if (!route.stops || route.stops.length < 2) return null;
    const positions = route.stops.map(s => [s.lat, s.lng]);
    return {
      id: route.id,
      positions,
      color: route.color || '#3b82f6',
      routeName: route.routeName
    };
  }).filter(Boolean);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-card-hover" style={{ height }}>
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapRecenter center={defaultCenter} zoom={zoom} />

        {/* Polylines for active routes */}
        {routePolylines.map(line => (
          <Polyline
            key={line.id}
            positions={line.positions}
            pathOptions={{ color: line.color, weight: 5, opacity: 0.85, dashArray: line.id === 'r3' ? '8, 8' : null }}
          />
        ))}

        {/* Stop markers */}
        {stops.map(stop => (
          <Marker
            key={stop.id}
            position={[stop.lat, stop.lng]}
            icon={createStopIcon(stop.name)}
          >
            <Popup>
              <div className="p-2 min-w-[160px]">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Bus Stop</div>
                <div className="text-base font-extrabold text-slate-900">{stop.name}</div>
                <div className="text-xs text-slate-500 mt-1">Code: {stop.code || 'ST-100'}</div>
                <div className="mt-2 text-xs text-emerald-700 font-medium bg-emerald-50 p-1.5 rounded border border-emerald-200">
                  Next bus arriving in ~5 mins
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Bus markers */}
        {buses.map(bus => (
          <Marker
            key={bus.id}
            position={[bus.lat, bus.lng]}
            icon={createBusIcon(bus.busNumber, bus.status, bus.speedKmh)}
            eventHandlers={{
              click: () => onSelectBus(bus),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 text-xs font-extrabold bg-blue-600 text-white rounded-lg">
                    {bus.busNumber}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${bus.status === 'delayed' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                    {bus.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900 mt-2">{bus.routeName}</div>
                <div className="text-xs text-slate-500 mt-1">Next Stop: <span className="text-slate-800 font-semibold">{bus.nextStopName}</span></div>
                <div className="text-xs text-slate-500 mt-0.5">Speed: <span className="text-slate-800 font-semibold">{bus.speedKmh} km/h</span></div>
                <div className="text-xs text-slate-500 mt-0.5">Occupancy: <span className="text-slate-800 font-semibold">{bus.currentOccupancy}/{bus.capacity}</span></div>
                <button
                  onClick={() => onSelectBus(bus)}
                  className="w-full mt-3 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Track Bus Live
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
