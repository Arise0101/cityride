/**
 * CITYRIDE Smart City Real-World Dataset — Tumakuru (Tumkur), Karnataka, India
 */

export const INITIAL_BUSES = [
  {
    id: 'b1',
    busNumber: 'BUS-101',
    registrationNumber: 'KA-06-F-8892',
    routeId: 'r1',
    routeName: 'R101 - Bus Stand → Kyatsandra Line',
    driverId: 'd1',
    driverName: 'Ramesh Gowda',
    capacity: 50,
    currentOccupancy: 34,
    status: 'active', // active, inactive, maintenance, delayed
    speedKmh: 42.5,
    lat: 13.3392,
    lng: 77.1015,
    heading: 45,
    currentStopIndex: 1,
    nextStopName: 'B.H. Road Junction',
    etaMins: 4,
    expectedDelayMins: 0,
    gpsSignal: 'Strong (5G Telemetry)',
    lastUpdate: 'Just now'
  },
  {
    id: 'b2',
    busNumber: 'BUS-102',
    registrationNumber: 'KA-06-F-3310',
    routeId: 'r2',
    routeName: 'R102 - Railway Station → SSIT Express',
    driverId: 'd2',
    driverName: 'Suresh Kumar',
    capacity: 45,
    currentOccupancy: 22,
    status: 'active',
    speedKmh: 38.0,
    lat: 13.3440,
    lng: 77.0980,
    heading: 120,
    currentStopIndex: 1,
    nextStopName: 'Gubbi Gate Circle',
    etaMins: 7,
    expectedDelayMins: 0,
    gpsSignal: 'Strong (5G Telemetry)',
    lastUpdate: 'Just now'
  },
  {
    id: 'b3',
    busNumber: 'BUS-103',
    registrationNumber: 'KA-06-F-1094',
    routeId: 'r3',
    routeName: 'R103 - Siddaganga Math Shuttle',
    driverId: 'd3',
    driverName: 'Venkatesh Naik',
    capacity: 55,
    currentOccupancy: 46,
    status: 'delayed',
    speedKmh: 16.2,
    lat: 13.3275,
    lng: 77.1260,
    heading: 270,
    currentStopIndex: 2,
    nextStopName: 'B.H. Road Junction',
    etaMins: 12,
    expectedDelayMins: 6,
    gpsSignal: 'Moderate (B.H. Road Traffic)',
    lastUpdate: '10s ago'
  },
  {
    id: 'b4',
    busNumber: 'BUS-104',
    registrationNumber: 'KA-06-F-9041',
    routeId: 'r1',
    routeName: 'R101 - Bus Stand → Kyatsandra Line',
    driverId: 'd4',
    driverName: 'Priya Sharma',
    capacity: 50,
    currentOccupancy: 19,
    status: 'active',
    speedKmh: 41.0,
    lat: 13.3210,
    lng: 77.1400,
    heading: 90,
    currentStopIndex: 3,
    nextStopName: 'Bengaluru Road Toll',
    etaMins: 5,
    expectedDelayMins: 0,
    gpsSignal: 'Strong (5G Telemetry)',
    lastUpdate: 'Just now'
  },
  {
    id: 'b5',
    busNumber: 'BUS-512',
    registrationNumber: 'KA-06-F-7721',
    routeId: 'r2',
    routeName: 'R102 - Railway Station → SSIT Express',
    driverId: null,
    driverName: 'Unassigned',
    capacity: 40,
    currentOccupancy: 0,
    status: 'maintenance',
    speedKmh: 0,
    lat: 13.3350,
    lng: 77.1000,
    heading: 0,
    currentStopIndex: 0,
    nextStopName: 'Tumakuru KSRTC Depot',
    etaMins: 0,
    expectedDelayMins: 0,
    gpsSignal: 'Offline (Depot)',
    lastUpdate: '2 hours ago'
  }
];

export const INITIAL_ROUTES = [
  {
    id: 'r1',
    routeNumber: 'R101',
    routeName: 'Bus Stand → Kyatsandra Line',
    startStop: 'Tumakuru KSRTC Bus Stand',
    endStop: 'Kyatsandra Circle',
    totalDistanceKm: 8.5,
    estimatedDurationMins: 20,
    assignedBusesCount: 2,
    status: 'active',
    color: '#2563eb',
    stops: [
      { id: 's101', name: 'Tumakuru KSRTC Bus Stand', lat: 13.3392, lng: 77.1015, timeFromPrevMins: 0 },
      { id: 's102', name: 'B.H. Road Junction', lat: 13.3360, lng: 77.1040, timeFromPrevMins: 4 },
      { id: 's103', name: 'SIT Institute Campus', lat: 13.3275, lng: 77.1260, timeFromPrevMins: 6 },
      { id: 's104', name: 'Bengaluru Road Toll', lat: 13.3180, lng: 77.1350, timeFromPrevMins: 5 },
      { id: 's105', name: 'Kyatsandra Circle', lat: 13.3150, lng: 77.1480, timeFromPrevMins: 5 }
    ]
  },
  {
    id: 'r2',
    routeNumber: 'R102',
    routeName: 'Railway Station → SSIT College Express',
    startStop: 'Tumakuru Railway Station',
    endStop: 'SSIT Siddhartha Campus',
    totalDistanceKm: 7.2,
    estimatedDurationMins: 18,
    assignedBusesCount: 1,
    status: 'active',
    color: '#10b981',
    stops: [
      { id: 's201', name: 'Tumakuru Railway Station', lat: 13.3440, lng: 77.0980, timeFromPrevMins: 0 },
      { id: 's202', name: 'Gubbi Gate Circle', lat: 13.3420, lng: 77.0850, timeFromPrevMins: 5 },
      { id: 's203', name: 'Kunigal Road Cross', lat: 13.3310, lng: 77.0950, timeFromPrevMins: 6 },
      { id: 's204', name: 'SSIT Siddhartha Campus', lat: 13.3510, lng: 77.0620, timeFromPrevMins: 7 }
    ]
  },
  {
    id: 'r3',
    routeNumber: 'R103',
    routeName: 'Siddaganga Math Shuttle & B.H. Road',
    startStop: 'Siddaganga Kshetra',
    endStop: 'Tumakuru KSRTC Bus Stand',
    totalDistanceKm: 9.0,
    estimatedDurationMins: 24,
    assignedBusesCount: 1,
    status: 'active',
    color: '#f59e0b',
    stops: [
      { id: 's301', name: 'Siddaganga Kshetra', lat: 13.3210, lng: 77.1400, timeFromPrevMins: 0 },
      { id: 's302', name: 'SIT Institute Campus', lat: 13.3275, lng: 77.1260, timeFromPrevMins: 7 },
      { id: 's303', name: 'B.H. Road Junction', lat: 13.3360, lng: 77.1040, timeFromPrevMins: 8 },
      { id: 's304', name: 'Tumakuru KSRTC Bus Stand', lat: 13.3392, lng: 77.1015, timeFromPrevMins: 9 }
    ]
  }
];

export const INITIAL_STOPS = [
  { id: 's101', name: 'Tumakuru KSRTC Bus Stand', code: 'ST-101', lat: 13.3392, lng: 77.1015, routes: ['R101', 'R103'], status: 'Active' },
  { id: 's102', name: 'B.H. Road Junction', code: 'ST-102', lat: 13.3360, lng: 77.1040, routes: ['R101', 'R103'], status: 'Active' },
  { id: 's103', name: 'SIT Institute Campus', code: 'ST-103', lat: 13.3275, lng: 77.1260, routes: ['R101', 'R103'], status: 'Active' },
  { id: 's104', name: 'Bengaluru Road Toll', code: 'ST-104', lat: 13.3180, lng: 77.1350, routes: ['R101'], status: 'Active' },
  { id: 's105', name: 'Kyatsandra Circle', code: 'ST-105', lat: 13.3150, lng: 77.1480, routes: ['R101'], status: 'Active' },
  { id: 's201', name: 'Tumakuru Railway Station', code: 'ST-201', lat: 13.3440, lng: 77.0980, routes: ['R102'], status: 'Active' },
  { id: 's202', name: 'Gubbi Gate Circle', code: 'ST-202', lat: 13.3420, lng: 77.0850, routes: ['R102'], status: 'Active' }
];

export const INITIAL_DRIVERS = [
  { id: 'd1', name: 'Ramesh Gowda', phone: '+91 98450 12345', license: 'KA-06-2020-0012', assignedBus: 'BUS-101', assignedRoute: 'R101', status: 'on_shift', rating: 4.92, shiftHours: '06:00 - 14:00' },
  { id: 'd2', name: 'Suresh Kumar', phone: '+91 98450 23456', license: 'KA-06-2019-0045', assignedBus: 'BUS-102', assignedRoute: 'R102', status: 'on_shift', rating: 4.88, shiftHours: '08:00 - 16:00' },
  { id: 'd3', name: 'Venkatesh Naik', phone: '+91 98450 34567', license: 'KA-06-2021-0089', assignedBus: 'BUS-103', assignedRoute: 'R103', status: 'on_shift', rating: 4.75, shiftHours: '12:00 - 20:00' },
  { id: 'd4', name: 'Priya Sharma', phone: '+91 98450 45678', license: 'KA-06-2022-0034', assignedBus: 'BUS-104', assignedRoute: 'R101', status: 'on_shift', rating: 4.95, shiftHours: '14:00 - 22:00' }
];

export const INITIAL_LOST_ITEMS = [
  {
    id: 'l1',
    title: 'Black Leather Wallet',
    category: 'Wallets & Bags',
    description: 'Bi-fold leather wallet containing student ID card & cash.',
    photoUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
    busNumber: 'BUS-101',
    reportedBy: 'Chetan Kumar (Passenger)',
    date: '2026-08-10 14:30',
    tags: ['black', 'wallet', 'leather', 'cards'],
    status: 'reported'
  },
  {
    id: 'l2',
    title: 'Sony Noise-Canceling Headphones',
    category: 'Electronics',
    description: 'Silver headphones left near SIT Campus stop seating on BUS-102.',
    photoUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    busNumber: 'BUS-102',
    reportedBy: 'Ananya Rao (Passenger)',
    date: '2026-08-11 09:15',
    tags: ['electronics', 'headphones', 'sony', 'silver'],
    status: 'reported'
  }
];

export const INITIAL_FOUND_ITEMS = [
  {
    id: 'f1',
    title: 'Gentleman Leather Wallet',
    category: 'Wallets & Bags',
    description: 'Found near seat #12 on BUS-101 by driver Ramesh Gowda.',
    photoUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
    busNumber: 'BUS-101',
    reportedBy: 'Ramesh Gowda (Driver)',
    date: '2026-08-10 16:00',
    tags: ['black', 'wallet', 'leather', 'cards'],
    status: 'reported'
  }
];

export const INITIAL_NOTIFICATIONS = [
  { id: 'n1', title: 'Bus BUS-101 Arriving', message: 'BUS-101 (Bus Stand → Kyatsandra) is 2 stops away from SIT Institute Campus.', type: 'arrival', timestamp: '2 mins ago', read: false },
  { id: 'n2', title: 'Traffic Delay Alert', message: 'Route R103 experiencing +6 mins delay near B.H. Road Junction.', type: 'delay', timestamp: '15 mins ago', read: false },
  { id: 'n3', title: 'Lost & Found Match Suggestion', message: 'AI found potential 94% match for lost Black Leather Wallet.', type: 'match', timestamp: '1 hour ago', read: true }
];
