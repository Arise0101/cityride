/**
 * CITYRIDE Search Intent Classification & Proximity Engine — Tumakuru
 */

// Intent Types
export const INTENT_TYPES = {
  BUS: 'BUS',
  BUS_STOP: 'BUS_STOP',
  ROUTE: 'ROUTE',
  PLACE: 'PLACE',
  GENERAL: 'GENERAL'
};

/**
 * Calculates Haversine distance in km between two lat/lng pairs
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

/**
 * Classifies search input into intent category
 */
export function classifySearchIntent(query) {
  if (!query || typeof query !== 'string') return INTENT_TYPES.GENERAL;

  const q = query.trim().toLowerCase();

  // Bus stop intent triggers
  const stopKeywords = [
    'bus stop', 'bus-stop', 'near bus stop', 'bus stops', 'nearest bus stop',
    'stops near me', 'stop near me', 'bus stop near me', 'ksrtc stop', 'stand', 'station stop'
  ];
  if (stopKeywords.some(keyword => q.includes(keyword))) {
    return INTENT_TYPES.BUS_STOP;
  }

  // Bus specific intent triggers
  const busKeywords = ['bus ', 'bus-', 'bus1', 'bus2', 'buses', 'live bus', 'buses near me', 'vehicle', 'fleet'];
  if (busKeywords.some(keyword => q.includes(keyword)) || /^bus[-\s]?\d+$/i.test(q)) {
    return INTENT_TYPES.BUS;
  }

  // Route specific intent triggers
  const routeKeywords = ['route', 'line', 'express', 'shuttle', 'path', 'how to reach', 'to bengaluru', 'way to'];
  if (routeKeywords.some(keyword => q.includes(keyword)) || /^r\d+$/i.test(q)) {
    return INTENT_TYPES.ROUTE;
  }

  // Known place triggers
  const placeKeywords = ['railway', 'station', 'college', 'campus', 'institute', 'sit', 'ssit', 'math', 'ksrtc', 'depot', 'toll', 'circle', 'junction', 'b.h. road'];
  if (placeKeywords.some(keyword => q.includes(keyword))) {
    return INTENT_TYPES.PLACE;
  }

  return INTENT_TYPES.GENERAL;
}

/**
 * Performs intelligent search over buses, stops, and routes based on intent
 */
export function searchCityRideData({ query, buses = [], stops = [], routes = [], userLocation = null }) {
  const intent = classifySearchIntent(query);
  const q = (query || '').trim().toLowerCase();

  // Default Tumakuru reference point if user location is unavailable
  const refLat = userLocation?.lat || 13.3400;
  const refLng = userLocation?.lng || 77.1000;

  // Compute distance for all stops from reference point
  const stopsWithDistance = stops.map(stop => {
    const dist = calculateDistanceKm(refLat, refLng, stop.lat, stop.lng);
    return {
      ...stop,
      distanceKm: dist !== null ? dist : 0.8
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm);

  // If query specifically targets bus stops or "near me"
  if (intent === INTENT_TYPES.BUS_STOP || q.includes('near') || q.includes('stop')) {
    const matchedStops = stopsWithDistance.filter(s =>
      q.length < 3 || s.name.toLowerCase().includes(q) || (s.code && s.code.toLowerCase().includes(q))
    );

    return {
      intent: INTENT_TYPES.BUS_STOP,
      buses: [],
      stops: matchedStops.length > 0 ? matchedStops : stopsWithDistance,
      routes: []
    };
  }

  // If query targets buses
  if (intent === INTENT_TYPES.BUS) {
    const matchedBuses = buses.filter(b =>
      b.busNumber.toLowerCase().includes(q) ||
      b.routeName.toLowerCase().includes(q) ||
      b.registrationNumber?.toLowerCase().includes(q)
    );

    return {
      intent: INTENT_TYPES.BUS,
      buses: matchedBuses.length > 0 ? matchedBuses : buses,
      stops: [],
      routes: []
    };
  }

  // If query targets routes
  if (intent === INTENT_TYPES.ROUTE) {
    const matchedRoutes = routes.filter(r =>
      r.routeNumber.toLowerCase().includes(q) ||
      r.routeName.toLowerCase().includes(q) ||
      r.startStop.toLowerCase().includes(q) ||
      r.endStop.toLowerCase().includes(q)
    );

    return {
      intent: INTENT_TYPES.ROUTE,
      buses: [],
      stops: [],
      routes: matchedRoutes.length > 0 ? matchedRoutes : routes
    };
  }

  // General or Place search: search across all categories
  const matchedBuses = buses.filter(b => b.busNumber.toLowerCase().includes(q) || b.routeName.toLowerCase().includes(q));
  const matchedStops = stopsWithDistance.filter(s => s.name.toLowerCase().includes(q) || (s.code && s.code.toLowerCase().includes(q)));
  const matchedRoutes = routes.filter(r => r.routeName.toLowerCase().includes(q) || r.startStop.toLowerCase().includes(q) || r.endStop.toLowerCase().includes(q));

  return {
    intent: intent,
    buses: matchedBuses,
    stops: matchedStops,
    routes: matchedRoutes
  };
}
