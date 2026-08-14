import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bus, Users, Navigation, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

export default function AdminDashboardOverview({ onNavigate }) {
  const { buses, drivers } = useApp();

  const activeBuses = buses.filter(b => b.status === 'active').length;
  const delayedBuses = buses.filter(b => b.status === 'delayed').length;
  const maintenanceBuses = buses.filter(b => b.status === 'maintenance').length;
  const activeDrivers = drivers.filter(d => d.status === 'on_shift').length;

  const hourlyTripsData = {
    labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
    datasets: [{
      label: 'Passenger Trips',
      data: [120, 480, 290, 310, 380, 560, 490, 210],
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.08)',
      fill: true,
      tension: 0.4,
      borderWidth: 2.5,
      pointBackgroundColor: '#2563eb'
    }]
  };

  const fleetStatusData = {
    labels: ['Active', 'Delayed', 'Maintenance'],
    datasets: [{
      data: [activeBuses, delayedBuses, maintenanceBuses || 1],
      backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
      borderWidth: 0,
      hoverOffset: 6
    }]
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#475569', font: { family: 'Inter', size: 11 } } } },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(15,23,42,0.05)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(15,23,42,0.05)' } }
    }
  };

  const stats = [
    { label: 'Total Buses', value: buses.length, color: 'text-blue-600', icon: <Bus className="w-5 h-5 shrink-0" />, bg: 'bg-blue-50 text-blue-600', sub: 'Fleet registered' },
    { label: 'Active Buses', value: activeBuses, color: 'text-emerald-600', icon: <CheckCircle2 className="w-5 h-5 shrink-0" />, bg: 'bg-emerald-50 text-emerald-600', sub: 'Live on route' },
    { label: 'Active Drivers', value: activeDrivers, color: 'text-indigo-600', icon: <Users className="w-5 h-5 shrink-0" />, bg: 'bg-indigo-50 text-indigo-600', sub: 'On shift now' },
    { label: 'Delayed Buses', value: delayedBuses, color: 'text-red-600', icon: <AlertTriangle className="w-5 h-5 shrink-0" />, bg: 'bg-red-50 text-red-600', sub: 'Needs attention' }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 pb-12">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, i) => (
          <div key={i} className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-card-soft flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{s.label}</span>
              <div className={`text-xl sm:text-2xl font-black mt-1 ${s.color}`}>{s.value}</div>
              <span className="text-[10px] sm:text-xs text-slate-400 font-bold mt-0.5 block">{s.sub}</span>
            </div>
            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>{s.icon}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-card-soft space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600 shrink-0" />
              Today's Passenger Volume
            </h3>
            <span className="text-xs font-bold text-slate-500">Total: 2,840</span>
          </div>
          <div className="h-48 sm:h-56 lg:h-60 w-full relative"><Line data={hourlyTripsData} options={chartOptions} /></div>
        </div>

        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-card-soft space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900">Fleet Status Ratio</h3>
          <div className="h-48 sm:h-52 w-full relative flex items-center justify-center">
            <Doughnut data={fleetStatusData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#64748b', padding: 12 } } } }} />
          </div>
        </div>
      </div>

      {/* Quick Access Shortcuts */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900 border border-slate-800 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        <div className="w-full xl:w-auto">
          <h4 className="font-extrabold text-sm sm:text-base text-white">Quick Actions</h4>
          <p className="text-xs text-slate-400 mt-1">Jump to fleet, driver, route or Lost & Found management</p>
        </div>
        <div className="flex flex-col xs:flex-row flex-wrap items-center gap-2 w-full xl:w-auto">
          <button onClick={() => onNavigate('buses')} className="w-full xs:w-auto min-h-[44px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center justify-center">Manage Buses</button>
          <button onClick={() => onNavigate('drivers')} className="w-full xs:w-auto min-h-[44px] px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/20 flex items-center justify-center">Manage Drivers</button>
          <button onClick={() => onNavigate('routes')} className="w-full xs:w-auto min-h-[44px] px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/20 flex items-center justify-center">Manage Routes</button>
          <button onClick={() => onNavigate('lost-found-admin')} className="w-full xs:w-auto min-h-[44px] px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center">Lost & Found AI</button>
        </div>
      </div>
    </div>
  );
}
