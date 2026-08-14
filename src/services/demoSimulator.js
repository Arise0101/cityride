/**
 * CITYRIDE Live GPS Movement Simulator
 * Real-time continuous interpolation of buses along route polylines
 */

export class BusMovementSimulator {
  constructor(routes, onUpdate) {
    this.routes = routes;
    this.onUpdate = onUpdate;
    this.timer = null;
  }

  start(buses) {
    if (this.timer) clearInterval(this.timer);

    let step = 0;

    this.timer = setInterval(() => {
      step += 0.04;

      const updatedBuses = buses.map(bus => {
        if (bus.status !== 'active' && bus.status !== 'delayed') {
          return bus;
        }

        const route = this.routes.find(r => r.id === bus.routeId || r.routeNumber === bus.routeName.split(' ')[0]);
        if (!route || !route.stops || route.stops.length < 2) {
          return bus;
        }

        // Interpolate along route stops
        const stops = route.stops;
        const totalSegments = stops.length - 1;
        const rawProgress = (step + (parseInt(bus.id.replace(/\D/g, '') || '1') * 0.4)) % totalSegments;

        const currentSegIndex = Math.floor(rawProgress);
        const segmentProgress = rawProgress - currentSegIndex;

        const p1 = stops[currentSegIndex];
        const p2 = stops[Math.min(currentSegIndex + 1, stops.length - 1)];

        const currLat = p1.lat + (p2.lat - p1.lat) * segmentProgress;
        const currLng = p1.lng + (p2.lng - p1.lng) * segmentProgress;

        // Dynamic ETA calculation
        const remainingSegments = totalSegments - rawProgress;
        const estimatedSpeed = bus.status === 'delayed' ? 16 : 40;
        const speedFluctuation = (Math.random() - 0.5) * 4;
        const currentSpeed = Math.max(12, Number((estimatedSpeed + speedFluctuation).toFixed(1)));
        const totalEtaMins = Math.max(1, Math.round(remainingSegments * 4.5));

        return {
          ...bus,
          lat: Number(currLat.toFixed(6)),
          lng: Number(currLng.toFixed(6)),
          speedKmh: currentSpeed,
          currentStopIndex: currentSegIndex,
          nextStopName: p2.name,
          etaMins: totalEtaMins,
          lastUpdate: 'Just now'
        };
      });

      if (this.onUpdate) {
        this.onUpdate(updatedBuses);
      }
    }, 1500);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
