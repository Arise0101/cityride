/**
 * Vercel Serverless API — Routes
 * Route: GET /api/routes
 */

const routes = [
  { id: 'r1', routeNumber: 'R101', routeName: 'Bus Stand → Kyatsandra Line', startStop: 'Tumakuru KSRTC Bus Stand', endStop: 'Kyatsandra Circle', distanceKm: 8.5, durationMins: 20, stopsCount: 5, status: 'active' },
  { id: 'r2', routeNumber: 'R102', routeName: 'Railway Station → SSIT College Express', startStop: 'Tumakuru Railway Station', endStop: 'SSIT Siddhartha Campus', distanceKm: 7.2, durationMins: 18, stopsCount: 4, status: 'active' },
  { id: 'r3', routeNumber: 'R103', routeName: 'Siddaganga Math Shuttle & B.H. Road', startStop: 'Siddaganga Kshetra', endStop: 'Tumakuru KSRTC Bus Stand', distanceKm: 9.0, durationMins: 24, stopsCount: 4, status: 'active' }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  res.status(200).json(routes);
}
