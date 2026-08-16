/**
 * Vercel Serverless API — AI Assistant (Gemini-powered)
 * Route: POST /api/ai/assistant
 *
 * Uses GEMINI_API_KEY from Vercel environment variables.
 * API key is NEVER exposed to the frontend.
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { question = '', context = {} } = req.body || {};
  const queryLower = question.toLowerCase().trim();

  const apiKey = process.env.GEMINI_API_KEY;

  // Try Gemini API if key is configured
  if (apiKey) {
    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are CityRide AI, a helpful transit assistant for CITYRIDE Tumakuru, Karnataka, India.

INSTRUCTIONS:
- Answer questions directly and concisely.
- For transit questions, use the CityRide data context provided.
- For general knowledge questions, answer normally.
- Never fabricate bus routes, stops, or schedules.

Context: ${JSON.stringify({ buses: context.buses || [], routes: context.routes || [] })}
User Question: "${question}"`
              }]
            }]
          })
        }
      );
      const data = await geminiRes.json();
      const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (answer) {
        return res.status(200).json({ question, answer, timestamp: new Date() });
      }
    } catch (err) {
      console.warn('Gemini API error, falling back to rule engine:', err.message);
    }
  }

  // Fallback rule-based engine (no API key required)
  let answer = '';

  if (queryLower.includes('capital of india')) {
    answer = 'The capital of India is New Delhi.';
  } else if (queryLower.includes('capital of karnataka')) {
    answer = 'The capital of Karnataka is Bengaluru (Bangalore).';
  } else if (queryLower.includes('bengaluru') || queryLower.includes('bangalore')) {
    answer = '🚌 To reach Bengaluru, take BUS-101 (Route R101) from Tumakuru KSRTC Bus Stand to Kyatsandra, then board a KSRTC intercity express to Majestic (KSR).';
  } else if (queryLower.includes('railway') || queryLower.includes('station')) {
    answer = '🚆 Take BUS-102 (Route R102) to reach Tumakuru Railway Station. Buses run every ~10 minutes. Current ETA: 7 minutes.';
  } else if (queryLower.includes('nearest bus stop') || queryLower.includes('bus stop near')) {
    answer = '🚏 Nearest Tumakuru stops:\n1. Tumakuru KSRTC Bus Stand (0.4 km)\n2. B.H. Road Junction (0.8 km)\n3. Tumakuru Railway Station (1.2 km)';
  } else if (queryLower.includes('next') || queryLower.includes('schedule') || queryLower.includes('when')) {
    answer = '🚌 Next departures from KSRTC Bus Stand:\n• BUS-101 (Kyatsandra Line) in 4 mins\n• BUS-102 (Railway→SSIT) in 7 mins\n• BUS-103 (Siddaganga Shuttle) in 12 mins';
  } else if (queryLower.includes('lost') || queryLower.includes('found')) {
    answer = '🔍 To report a lost or found item, go to the Lost & Found section in the app. You can describe the item, attach the bus number, and our AI will attempt to match it with reports.';
  } else {
    answer = `I understand your question: "${question}". I am CityRide AI — your Tumakuru transit guide. Ask me about bus routes, stops, schedules, or ETAs!`;
  }

  return res.status(200).json({ question, answer, timestamp: new Date() });
}
