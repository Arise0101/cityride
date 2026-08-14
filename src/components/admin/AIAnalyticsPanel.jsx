import React from 'react';
import { Sparkles, Activity, TrendingUp, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';

export default function AIAnalyticsPanel() {
  const accuracyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'ETA Prediction Accuracy (%)',
        data: [94.2, 96.5, 97.1, 95.8, 96.4, 98.0, 97.5],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const routeDelayData = {
    labels: ['R102 (Airport)', 'R204 (Tech)', 'R305 (Harbor)', 'R401 (Uni)'],
    datasets: [
      {
        label: 'Average Delay (Mins)',
        data: [1.2, 0.8, 8.4, 2.1],
        backgroundColor: ['#3b82f6', '#10b981', '#ef4444', '#f59e0b'],
        borderRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 10 } } }
    },
    scales: {
      x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Top Banner */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-glow-blue shrink-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <h2 className="text-lg sm:text-xl font-black text-white">AI Transit Intelligence</h2>
              <span className="w-max px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                XGBoost + Gemini ML Engine
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-1 sm:mt-0.5">Real-time ETA accuracy metrics, bottleneck detection & passenger demand forecasts</p>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl glass-card border border-slate-800">
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">ETA Accuracy Rate</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">96.4%</div>
          <span className="text-[10px] text-emerald-400 font-bold mt-1 block">±1.2 min variance</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl glass-card border border-slate-800">
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Avg System Delay</span>
          <div className="text-xl sm:text-2xl font-black text-white mt-1">2.4 mins</div>
          <span className="text-[10px] text-slate-400 font-bold mt-1 block">Across all city routes</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl glass-card border border-slate-800">
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Bottleneck Corridor</span>
          <div className="text-base sm:text-lg font-black text-amber-400 mt-1 truncate">Harbor Blvd</div>
          <span className="text-[10px] text-amber-400 font-bold mt-1 block">Congestion +8.4m</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl glass-card border border-slate-800">
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">AI Route Matches</span>
          <div className="text-xl sm:text-2xl font-black text-indigo-400 mt-1">98.2%</div>
          <span className="text-[10px] text-indigo-400 font-bold mt-1 block">Lost & Found precision</span>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl glass-card border border-slate-800 space-y-4">
          <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
            <span>Weekly AI Prediction Accuracy Trend</span>
          </h3>
          <div className="h-56 sm:h-64 w-full relative">
            <Line data={accuracyData} options={chartOptions} />
          </div>
        </div>

        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl glass-card border border-slate-800 space-y-4">
          <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 shrink-0" />
            <span>Average Delay Breakdown by Route</span>
          </h3>
          <div className="h-56 sm:h-64 w-full relative">
            <Bar data={routeDelayData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
