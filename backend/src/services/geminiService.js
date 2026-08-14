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
              text: `You are CityRide AI, the intelligent transit navigator assistant for the CITYRIDE bus system in Tumakuru, Karnataka, India.
City Routes Context: ${JSON.stringify(cityContext)}
User Question: "${userQuery}"
Provide concise, helpful, friendly transportation advice including Tumakuru bus route numbers, ETAs, and stop directions.`
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

  // Fallback intelligent route guidance engine
  const queryLower = userQuery.toLowerCase();

  if (queryLower.includes('railway') || queryLower.includes('station') || queryLower.includes('train')) {
    return "🚆 To reach **Tumakuru Railway Station**, take **BUS-102 (Route R102)** from *SSIT Siddhartha Campus* or *Gubbi Gate Circle*. Operating frequency is every 10 mins. Current ETA is ~7 minutes.";
  }
  if (queryLower.includes('sit') || queryLower.includes('siddaganga') || queryLower.includes('college') || queryLower.includes('campus')) {
    return "🎓 For **SIT / Siddaganga Institute Campus**, board **BUS-101 (Route R101)** or **BUS-103**. Buses drop off right at the SIT Main Gate on B.H. Road.";
  }
  if (queryLower.includes('bus stand') || queryLower.includes('ksrtc')) {
    return "🚌 For **Tumakuru KSRTC Bus Stand**, take **BUS-101** or **BUS-104**. It connects B.H. Road, Kyatsandra, and Kunigal Circle.";
  }
  if (queryLower.includes('next') || queryLower.includes('schedule') || queryLower.includes('when')) {
    return "🚌 Next arrivals at **Tumakuru KSRTC Bus Stand**:\n• BUS-101 (Kyatsandra Line) in **4 mins**\n• BUS-102 (Railway → SSIT) in **7 mins**\n• BUS-103 (Siddaganga Math Shuttle) in **12 mins**";
  }

  return `🚌 I can help you find Tumakuru routes, check live bus ETAs, and transfer points! You can ask me:\n• "How do I reach Tumakuru Railway Station?"\n• "Which bus goes to SIT College Campus?"\n• "When is the next bus at KSRTC Bus Stand?"`;
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
