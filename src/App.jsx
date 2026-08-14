import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/common/Header';

// Auth & Role Components
import RoleSelectionScreen from './components/auth/RoleSelectionScreen';
import RoleLoginForm from './components/auth/RoleLoginForm';

// Passenger Components
import SplashAndOnboarding from './components/passenger/SplashAndOnboarding';
import PassengerHome from './components/passenger/PassengerHome';
import BusSearchAndDetails from './components/passenger/BusSearchAndDetails';
import LiveTrackingView from './components/passenger/LiveTrackingView';
import CityRideAIAssistant from './components/passenger/CityRideAIAssistant';
import SmartLostAndFound from './components/passenger/SmartLostAndFound';
import PassengerProfile from './components/passenger/PassengerProfile';

// Driver Components
import DriverShiftDashboard from './components/driver/DriverShiftDashboard';

// Admin Components
import AdminDashboardOverview from './components/admin/AdminDashboardOverview';
import BusManagement from './components/admin/BusManagement';
import DriverManagement from './components/admin/DriverManagement';
import RouteAndStopManagement from './components/admin/RouteAndStopManagement';
import LostFoundAdminPanel from './components/admin/LostFoundAdminPanel';
import AIAnalyticsPanel from './components/admin/AIAnalyticsPanel';

import {
  Home, Search, Navigation, Bot, ShieldCheck, User, LayoutDashboard,
  Bus, Users, MapPin, Sparkles, Menu, X
} from 'lucide-react';

function AuthenticatedApplication() {
  const { userRole } = useAuth();

  // Navigation Sub-states
  const [passengerTab, setPassengerTab] = useState('home'); // 'home' | 'bus-search' | 'live-tracking' | 'ai-assistant' | 'lost-found' | 'profile'
  const [adminTab, setAdminTab] = useState('overview'); // 'overview' | 'live-fleet-map' | 'buses' | 'drivers' | 'routes' | 'lost-found-admin' | 'ai-analytics'
  const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white font-sans">
      {/* Global Application Header */}
      <Header />

      {/* Main Content Area */}
      <main className={`flex-1 max-w-7xl w-full mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 ${userRole === 'customer' ? 'pb-20 md:pb-12' : 'pb-12'}`}>
        {/* CUSTOMER / PASSENGER APPLICATION */}
        {userRole === 'customer' && (
          <div>
            {/* Desktop Passenger Navigation Tabs */}
            <div className="hidden md:flex mb-6 items-center justify-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-card-soft overflow-x-auto no-scrollbar max-w-2xl mx-auto">
              <button
                onClick={() => setPassengerTab('home')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  passengerTab === 'home' ? 'bg-blue-600 text-white shadow-electric-glow' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>

              <button
                onClick={() => setPassengerTab('bus-search')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  passengerTab === 'bus-search' ? 'bg-blue-600 text-white shadow-electric-glow' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>

              <button
                onClick={() => setPassengerTab('live-tracking')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  passengerTab === 'live-tracking' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Navigation className="w-4 h-4" />
                <span>Live Map</span>
              </button>

              <button
                onClick={() => setPassengerTab('ai-assistant')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  passengerTab === 'ai-assistant' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>CityRide AI</span>
              </button>

              <button
                onClick={() => setPassengerTab('lost-found')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  passengerTab === 'lost-found' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Lost & Found</span>
              </button>

              <button
                onClick={() => setPassengerTab('profile')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  passengerTab === 'profile' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
            </div>

            {/* View Switching */}
            {passengerTab === 'home' && <PassengerHome onNavigate={(tab) => setPassengerTab(tab)} />}
            {passengerTab === 'bus-search' && <BusSearchAndDetails onNavigate={(tab) => setPassengerTab(tab)} />}
            {passengerTab === 'live-tracking' && <LiveTrackingView />}
            {passengerTab === 'ai-assistant' && <CityRideAIAssistant />}
            {passengerTab === 'lost-found' && <SmartLostAndFound />}
            {passengerTab === 'profile' && <PassengerProfile />}
            
            {/* Mobile Bottom Navigation */}
            <div className="md:hidden bottom-nav fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50 pb-safe">
              <div className="flex items-center justify-around p-2">
                {[
                  { id: 'home', icon: Home, label: 'Home' },
                  { id: 'bus-search', icon: Search, label: 'Search' },
                  { id: 'live-tracking', icon: Navigation, label: 'Map' },
                  { id: 'ai-assistant', icon: Bot, label: 'AI' },
                  { id: 'lost-found', icon: ShieldCheck, label: 'Found' },
                  { id: 'profile', icon: User, label: 'Profile' }
                ].map(item => {
                  const Icon = item.icon;
                  const isActive = passengerTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setPassengerTab(item.id)}
                      className={`bottom-nav-item flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-1 transition-all ${
                        isActive ? 'bottom-nav-item active text-blue-600 scale-110' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                      <span className="text-[10px] font-bold leading-none">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* DRIVER APPLICATION */}
        {userRole === 'driver' && (
          <DriverShiftDashboard />
        )}

        {/* ADMIN DASHBOARD APPLICATION */}
        {userRole === 'admin' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative">
            {/* Admin Header with Mobile Menu Button */}
            <div className="lg:hidden flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-slate-800">Admin Dashboard</h2>
              <button 
                onClick={() => setIsAdminDrawerOpen(true)}
                className="p-2 -mr-2 text-slate-600 hover:bg-slate-100 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Admin Drawer Overlay */}
            {isAdminDrawerOpen && (
              <div 
                className="admin-drawer-overlay fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
                onClick={() => setIsAdminDrawerOpen(false)}
              />
            )}

            {/* Admin Sidebar Navigation */}
            <aside className={`
              admin-drawer fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-full lg:shadow-card-soft lg:z-0 border-r lg:border border-slate-200 lg:rounded-3xl p-4 h-full lg:h-fit overflow-y-auto lg:overflow-visible
              ${isAdminDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <span className="font-extrabold text-slate-900 text-lg">Admin Menu</span>
                <button 
                  onClick={() => setIsAdminDrawerOpen(false)}
                  className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                Admin Management
              </div>

              <div className="space-y-2">
                {[
                  { id: 'overview', label: 'Overview Stats', icon: <LayoutDashboard className="w-4 h-4" /> },
                  { id: 'live-fleet-map', label: 'Live Fleet Radar', icon: <Navigation className="w-4 h-4" /> },
                  { id: 'buses', label: 'Buses Fleet', icon: <Bus className="w-4 h-4" /> },
                  { id: 'drivers', label: 'Drivers Directory', icon: <Users className="w-4 h-4" /> },
                  { id: 'routes', label: 'Routes & Stops', icon: <MapPin className="w-4 h-4" /> },
                  { id: 'lost-found-admin', label: 'Lost & Found Matches', icon: <ShieldCheck className="w-4 h-4" /> },
                  { id: 'ai-analytics', label: 'AI & ETA Analytics', icon: <Sparkles className="w-4 h-4" /> }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setAdminTab(item.id);
                      setIsAdminDrawerOpen(false); // Close drawer on selection (mobile)
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm lg:text-xs font-bold transition-all text-left min-h-[44px] ${
                      adminTab === item.id
                        ? 'bg-blue-600 text-white shadow-electric-glow'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </aside>

            {/* Main Admin View Content */}
            <section className="lg:col-span-4">
              {adminTab === 'overview' && <AdminDashboardOverview onNavigate={(tab) => setAdminTab(tab)} />}
              {adminTab === 'live-fleet-map' && <LiveTrackingView />}
              {adminTab === 'buses' && <BusManagement />}
              {adminTab === 'drivers' && <DriverManagement />}
              {adminTab === 'routes' && <RouteAndStopManagement />}
              {adminTab === 'lost-found-admin' && <LostFoundAdminPanel />}
              {adminTab === 'ai-analytics' && <AIAnalyticsPanel />}
            </section>
          </div>
        )}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-slate-200/80 py-6 px-4 text-center text-xs text-slate-500 mt-12 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="font-extrabold text-slate-900 text-sm sm:text-xs">CITYRIDE</span>
            <span className="hidden sm:inline">—</span>
            <span className="text-slate-500">Commercial Smart City Bus Platform</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-slate-400 font-medium">
            <span className="hidden sm:inline">Role Authentication Verified</span>
            <span className="hidden sm:inline">•</span>
            <span>Gemini AI Engine</span>
            <span>•</span>
            <span>5G Live Telemetry</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MainRoot() {
  const { activeScreen } = useAuth();

  if (activeScreen === 'ROLE_SELECTION') {
    return <RoleSelectionScreen />;
  }

  if (activeScreen === 'LOGIN_FORM') {
    return <RoleLoginForm />;
  }

  return (
    <AppProvider>
      <AuthenticatedApplication />
    </AppProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainRoot />
    </AuthProvider>
  );
}
