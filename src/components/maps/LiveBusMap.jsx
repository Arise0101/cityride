import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Plus, Minus, Compass, Target, Layers, MapPin, Bus as BusIcon, Clock } from 'lucide-react';

// Google Maps Basemap Tile Options
const MAP_LAYERS = {
  GOOGLE_ROADMAP: {
    name: 'Google Maps',
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>'
  },
  GOOGLE_HYBRID: {
    name: 'Google Satellite',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>'
  },
  GOOGLE_TERRAIN: {
    name: 'Google Terrain',
    url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>'
  },
  CARTO_VOYAGER: {
    name: 'Carto Transit',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
  }
};

// Create custom bus SVG marker icon generator (MOVING BUS VEHICLE)
const createBusIcon = (busNumber, status, speed, isSelected) => {
  const isDelayed = status === 'delayed';
  const colorHex = isDelayed ? '#ef4444' : '#10b981';
  const borderStyle = isSelected ? 'ring-4 ring-blue-500 scale-110' : '';

  const html = `
    <div class="relative flex flex-col items-center group cursor-pointer ${borderStyle} transition-transform z-[1000]">
      <div class="px-2.5 py-1 text-[11px] font-black tracking-wider rounded-lg text-white shadow-2xl border border-slate-900 bg-slate-950/95 whitespace-nowrap mb-1 flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full animate-ping" style="background-color: ${colorHex}"></span>
        <span>${busNumber}</span>
        <span class="text-slate-300 font-bold">• ${speed} km/h</span>
      </div>
      <div class="w-10 h-10 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white text-white font-extrabold text-base transform transition-all group-hover:scale-110" style="background-color: ${colorHex}">
        🚌
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-bus-marker',
    iconSize: [95, 60],
    iconAnchor: [47, 52],
  });
};

// Create custom BUS STOP marker icon generator with permanent high-contrast label pill
const createStopIcon = (stopName, code, isSelected) => {
  const selectedClass = isSelected ? 'scale-125 ring-2 ring-blue-600' : '';

  const html = `
    <div class="relative flex flex-col items-center group cursor-pointer z-[500]">
      <!-- Always visible stop label pill -->
      <div class="px-2 py-0.5 text-[10px] font-extrabold rounded-md text-slate-950 bg-white shadow-lg border border-slate-300 whitespace-nowrap mb-1 flex items-center gap-1 pointer-events-none">
        <span class="text-amber-600 font-black">🚏</span>
        <span>${stopName}</span>
      </div>

      <!-- Stop Badge Icon -->
      <div class="w-8 h-8 rounded-full bg-slate-900 text-amber-400 border-2 border-white shadow-xl flex items-center justify-center font-bold text-xs transform transition-transform group-hover:scale-125 ${selectedClass}">
        🚏
      </div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-stop-marker',
    iconSize: [120, 60],
    iconAnchor: [60, 52],
  });
};

// Map Recenter Controller
function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom || map.getZoom(), { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

// Floating Map Controls Panel Component
function MapControlsHandler({ onZoomIn, onZoomOut, onRecenter, onMyLocation, onToggleLayer, activeLayerName }) {
  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-card-hover rounded-2xl p-1 flex flex-col divide-y divide-slate-100">
        <button
          type="button"
          onClick={onZoomIn}
          title="Zoom In (+)"
          className="p-2.5 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-target font-black"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={onZoomOut}
          title="Zoom Out (-)"
          className="p-2.5 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-target font-black"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-card-hover rounded-2xl p-1 flex flex-col divide-y divide-slate-100">
        <button
          type="button"
          onClick={onMyLocation}
          title="My GPS Location"
          className="p-2.5 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-target"
        >
          <Compass className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={onRecenter}
          title="Recenter Map (Tumakuru)"
          className="p-2.5 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-target"
        >
          <Target className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={onToggleLayer}
          title={`Switch Map Layer (Current: ${activeLayerName})`}
          className="p-2.5 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-target"
        >
          <Layers className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default function LiveBusMap({
  buses = [],
  routes = [],
  stops = [],
  selectedBus = null,
  selectedStop = null,
  selectedRoute = null,
  onSelectBus = () => {},
  onSelectStop = () => {},
  height = '100%',
  zoom = 14
}) {
  // Default map center: Tumakuru, Karnataka, India (13.3400, 77.1000)
  const defaultTumakuruCenter = [13.3400, 77.1000];

  const targetCenter = selectedStop && selectedStop.lat
    ? [selectedStop.lat, selectedStop.lng]
    : selectedBus && selectedBus.lat
    ? [selectedBus.lat, selectedBus.lng]
    : defaultTumakuruCenter;

  const [mapInstance, setMapInstance] = useState(null);
  const [activeLayerKey, setActiveLayerKey] = useState('GOOGLE_ROADMAP');
  const [userLocation, setUserLocation] = useState(null);

  // Switch map tile layers (Google Maps, Google Satellite, Google Terrain, Carto Transit)
  const handleToggleLayer = () => {
    const keys = Object.keys(MAP_LAYERS);
    const currentIndex = keys.indexOf(activeLayerKey);
    const nextKey = keys[(currentIndex + 1) % keys.length];
    setActiveLayerKey(nextKey);
  };

  // Obtain user GPS or fallback
  const handleMyLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(coords);
          if (mapInstance) mapInstance.flyTo(coords, 15, { duration: 1.5 });
        },
        () => {
          if (mapInstance) mapInstance.flyTo(defaultTumakuruCenter, 14, { duration: 1.2 });
        }
      );
    } else if (mapInstance) {
      mapInstance.flyTo(defaultTumakuruCenter, 14, { duration: 1.2 });
    }
  };

  // Generate polylines for routes
  const routePolylines = (selectedRoute ? [selectedRoute] : routes).map(route => {
    if (!route.stops || route.stops.length < 2) return null;
    const positions = route.stops.map(s => [s.lat, s.lng]);
    return {
      id: route.id,
      positions,
      color: route.color || '#2563eb',
      routeName: route.routeName
    };
  }).filter(Boolean);

  const currentLayer = MAP_LAYERS[activeLayerKey];

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-card-hover bg-slate-100">
      {/* Map Layer Name Badge Overlay */}
      <div className="absolute top-4 left-4 z-[1000] px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 text-[11px] font-extrabold text-slate-800 shadow-card-soft flex items-center gap-1.5 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
        <span>{currentLayer.name} • Tumakuru</span>
      </div>

      <MapContainer
        center={targetCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={true} // Enable mouse scroll wheel zooming
        smoothWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
        touchZoom={true}
        ref={setMapInstance}
      >
        <TileLayer
          attribution={currentLayer.attribution}
          url={currentLayer.url}
          maxZoom={20}
        />

        <MapRecenter center={targetCenter} zoom={zoom} />

        {/* Floating Custom Map Control Panel */}
        <MapControlsHandler
          onZoomIn={() => mapInstance && mapInstance.zoomIn()}
          onZoomOut={() => mapInstance && mapInstance.zoomOut()}
          onRecenter={() => mapInstance && mapInstance.flyTo(defaultTumakuruCenter, 14, { duration: 1.2 })}
          onMyLocation={handleMyLocation}
          onToggleLayer={handleToggleLayer}
          activeLayerName={currentLayer.name}
        />

        {/* User Location Marker if GPS acquired */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <div className="p-2 text-xs font-bold text-slate-900">Your Current Location</div>
            </Popup>
          </Marker>
        )}

        {/* Active Route Polylines */}
        {routePolylines.map(line => (
          <React.Fragment key={line.id}>
            {/* Background Polyline for Glow */}
            <Polyline
              positions={line.positions}
              pathOptions={{ color: line.color, weight: 8, opacity: 0.35 }}
            />
            {/* Main Polyline */}
            <Polyline
              positions={line.positions}
              pathOptions={{ color: line.color, weight: 4, opacity: 0.9, dashArray: line.id === 'r3' ? '6, 6' : null }}
            />
          </React.Fragment>
        ))}

        {/* BUS STOP MARKERS (Physical Locations) */}
        {stops.map(stop => {
          const isSelected = selectedStop && selectedStop.id === stop.id;
          return (
            <Marker
              key={stop.id}
              position={[stop.lat, stop.lng]}
              icon={createStopIcon(stop.name, stop.code, isSelected)}
              eventHandlers={{
                click: () => onSelectStop(stop)
              }}
            >
              <Popup>
                <div className="p-3 min-w-[210px] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 rounded border border-amber-300">
                      🚏 BUS STOP
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">{stop.code || 'ST-100'}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 leading-tight">{stop.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Routes served: <strong className="text-slate-800">{stop.routes?.join(', ') || 'R101, R102'}</strong></p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-slate-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-600" /> Upcoming Buses:
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-700">BUS 101</span>
                      <span className="font-extrabold text-emerald-600">~4 mins</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-700">BUS 102</span>
                      <span className="font-extrabold text-emerald-600">~12 mins</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectStop(stop)}
                    className="w-full py-2 text-xs font-extrabold text-white bg-slate-900 hover:bg-blue-600 rounded-xl transition-colors"
                  >
                    View Stop Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* MOVING BUS MARKERS */}
        {buses.map(bus => {
          const isSelected = selectedBus && selectedBus.id === bus.id;
          return (
            <Marker
              key={bus.id}
              position={[bus.lat, bus.lng]}
              icon={createBusIcon(bus.busNumber, bus.status, bus.speedKmh, isSelected)}
              eventHandlers={{
                click: () => onSelectBus(bus)
              }}
            >
              <Popup>
                <div className="p-3 min-w-[210px] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 text-xs font-extrabold bg-blue-600 text-white rounded-lg">
                      {bus.busNumber}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                      bus.status === 'delayed' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {bus.status === 'delayed' ? '● DELAYED' : '● LIVE'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{bus.routeName}</h4>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div>Next Stop: <strong className="text-slate-900">{bus.nextStopName}</strong></div>
                    <div>Speed: <strong className="text-slate-900">{bus.speedKmh} km/h</strong> • ETA: <strong className="text-emerald-600">{bus.etaMins}m</strong></div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectBus(bus)}
                    className="w-full py-2 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
                  >
                    Track Bus Live
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
