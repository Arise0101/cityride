import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LostFoundAdminPanel() {
  const { lostItems, foundItems, aiMatches, showToast } = useApp();

  const handleConfirmMatch = (match) => {
    showToast('Match Confirmed', `Notification sent to ${match.lostItem.reportedBy} & depot manager.`);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white">Lost & Found Control</h2>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-1 sm:mt-0.5">Review passenger lost reports, driver found items & AI auto-matches</p>
          </div>
        </div>
      </div>

      {/* AI Automated Matches Panel */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl glass-card border border-indigo-500/40 space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
            <span>AI Automated Matching Engine</span>
          </h3>
          <span className="inline-flex w-max px-3 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full font-bold text-[10px] sm:text-xs border border-indigo-500/30">
            {aiMatches.length} Matches Found
          </span>
        </div>

        {aiMatches.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center bg-slate-900/50 rounded-2xl border border-slate-800">No current pending matches requiring admin review.</p>
        ) : (
          <div className="space-y-3">
            {aiMatches.map((m, idx) => (
              <div key={idx} className="p-4 sm:p-5 rounded-2xl sm:rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="font-extrabold text-sm text-slate-100 flex flex-wrap items-center gap-2">
                    <span className="bg-slate-800 px-2 py-1 rounded-md">Lost: "{m.lostItem.title}"</span>
                    <span className="text-indigo-400 font-bold text-sm shrink-0">↔</span>
                    <span className="bg-slate-800 px-2 py-1 rounded-md">Found: "{m.foundItem.title}"</span>
                  </div>
                  <p className="text-xs text-slate-400">Bus: <strong className="text-slate-200">{m.lostItem.busNumber}</strong> • Match Confidence: <strong className="text-emerald-400">{m.matchScore}%</strong></p>
                </div>

                <button
                  onClick={() => handleConfirmMatch(m)}
                  className="w-full md:w-auto min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-glow-emerald flex items-center justify-center gap-2 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>CONFIRM MATCH</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reported Lost Items Table / Cards */}
      <div className="glass-panel border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4">
        <h3 className="text-sm sm:text-base font-extrabold text-white">Passenger Reported Lost Items</h3>

        {/* Mobile Cards View */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {lostItems.map(item => (
            <div key={item.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{item.category}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase whitespace-nowrap">
                  {item.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950 p-2 rounded-lg">
                  <span className="block text-slate-500 text-[10px] uppercase mb-0.5">Bus No.</span>
                  <span className="font-mono font-bold text-blue-400">{item.busNumber}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg">
                  <span className="block text-slate-500 text-[10px] uppercase mb-0.5">Reported By</span>
                  <span className="text-slate-300 truncate block">{item.reportedBy}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase font-extrabold text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">Item</th>
                <th className="p-4">Category</th>
                <th className="p-4">Bus Number</th>
                <th className="p-4">Reported By</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {lostItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-bold text-slate-100">{item.title}</td>
                  <td className="p-4 text-slate-400">{item.category}</td>
                  <td className="p-4 font-mono font-bold text-blue-400">{item.busNumber}</td>
                  <td className="p-4 text-slate-300">{item.reportedBy}</td>
                  <td className="p-4">
                    <span className="inline-flex px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
