/**
 * Vercel Serverless API — Lost & Found
 * Route: GET /api/lost-found  |  POST /api/lost-found
 * Note: Vercel routes /api/lost-found to this file via vercel.json rewrites
 */

const lostItems = [
  { id: 'l1', title: 'Black Leather Wallet', category: 'Wallets & Bags', description: 'Bi-fold leather wallet with student ID card & cash', busNumber: 'BUS-101', photoUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500', date: '2026-08-10', tags: ['black', 'wallet', 'leather'], status: 'reported' }
];

const foundItems = [
  { id: 'f1', title: 'Gentleman Leather Wallet', category: 'Wallets & Bags', description: 'Found on seat #12 on BUS-101', busNumber: 'BUS-101', photoUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500', date: '2026-08-10', tags: ['black', 'leather', 'wallet'], status: 'reported' }
];

function autoTag(title = '', description = '') {
  const text = `${title} ${description}`.toLowerCase();
  const tags = new Set();
  if (text.includes('wallet') || text.includes('card')) tags.add('wallet');
  if (text.includes('phone') || text.includes('mobile')) tags.add('electronics');
  if (text.includes('bag') || text.includes('backpack')) tags.add('bag');
  if (text.includes('black')) tags.add('black');
  if (text.includes('leather')) tags.add('leather');
  if (text.includes('key')) tags.add('keys');
  if (text.includes('glasses')) tags.add('eyewear');
  if (tags.size === 0) tags.add('personal_item');
  return Array.from(tags);
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  if (req.method === 'GET') {
    return res.status(200).json({ lost: lostItems, found: foundItems });
  }

  if (req.method === 'POST') {
    const { title, description, category, photoUrl, busNumber, type } = req.body || {};
    const tags = autoTag(title, description);
    const prefix = type === 'found' ? 'f' : 'l';
    const newItem = {
      id: `${prefix}${Date.now()}`,
      title: title || 'Unnamed Item',
      category: category || 'General',
      description: description || '',
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500',
      busNumber: busNumber || 'Unknown',
      date: new Date().toISOString().split('T')[0],
      tags,
      status: 'reported'
    };
    if (type === 'found') foundItems.push(newItem);
    else lostItems.push(newItem);
    return res.status(201).json(newItem);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
