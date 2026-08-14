import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bus, Play, Pause, Square, AlertTriangle, Radio } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DriverShiftDashboard() {
  const { currentUser } = useAuth();
  const { driverTripState, setDriverTripState, reportDriverIncident, showToast } = useApp();

  const [selectedIncident, setSelectedIncident] = useState('');
  const [incidentNote, setIncidentNote] = useState('');

  const handleStartTrip = () => {
    setDriverTripState(prev => ({ ...prev, isTripActive: true, tripStatus: 'in_progress' }));
    showToast('Trip Started', 'GPS telemetry broadcasting to passengers and control center.');
  };

  const handlePauseTrip = () => {
    setDriverTripState(prev => ({ ...prev, tripStatus: prev.tripStatus === 'paused' ? 'in_progress' : 'paused' }));
    showToast(driverTripState.tripStatus === 'paused' ? 'Trip Resumed' : 'Trip Paused', 'Telemetry updated.');
  };

  const handleEndTrip = () => {
    setDriverTripState(prev => ({ ...prev, isTripActive: false, tripStatus: 'ended' }));
    showToast('Trip Ended', 'Bus state updated to depot idle.');
  };

  const handleReportIncident = (e) => {
    e.preventDefault();
    if (!selectedIncident) return;
    reportDriverIncident(selectedIncident, incidentNote);
    setSelectedIncident('');
    setIncidentNote('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Driver Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-card-hover flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Bus className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white">
                Good morning, {currentUser?.name || 'Driver'} 👋
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                DRIVER ON SHIFT
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">License: {currentUser?.licenseNumber || 'DL-98214-X'} • Rating: ⭐ {currentUser?.rating || '4.92'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-emerald-400">
          <Radio className="w-4 h-4 animate-pulse" />
          <span>GPS TRANSMITTER ONLINE</span>
        </div>
      </div>

      {/* Today's Route & Trip Controls */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card-soft space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900">Assigned Route & Vehicle</h3>
          <span className="px-3 py-1 bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-sm">
            {driverTripState.busNumber}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Route</span>
            <div className="font-extrabold text-sm text-slate-900 mt-1">{driverTripState.routeName}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Next Stop</span>
            <div className="font-extrabold text-sm text-emerald-600 mt-1">{driverTripState.nextStop}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Passengers Onboard</span>
            <div className="font-extrabold text-sm text-slate-900 mt-1">{driverTripState.passengersOnboard} / 50</div>
          </div>
        </div>

        {/* Trip Controls */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <button onClick={handleStartTrip} disabled={driverTripState.tripStatus === 'in_progress'}
            className="py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>START TRIP</span>
          </button>

          <button onClick={handlePauseTrip}
            className="py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Pause className="w-4 h-4 fill-white" />
            <span>{driverTripState.tripStatus === 'paused' ? 'RESUME TRIP' : 'PAUSE TRIP'}</span>
          </button>

          <button onClick={handleEndTrip}
            className="py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Square className="w-4 h-4 fill-white" />
            <span>END TRIP</span>
          </button>
        </div>
      </div>

      {/* Incident Reporting */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card-soft space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <span>Report Incident to Control Center</span>
        </h3>

        <form onSubmit={handleReportIncident} className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'traffic', label: 'Traffic Congestion' },
              { id: 'breakdown', label: 'Bus Breakdown' },
              { id: 'accident', label: 'Road Accident' },
              { id: 'detour', label: 'Route Detour' }
            ].map(type => (
              <button key={type.id} type="button" onClick={() => setSelectedIncident(type.id)}
                className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                  selectedIncident === type.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          <textarea rows={2} value={incidentNote} onChange={(e) => setIncidentNote(e.target.value)}
            placeholder="Add additional incident details for dispatchers..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-amber-500"
          />

          <button type="submit" disabled={!selectedIncident}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-extrabold text-xs transition-all shadow-sm"
          >
            BROADCAST ALERT TO ADMIN
          </button>
        </form>
      </div>
    </div>
  );
}
