/**
 * Vercel Serverless API — Drivers
 * Route: GET /api/drivers
 */

const drivers = [
  { id: 'd1', name: 'Ramesh Gowda', phone: '+91 98450 12345', license: 'KA-06-2020-0012', assignedBus: 'BUS-101', assignedRoute: 'R101', status: 'on_shift', rating: 4.92 },
  { id: 'd2', name: 'Suresh Kumar', phone: '+91 98450 23456', license: 'KA-06-2019-0045', assignedBus: 'BUS-102', assignedRoute: 'R102', status: 'on_shift', rating: 4.88 },
  { id: 'd3', name: 'Venkatesh Naik', phone: '+91 98450 34567', license: 'KA-06-2021-0089', assignedBus: 'BUS-103', assignedRoute: 'R103', status: 'on_shift', rating: 4.75 }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  res.status(200).json(drivers);
}
