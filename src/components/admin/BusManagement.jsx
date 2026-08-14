import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bus, Plus, Trash2, X } from 'lucide-react';

export default function BusManagement() {
  const { buses, routes, addBus, updateBus, deleteBus } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    busNumber: '',
    registrationNumber: '',
    routeId: routes[0]?.id || 'r1',
    capacity: 50,
    status: 'active'
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const selectedRoute = routes.find(r => r.id === formData.routeId);
    addBus({ ...formData, routeName: selectedRoute ? selectedRoute.routeName : 'City Central' });
    setShowAddModal(false);
    setFormData({ busNumber: '', registrationNumber: '', routeId: routes[0]?.id || 'r1', capacity: 50, status: 'active' });
  };

  const statusColors = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    delayed: 'bg-red-50 text-red-700 border-red-200',
    maintenance: 'bg-amber-50 text-amber-700 border-amber-200',
    inactive: 'bg-slate-100 text-slate-600 border-slate-200'
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-card-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-full">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <Bus className="w-5 h-5 text-blue-600 shrink-0" />
            <span>Bus Fleet Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 sm:mt-0.5">Register, assign drivers/routes, and monitor vehicle statuses</p>
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto min-h-[44px] px-5 py-3 rounded-xl sm:rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>ADD NEW BUS</span>
        </button>
      </div>

      {/* Mobile Card Layout for Fleet */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {buses.map((bus) => (
          <div key={bus.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-card-soft flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="inline-flex items-center justify-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 font-black text-sm w-max">
                  {bus.busNumber}
                </span>
                <span className="font-mono font-bold text-slate-700 text-xs">{bus.registrationNumber}</span>
              </div>
              <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase border ${statusColors[bus.status] || statusColors.inactive}`}>
                {bus.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="block text-slate-500 font-medium">Route</span>
                <span className="font-semibold text-slate-800">{bus.routeName}</span>
              </div>
              <div>
                <span className="block text-slate-500 font-medium">Driver</span>
                <span className="font-semibold text-slate-800">{bus.driverName}</span>
              </div>
              <div className="col-span-2">
                <span className="block text-slate-500 font-medium">Capacity</span>
                <span className="font-semibold text-slate-800">{bus.currentOccupancy}/{bus.capacity}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => updateBus(bus.id, { status: bus.status === 'active' ? 'delayed' : 'active' })}
                className="flex-1 min-h-[44px] px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 transition-colors text-xs text-center"
              >
                Toggle Status
              </button>
              <button onClick={() => deleteBus(bus.id)}
                className="min-h-[44px] w-[44px] flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors shrink-0"
                title="Delete Bus"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Fleet Table */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-card-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-extrabold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Bus Number</th>
                <th className="p-4">Registration</th>
                <th className="p-4">Assigned Route</th>
                <th className="p-4">Driver</th>
                <th className="p-4">Capacity</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {buses.map((bus) => (
                <tr key={bus.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 font-black text-sm inline-block">
                      {bus.busNumber}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-700">{bus.registrationNumber}</td>
                  <td className="p-4 font-semibold text-slate-800">{bus.routeName}</td>
                  <td className="p-4 text-slate-600">{bus.driverName}</td>
                  <td className="p-4 text-slate-600">{bus.currentOccupancy}/{bus.capacity}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase border inline-block ${statusColors[bus.status] || statusColors.inactive}`}>
                      {bus.status}
                    </span>
                  </td>
                  <td className="p-4 text-right flex items-center justify-end gap-2">
                    <button onClick={() => updateBus(bus.id, { status: bus.status === 'active' ? 'delayed' : 'active' })}
                      className="min-h-[36px] px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 transition-colors text-[11px]"
                    >
                      Toggle Status
                    </button>
                    <button onClick={() => deleteBus(bus.id)}
                      className="min-h-[36px] w-[36px] flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors"
                      title="Delete Bus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Bus Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-4 sm:p-6 rounded-t-3xl sm:rounded-3xl bg-white border border-slate-200 shadow-card-hover space-y-4 max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Add New Bus to Fleet</h3>
              <button onClick={() => setShowAddModal(false)} className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-700 -mr-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Bus Number</label>
                <input type="text" required placeholder="e.g. BUS-602" value={formData.busNumber}
                  onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Registration Number</label>
                <input type="text" required placeholder="e.g. CR-9912-NY" value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Assign Route</label>
                <select value={formData.routeId} onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                >
                  {routes.map(r => <option key={r.id} value={r.id}>{r.routeNumber} — {r.routeName}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Capacity</label>
                  <input type="number" value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <button type="submit"
                className="w-full min-h-[44px] py-3 mt-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all flex items-center justify-center"
              >
                SAVE BUS RECORD
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
