/**
 * Vercel Serverless API — Health Check
 * Route: GET /api/health
 */
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  res.status(200).json({
    status: 'ok',
    app: 'CITYRIDE Smart Bus Backend (Tumakuru)',
    time: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
}
