/**
 * CITYRIDE AI ETA & Delay Prediction Service
 * Combines real-time GPS telemetry, average speed, distance remaining, weather factors,
 * traffic congestion level, and historical stop dwell times.
 */

export function calculatePredictedETA({
  currentLat,
  currentLng,
  targetLat,
  targetLng,
  currentSpeedKmh = 35,
  trafficCongestionScore = 0.2, // 0 = free flow, 1 = severe gridlock
  weatherFactor = 1.0, // 1.0 = clear, 1.25 = rain, 1.5 = heavy storm
  scheduledMins = 15,
}) {
  // Haversine formula for distance in kilometers
  const toRad = (val) => (val * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(targetLat - currentLat);
  const dLng = toRad(targetLng - currentLng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(currentLat)) * Math.cos(toRad(targetLat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;

  // Effective speed adjusted by traffic and weather
  const effectiveSpeed = Math.max(8, currentSpeedKmh * (1 - trafficCongestionScore * 0.55) / weatherFactor);

  // Raw travel time in minutes
  const travelTimeMins = (distanceKm / effectiveSpeed) * 60;

  // Dwell time overhead at intermediate stops (avg 1.2 min per stop)
  const estimatedStopsRemaining = Math.ceil(distanceKm / 1.8);
  const dwellTimeMins = estimatedStopsRemaining * 1.2;

  const totalPredictedMins = Math.round(travelTimeMins + dwellTimeMins);
  const delayMins = Math.max(0, totalPredictedMins - scheduledMins);

  const confidenceScore = Math.min(0.98, Math.max(0.75, 0.95 - (trafficCongestionScore * 0.15)));

  return {
    predictedArrivalMins: Math.max(1, totalPredictedMins),
    distanceRemainingKm: Number(distanceKm.toFixed(2)),
    expectedDelayMins: delayMins,
    trafficDelayMins: Math.round(delayMins * 0.7),
    confidenceScore: Number(confidenceScore.toFixed(2)),
    effectiveSpeedKmh: Number(effectiveSpeed.toFixed(1)),
  };
}
