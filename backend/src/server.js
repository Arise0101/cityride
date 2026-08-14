/**
 * CITYRIDE REST & WebSocket Express Backend Server — Tumakuru Transit Engine
 */
import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import http from 'http';
import { calculatePredictedETA } from './services/etaEngine.js';
import { askCityRideAI, autoTagLostItem } from './services/geminiService.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory data store with default seed dataset (Tumakuru, Karnataka, India)
const db = {
  buses: [
    { id: 'b1', busNumber: 'BUS-101', regNumber: 'KA-06-F-8892', routeId: 'r1', routeName: 'R101 - Bus Stand → Kyatsandra', driverId: 'd1', driverName: 'Ramesh Gowda', capacity: 50, occupancy: 34, status: 'active', speed: 42, lat: 13.3392, lng: 77.1015, nextStop: 'B.H. Road Junction', etaMins: 4 },
    { id: 'b2', busNumber: 'BUS-102', regNumber: 'KA-06-F-3310', routeId: 'r2', routeName: 'R102 - Railway Station → SSIT', driverId: 'd2', driverName: 'Suresh Kumar', capacity: 45, occupancy: 22, status: 'active', speed: 38, lat: 13.3440, lng: 77.0980, nextStop: 'Gubbi Gate Circle', etaMins: 7 },
    { id: 'b3', busNumber: 'BUS-103', regNumber: 'KA-06-F-1094', routeId: 'r3', routeName: 'R103 - Siddaganga Math Shuttle', driverId: 'd3', driverName: 'Venkatesh Naik', capacity: 55, occupancy: 46, status: 'delayed', speed: 16, lat: 13.3275, lng: 77.1260, nextStop: 'B.H. Road Junction', etaMins: 12 }
  ],
  routes: [
    { id: 'r1', routeNumber: 'R101', routeName: 'Bus Stand → Kyatsandra Line', startStop: 'Tumakuru KSRTC Bus Stand', endStop: 'Kyatsandra Circle', distanceKm: 8.5, durationMins: 20, stopsCount: 5, status: 'active' },
    { id: 'r2', routeNumber: 'R102', routeName: 'Railway Station → SSIT College Express', startStop: 'Tumakuru Railway Station', endStop: 'SSIT Siddhartha Campus', distanceKm: 7.2, durationMins: 18, stopsCount: 4, status: 'active' },
    { id: 'r3', routeNumber: 'R103', routeName: 'Siddaganga Math Shuttle & B.H. Road', startStop: 'Siddaganga Kshetra', endStop: 'Tumakuru KSRTC Bus Stand', distanceKm: 9.0, durationMins: 24, stopsCount: 4, status: 'active' }
  ],
  drivers: [
    { id: 'd1', name: 'Ramesh Gowda', phone: '+91 98450 12345', license: 'KA-06-2020-0012', assignedBus: 'BUS-101', assignedRoute: 'R101', status: 'on_shift', rating: 4.92 },
    { id: 'd2', name: 'Suresh Kumar', phone: '+91 98450 23456', license: 'KA-06-2019-0045', assignedBus: 'BUS-102', assignedRoute: 'R102', status: 'on_shift', rating: 4.88 },
    { id: 'd3', name: 'Venkatesh Naik', phone: '+91 98450 34567', license: 'KA-06-2021-0089', assignedBus: 'BUS-103', assignedRoute: 'R103', status: 'on_shift', rating: 4.75 }
  ],
  lostItems: [
    { id: 'l1', title: 'Black Leather Wallet', category: 'Wallets & Bags', description: 'Bi-fold leather wallet with student ID card & cash', busNumber: 'BUS-101', photoUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500', date: '2026-08-10', tags: ['black', 'wallet', 'leather'], status: 'reported' }
  ],
  foundItems: [
    { id: 'f1', title: 'Gentleman Leather Wallet', category: 'Wallets & Bags', description: 'Found on seat #12 on BUS-101', busNumber: 'BUS-101', photoUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500', date: '2026-08-10', tags: ['black', 'leather', 'wallet'], status: 'reported' }
  ]
};

// --- REST API ENDPOINTS --- //

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'CITYRIDE Smart Bus Backend (Tumakuru)', time: new Date().toISOString() });
});

// Buses API
app.get('/api/buses', (req, res) => res.json(db.buses));
app.post('/api/buses', (req, res) => {
  const newBus = { id: `b${Date.now()}`, ...req.body, status: req.body.status || 'active' };
  db.buses.push(newBus);
  res.status(201).json(newBus);
});

// Routes API
app.get('/api/routes', (req, res) => res.json(db.routes));

// Drivers API
app.get('/api/drivers', (req, res) => res.json(db.drivers));

// AI Assistant API
app.post('/api/ai/assistant', async (req, res) => {
  const { question } = req.body;
  const answer = await askCityRideAI(question || '', { buses: db.buses, routes: db.routes });
  res.json({ question, answer, timestamp: new Date() });
});

// AI ETA Prediction API
app.post('/api/ai/predict-eta', (req, res) => {
  const { currentLat, currentLng, targetLat, targetLng, currentSpeedKmh } = req.body;
  const prediction = calculatePredictedETA({
    currentLat: currentLat || 13.3392,
    currentLng: currentLng || 77.1015,
    targetLat: targetLat || 13.3150,
    targetLng: targetLng || 77.1480,
    currentSpeedKmh: currentSpeedKmh || 35
  });
  res.json(prediction);
});

// Lost & Found API
app.get('/api/lost-found', (req, res) => {
  res.json({ lost: db.lostItems, found: db.foundItems });
});

app.post('/api/lost-found/report', (req, res) => {
  const { title, description, category, photoUrl, busNumber, type } = req.body;
  const tags = autoTagLostItem(title, description);
  const newItem = {
    id: `${type === 'found' ? 'f' : 'l'}${Date.now()}`,
    title,
    category: category || 'General',
    description,
    photoUrl: photoUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500',
    busNumber,
    date: new Date().toISOString().split('T')[0],
    tags,
    status: 'reported'
  };

  if (type === 'found') {
    db.foundItems.push(newItem);
  } else {
    db.lostItems.push(newItem);
  }
  res.status(201).json(newItem);
});

// --- HTTP & WEBSOCKET SERVER SETUP --- //
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected to CITYRIDE Tumakuru Telemetry Stream');
  const interval = setInterval(() => {
    // Simulate minor movement for buses around Tumakuru
    db.buses = db.buses.map(bus => {
      if (bus.status === 'active') {
        const latDelta = (Math.random() - 0.48) * 0.0008;
        const lngDelta = (Math.random() - 0.48) * 0.0008;
        return {
          ...bus,
          lat: Number((bus.lat + latDelta).toFixed(6)),
          lng: Number((bus.lng + lngDelta).toFixed(6)),
          speed: Number((Math.max(15, bus.speed + (Math.random() - 0.5) * 3)).toFixed(1))
        };
      }
      return bus;
    });

    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: 'BUS_TELEMETRY', buses: db.buses, timestamp: Date.now() }));
    }
  }, 2500);

  ws.on('close', () => clearInterval(interval));
});

server.listen(PORT, () => {
  console.log(`🚀 CITYRIDE Tumakuru Backend Server running on port ${PORT}`);
});
