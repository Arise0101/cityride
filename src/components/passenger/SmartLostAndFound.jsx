import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Plus, Tag, Search, Sparkles, Image as ImageIcon, CheckCircle2, Clock, MapPin, Upload } from 'lucide-react';
import { autoTagImageDescription } from '../../services/aiService';

export default function SmartLostAndFound() {
  const { lostItems, foundItems, reportLostFoundItem, aiMatches } = useApp();

  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'report' | 'matches'
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Wallets & Bags',
    description: '',
    busNumber: 'BUS-102',
    photoUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
    type: 'lost'
  });

  const generatedTags = autoTagImageDescription(formData.title, formData.description);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;
    reportLostFoundItem({ ...formData, tags: generatedTags });
    setFormData({
      title: '',
      category: 'Wallets & Bags',
      description: '',
      busNumber: 'BUS-102',
      photoUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
      type: 'lost'
    });
    setActiveTab('browse');
  };

  const filteredItems = lostItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.busNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in pb-16 md:pb-12">
      {/* Top Header Banner */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-card-hover flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-white">Smart Lost & Found Hub</h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI AUTO-MATCHING
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Report lost items on buses and check AI match recommendations</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-2xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab('browse')}
            className={`py-2 px-2 sm:px-3.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all text-center touch-target ${activeTab === 'browse' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
          >
            BROWSE ({lostItems.length})
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`py-2 px-2 sm:px-3.5 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-all touch-target ${activeTab === 'report' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>REPORT</span>
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`py-2 px-2 sm:px-3.5 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-all touch-target ${activeTab === 'matches' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Sparkles className="w-3 h-3" />
            <span>AI ({aiMatches.length})</span>
          </button>
        </div>
      </div>

      {/* BROWSE TAB */}
      {activeTab === 'browse' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reported items (e.g. Wallet, BUS-102, Sony)..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-amber-500 shadow-card-soft"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {filteredItems.map(item => (
              <div key={item.id} className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-card-soft flex flex-col sm:flex-row items-start gap-4">
                <img
                  src={item.photoUrl}
                  alt={item.title}
                  className="w-full sm:w-24 h-40 sm:h-24 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                />
                <div className="flex-1 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-amber-700 rounded-md border border-slate-200">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                      {item.status}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mt-2">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-1">
                    {item.tags?.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono text-[9px] rounded border border-slate-200">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Bus: <strong className="text-slate-900">{item.busNumber}</strong></span>
                    <span>Date: {item.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REPORT TAB */}
      {activeTab === 'report' && (
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-card-soft space-y-4 max-w-2xl mx-auto">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-500" />
            <span>Submit Lost Item Report</span>
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Item Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Black Leather Tommy Hilfiger Wallet"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm"
              >
                <option value="Wallets & Bags">Wallets & Bags</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing & Accessories">Clothing & Accessories</option>
                <option value="Keys & Documents">Keys & Documents</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Bus Number</label>
              <select
                value={formData.busNumber}
                onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm"
              >
                <option value="BUS-102">BUS-102 (Airport Express)</option>
                <option value="BUS-204">BUS-204 (Tech Corridor)</option>
                <option value="BUS-305">BUS-305 (Harbor Loop)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Detailed Description</label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide color, brand, distinct features, seat location..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* AI Auto-Tag Preview */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>AI Tagging Preview:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {generatedTags.map((t, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-white text-amber-800 border border-amber-300 text-[10px] rounded font-mono font-bold">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm tracking-wider shadow-md flex items-center justify-center gap-2 touch-target"
          >
            <span>SUBMIT LOST REPORT</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* MATCHES TAB */}
      {activeTab === 'matches' && (
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>AI Automated Lost & Found Matches</span>
          </h3>

          {aiMatches.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500 shadow-card-soft">
              No matching pairs detected yet. As drivers log found items, AI continuously updates suggestions.
            </div>
          ) : (
            aiMatches.map((m, idx) => (
              <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-white border border-indigo-200 shadow-card-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center font-black text-sm flex-shrink-0">
                    {m.matchScore}%
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900">{m.lostItem.title} ↔ {m.foundItem.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Matched on Bus: {m.lostItem.busNumber} • Recommendation: <span className="text-emerald-700 font-bold">{m.recommendation}</span></p>
                  </div>
                </div>

                <button className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-electric-glow touch-target">
                  Notify Owner & Claim
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
