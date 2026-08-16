/**
 * Vercel Serverless API — Buses
 * Route: GET /api/buses  |  POST /api/buses
 */

// In-memory seed data (Tumakuru transit network)
const buses = [
  { id: 'b1', busNumber: 'BUS-101', regNumber: 'KA-06-F-8892', routeId: 'r1', routeName: 'R101 - Bus Stand → Kyatsandra', driverId: 'd1', driverName: 'Ramesh Gowda', capacity: 50, currentOccupancy: 34, occupancy: 34, status: 'active', speedKmh: 42, speed: 42, lat: 13.3392, lng: 77.1015, nextStopName: 'B.H. Road Junction', nextStop: 'B.H. Road Junction', etaMins: 4 },
  { id: 'b2', busNumber: 'BUS-102', regNumber: 'KA-06-F-3310', routeId: 'r2', routeName: 'R102 - Railway Station → SSIT', driverId: 'd2', driverName: 'Suresh Kumar', capacity: 45, currentOccupancy: 22, occupancy: 22, status: 'active', speedKmh: 38, speed: 38, lat: 13.3440, lng: 77.0980, nextStopName: 'Gubbi Gate Circle', nextStop: 'Gubbi Gate Circle', etaMins: 7 },
  { id: 'b3', busNumber: 'BUS-103', regNumber: 'KA-06-F-1094', routeId: 'r3', routeName: 'R103 - Siddaganga Math Shuttle', driverId: 'd3', driverName: 'Venkatesh Naik', capacity: 55, currentOccupancy: 46, occupancy: 46, status: 'delayed', speedKmh: 16, speed: 16, lat: 13.3275, lng: 77.1260, nextStopName: 'B.H. Road Junction', nextStop: 'B.H. Road Junction', etaMins: 12 }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  if (req.method === 'GET') {
    return res.status(200).json(buses);
  }

  if (req.method === 'POST') {
    const newBus = { id: `b${Date.now()}`, ...req.body, status: req.body.status || 'active' };
    buses.push(newBus);
    return res.status(201).json(newBus);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
