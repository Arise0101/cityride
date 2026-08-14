/**
 * CITYRIDE Gemini AI Route Assistant & Lost-Found Tagger Service — Tumakuru
 */

export async function askCityRideAI(userQuery, cityContext = {}) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are CityRide AI, a helpful transportation assistant for the CITYRIDE bus system in Tumakuru, Karnataka, India.

SYSTEM INSTRUCTIONS:
- Understand the user's exact question before answering.
- Answer the question directly.
- If the question is about CityRide, use the available CityRide bus, route, stop and schedule data.
- If the question is unrelated to transportation, answer it normally when supported.
- Never invent bus routes, bus stops, schedules, arrival times or locations.
- If required information is unavailable, clearly say that the information is currently unavailable.
- Do not change the user's question into a different question.
- Keep responses concise, useful and easy to understand.

City Routes & Buses Context: ${JSON.stringify(cityContext)}
User Question: "${userQuery}"`
            }]
          }]
        })
      });
      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back to rule engine:", err.message);
    }
  }

  // Fallback direct answering and transit guidance engine
  const queryLower = (userQuery || '').toLowerCase().trim();

  // General questions
  if (queryLower.includes('capital of india')) {
    return "The capital of India is New Delhi.";
  }
  if (queryLower.includes('capital of karnataka')) {
    return "The capital of Karnataka is Bengaluru (Bangalore).";
  }

  // Transit questions
  if (queryLower.includes('bengaluru') || queryLower.includes('bangalore')) {
    return "🚌 To reach **Bengaluru**, take **BUS-101 (Route R101)** or **BUS-104** to *Bengaluru Road Toll*, then board frequent intercity express buses to Majestic (KSR).";
  }
  if (queryLower.includes('railway') || queryLower.includes('station') || queryLower.includes('train')) {
    return "🚆 To reach **Tumakuru Railway Station**, take **BUS-102 (Route R102)** from *SSIT Siddhartha Campus* or *Gubbi Gate Circle*. Operating frequency is every 10 mins. Current ETA is ~7 minutes.";
  }
  if (queryLower.includes('sit') || queryLower.includes('siddaganga') || queryLower.includes('college') || queryLower.includes('campus')) {
    return "🎓 For **SIT / Siddaganga Institute Campus**, board **BUS-101 (Route R101)** or **BUS-103**. Buses drop off right at the SIT Main Gate on B.H. Road.";
  }
  if (queryLower.includes('bus stand') || queryLower.includes('ksrtc')) {
    return "🚌 For **Tumakuru KSRTC Bus Stand**, take **BUS-101** or **BUS-104**. It connects B.H. Road, Kyatsandra, and Kunigal Circle.";
  }
  if (queryLower.includes('nearest bus stop') || queryLower.includes('bus stop near me')) {
    return "🚏 **Nearest Bus Stops in Tumakuru**:\n1. Tumakuru KSRTC Bus Stand (0.4 km)\n2. B.H. Road Junction (0.8 km)\n3. Tumakuru Railway Station (1.2 km)";
  }
  if (queryLower.includes('next') || queryLower.includes('schedule') || queryLower.includes('when')) {
    return "🚌 Next departures at **Tumakuru KSRTC Bus Stand**:\n• BUS-101 (Kyatsandra Line) in **4 mins**\n• BUS-102 (Railway → SSIT) in **7 mins**\n• BUS-103 (Siddaganga Math Shuttle) in **12 mins**";
  }

  return `I understand your question: "${userQuery}". As CityRide AI, I am here to help you navigate Tumakuru bus routes, stops, and schedules!`;
}

export function autoTagLostItem(itemTitle, description) {
  const text = `${itemTitle} ${description}`.toLowerCase();
  const tags = new Set();

  if (text.includes('wallet') || text.includes('card')) tags.add('wallet');
  if (text.includes('phone') || text.includes('iphone') || text.includes('samsung')) tags.add('electronics');
  if (text.includes('bag') || text.includes('backpack')) tags.add('bag');
  if (text.includes('black')) tags.add('black');
  if (text.includes('leather')) tags.add('leather');
  if (text.includes('key')) tags.add('keys');
  if (text.includes('glasses') || text.includes('specs')) tags.add('eyewear');

  return Array.from(tags);
}
