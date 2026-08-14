import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Plus, ShieldCheck, Star, Phone, X } from 'lucide-react';

export default function DriverManagement() {
  const { drivers, addDriver, buses, routes } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    license: '',
    assignedBus: 'BUS-102',
    assignedRoute: 'R102'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    addDriver(formData);
    setShowAddModal(false);
    setFormData({ name: '', phone: '', license: '', assignedBus: 'BUS-102', assignedRoute: 'R102' });
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-full">
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400 shrink-0" />
            <span>Driver Personnel Directory</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 sm:mt-0.5">Manage licenses, assigned vehicles, ratings, and active shift rosters</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto min-h-[44px] px-5 py-3 rounded-xl sm:rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-glow-blue flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>REGISTER NEW DRIVER</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {drivers.map((driver) => (
          <div key={driver.id} className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl glass-card border border-slate-800 flex flex-col sm:flex-row items-start gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 font-extrabold text-lg flex items-center justify-center border border-indigo-500/30 shrink-0">
                {driver.name.charAt(0)}
              </div>
              <div className="flex-1 sm:hidden">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-slate-100">{driver.name}</h3>
                  <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 shrink-0" />
                    <span>{driver.rating}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">License: <span className="text-slate-200 font-mono">{driver.license}</span></p>
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="hidden sm:block">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-slate-100">{driver.name}</h3>
                  <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 shrink-0" />
                    <span>{driver.rating}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">License: <span className="text-slate-200 font-mono">{driver.license}</span></p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Assigned Bus</span>
                  <strong className="text-blue-400">{driver.assignedBus}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Shift Status</span>
                  <strong className="text-emerald-400 uppercase">{driver.status}</strong>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-4 sm:p-6 rounded-t-3xl sm:rounded-3xl glass-panel border border-slate-800 shadow-2xl space-y-4 max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white">Register New Driver</h3>
              <button onClick={() => setShowAddModal(false)} className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-white -mr-2">
                <X className="w-5 h-5 shrink-0" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Vance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1.5">Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 (555) 019-9988"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1.5">Commercial Driver License ID</label>
                <input
                  type="text"
                  placeholder="e.g. DL-88912-K"
                  value={formData.license}
                  onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[44px] py-3 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-glow-blue flex items-center justify-center transition-all"
              >
                SAVE DRIVER RECORD
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
