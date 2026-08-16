import React from 'react';
import { Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/common/Header';
import FloatingAIButton from './components/common/FloatingAIButton';

// Auth & Role Components
import RoleSelectionScreen from './components/auth/RoleSelectionScreen';
import RoleLoginForm from './components/auth/RoleLoginForm';
import RegisterForm from './components/auth/RegisterForm';

// Passenger Components
import PassengerHome from './components/passenger/PassengerHome';
import BusSearchAndDetails from './components/passenger/BusSearchAndDetails';
import LiveTrackingView from './components/passenger/LiveTrackingView';
import FullPageMapView from './components/passenger/FullPageMapView';
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
  Bus, Users, MapPin, Sparkles
} from 'lucide-react';

function AuthenticatedApplication() {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (targetTab) => {
    switch (targetTab) {
      case 'home': navigate('/home'); break;
      case 'bus-search': navigate('/routes'); break;
      case 'live-tracking': navigate('/map'); break;
      case 'ai-assistant': navigate('/ai'); break;
      case 'lost-found': navigate('/lost-found'); break;
      case 'profile': navigate('/profile'); break;
      default: navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white font-sans relative">
      {/* Global Application Header */}
      <Header />

      {/* Main Content Area */}
      <main className={`flex-1 max-w-7xl w-full mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 ${userRole === 'customer' ? 'pb-24 md:pb-16' : 'pb-16'}`}>
        {/* PASSENGER NAVIGATION BAR */}
        {userRole === 'customer' && (
          <div>
            {/* Desktop Passenger Navigation Links */}
            <div className="hidden md:flex mb-6 items-center justify-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-card-soft overflow-x-auto no-scrollbar max-w-2xl mx-auto">
              <Link
                to="/home"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  location.pathname === '/home' || location.pathname === '/' ? 'bg-blue-600 text-white shadow-electric-glow' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>

              <Link
                to="/routes"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  location.pathname === '/routes' ? 'bg-blue-600 text-white shadow-electric-glow' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Routes</span>
              </Link>

              <Link
                to="/map"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  location.pathname === '/map' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Navigation className="w-4 h-4" />
                <span>Live Map</span>
              </Link>

              <Link
                to="/ai"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  location.pathname === '/ai' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>CityRide AI</span>
              </Link>

              <Link
                to="/lost-found"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  location.pathname === '/lost-found' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Lost & Found</span>
              </Link>

              <Link
                to="/profile"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  location.pathname === '/profile' ? 'bg-blue-600 text-white shadow-electric-glow' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
            </div>

            {/* Routes Mapping */}
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<PassengerHome onNavigate={handleNavigate} />} />
              <Route path="/map" element={<FullPageMapView />} />
              <Route path="/routes" element={<BusSearchAndDetails onNavigate={handleNavigate} />} />
              <Route path="/ai" element={<CityRideAIAssistant />} />
              <Route path="/lost-found" element={<SmartLostAndFound />} />
              <Route path="/profile" element={<PassengerProfile />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </div>
        )}

        {/* DRIVER APPLICATION */}
        {userRole === 'driver' && (
          <Routes>
            <Route path="/" element={<Navigate to="/driver" replace />} />
            <Route path="/driver" element={<DriverShiftDashboard />} />
            <Route path="/driver/trip" element={<DriverShiftDashboard />} />
            <Route path="/driver/map" element={<FullPageMapView />} />
            <Route path="/driver/reports" element={<DriverShiftDashboard />} />
            <Route path="/driver/profile" element={<PassengerProfile />} />
            <Route path="*" element={<Navigate to="/driver" replace />} />
          </Routes>
        )}

        {/* ADMIN COMMAND CENTER */}
        {userRole === 'admin' && (
          <Routes>
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="/admin" element={<AdminDashboardOverview />} />
            <Route path="/admin/buses" element={<BusManagement />} />
            <Route path="/admin/drivers" element={<DriverManagement />} />
            <Route path="/admin/passengers" element={<DriverManagement />} />
            <Route path="/admin/routes" element={<RouteAndStopManagement />} />
            <Route path="/admin/stops" element={<RouteAndStopManagement />} />
            <Route path="/admin/schedules" element={<RouteAndStopManagement />} />
            <Route path="/admin/lost-found" element={<LostFoundAdminPanel />} />
            <Route path="/admin/analytics" element={<AIAnalyticsPanel />} />
            <Route path="/admin/settings" element={<AIAnalyticsPanel />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        )}
      </main>

      {/* Floating AI Circular Button for Passengers */}
      {userRole === 'customer' && <FloatingAIButton />}

      {/* Mobile Bottom Navigation Bar for Passenger Role */}
      {userRole === 'customer' && (
        <nav className="md:hidden bottom-nav">
          <div className="flex items-center justify-around max-w-md mx-auto">
            <Link
              to="/home"
              className={`bottom-nav-item ${location.pathname === '/home' || location.pathname === '/' ? 'active' : ''}`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>

            <Link
              to="/routes"
              className={`bottom-nav-item ${location.pathname === '/routes' ? 'active' : ''}`}
            >
              <Search className="w-5 h-5" />
              <span>Routes</span>
            </Link>

            <Link
              to="/map"
              className={`bottom-nav-item ${location.pathname === '/map' ? 'active text-emerald-600' : ''}`}
            >
              <Navigation className="w-5 h-5" />
              <span>Live Map</span>
            </Link>

            <Link
              to="/ai"
              className={`bottom-nav-item ${location.pathname === '/ai' ? 'active text-indigo-600' : ''}`}
            >
              <Bot className="w-5 h-5" />
              <span>CityRide AI</span>
            </Link>

            <Link
              to="/lost-found"
              className={`bottom-nav-item ${location.pathname === '/lost-found' ? 'active text-amber-600' : ''}`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Lost Item</span>
            </Link>

            <Link
              to="/profile"
              className={`bottom-nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}

function MainAppRoutes() {
  const { isAuthenticated, activeScreen } = useAuth();

  return (
    <Routes>
      <Route path="/register" element={<RegisterForm />} />
      <Route
        path="/login"
        element={activeScreen === 'ROLE_SELECTION' ? <RoleSelectionScreen /> : <RoleLoginForm />}
      />
      <Route
        path="/*"
        element={isAuthenticated ? <AuthenticatedApplication /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainAppRoutes />
      </AppProvider>
    </AuthProvider>
  );
}
