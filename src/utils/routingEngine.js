/**
 * CITYRIDE OSRM Map Routing & Nearest Stop Engine — Tumakuru
 */
import { calculateDistanceKm } from './searchIntentEngine';

// Default Tumakuru reference location
export const DEFAULT_TUMAKURU_LOCATION = {
  lat: 13.3400,
  lng: 77.1000,
  name: 'Tumakuru City Center'
};

/**
 * Calculates a driving or walking route using public OSRM API with fallback
 */
export async function fetchOSRMRoute(origin, destination) {
  if (!origin || !destination) return null;

  const startLng = origin.lng;
  const startLat = origin.lat;
  const endLng = destination.lng;
  const endLat = destination.lat;

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        // OSRM returns coordinates as [lng, lat], Leaflet requires [lat, lng]
        const positions = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        const distanceKm = Number((route.distance / 1000).toFixed(2));
        const durationMins = Math.max(1, Math.round(route.duration / 60));
        const walkingDurationMins = Math.max(1, Math.round((distanceKm / 4.8) * 60)); // ~4.8 km/h walking speed

        return {
          positions,
          distanceKm,
          durationMins,
          walkingDurationMins,
          isOSRM: true
        };
      }
    }
  } catch (err) {
    console.warn("OSRM routing API unavailable, falling back to direct path:", err);
  }

  // Fallback direct path
  const dist = calculateDistanceKm(startLat, startLng, endLat, endLng) || 0.8;
  const walkingMins = Math.max(1, Math.round((dist / 4.8) * 60));

  return {
    positions: [
      [startLat, startLng],
      [(startLat + endLat) / 2, (startLng + endLng) / 2],
      [endLat, endLng]
    ],
    distanceKm: dist,
    durationMins: Math.max(1, Math.round(dist * 2.5)),
    walkingDurationMins: walkingMins,
    isOSRM: false
  };
}

/**
 * Finds the nearest physical bus stop and calculates route from user coordinates
 */
export async function findNearestStopAndRoute(userLocation, stops = []) {
  const origin = (userLocation && userLocation.lat && userLocation.lng)
    ? userLocation
    : DEFAULT_TUMAKURU_LOCATION;

  if (!stops || stops.length === 0) return null;

  // Find nearest stop by Haversine distance
  let nearestStop = stops[0];
  let minDistance = Infinity;

  stops.forEach(stop => {
    const dist = calculateDistanceKm(origin.lat, origin.lng, stop.lat, stop.lng);
    if (dist !== null && dist < minDistance) {
      minDistance = dist;
      nearestStop = stop;
    }
  });

  // Calculate route from origin to nearest stop
  const routeData = await fetchOSRMRoute(origin, { lat: nearestStop.lat, lng: nearestStop.lng });

  return {
    origin,
    nearestStop: {
      ...nearestStop,
      distanceKm: routeData ? routeData.distanceKm : minDistance
    },
    routeData
  };
}
