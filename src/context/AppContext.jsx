import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_BUSES,
  INITIAL_ROUTES,
  INITIAL_STOPS,
  INITIAL_DRIVERS,
  INITIAL_LOST_ITEMS,
  INITIAL_FOUND_ITEMS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';
import { BusMovementSimulator } from '../services/demoSimulator';
import { matchLostAndFoundItems } from '../services/aiService';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export function AppProvider({ children }) {
  const { userRole, currentUser } = useAuth();

  // App Data State
  const [buses, setBuses] = useState(INITIAL_BUSES);
  const [routes, setRoutes] = useState(INITIAL_ROUTES);
  const [stops, setStops] = useState(INITIAL_STOPS);
  const [drivers, setDrivers] = useState(INITIAL_DRIVERS);
  const [lostItems, setLostItems] = useState(INITIAL_LOST_ITEMS);
  const [foundItems, setFoundItems] = useState(INITIAL_FOUND_ITEMS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Simulator & Realtime Controls
  const [isDemoSimulating, setIsDemoSimulating] = useState(true);
  const [selectedBusForTracking, setSelectedBusForTracking] = useState(INITIAL_BUSES[0]);
  const [selectedRouteForView, setSelectedRouteForView] = useState(INITIAL_ROUTES[0]);

  // Active Driver Trip State
  const [driverTripState, setDriverTripState] = useState({
    isTripActive: true,
    tripStatus: 'in_progress', // 'in_progress' | 'paused' | 'ended'
    busNumber: 'BUS-101',
    routeName: 'R101 - Bus Stand → Kyatsandra Line',
    currentStop: 'Tumakuru KSRTC Bus Stand',
    nextStop: 'B.H. Road Junction',
    passengersOnboard: 34,
    scheduleVarianceMins: 1, // +1 min behind
  });

  // Toast Notification System State
  const [toastAlert, setToastAlert] = useState(null);

  const showToast = (title, message, type = 'success') => {
    setToastAlert({ id: Date.now(), title, message, type });
    setTimeout(() => {
      setToastAlert(null);
    }, 4500);
  };

  // Real-time GPS movement simulation hook
  useEffect(() => {
    if (!isDemoSimulating) return;

    const simulator = new BusMovementSimulator(routes, (updatedBuses) => {
      setBuses(updatedBuses);
      if (selectedBusForTracking) {
        const found = updatedBuses.find(b => b.id === selectedBusForTracking.id);
        if (found) setSelectedBusForTracking(found);
      }
    });

    simulator.start(buses);

    return () => simulator.stop();
  }, [isDemoSimulating, routes]);

  // CRUD Operations
  const addBus = (newBusData) => {
    const newBus = {
      id: `b${Date.now()}`,
      busNumber: newBusData.busNumber || `BUS-${Math.floor(100 + Math.random() * 900)}`,
      registrationNumber: newBusData.registrationNumber || `KA-06-F-${Math.floor(1000 + Math.random() * 9000)}`,
      routeId: newBusData.routeId || routes[0].id,
      routeName: newBusData.routeName || routes[0].routeName,
      driverId: newBusData.driverId || null,
      driverName: newBusData.driverName || 'Unassigned',
      capacity: Number(newBusData.capacity) || 50,
      currentOccupancy: 0,
      status: newBusData.status || 'active',
      speedKmh: 0,
      lat: 13.3392,
      lng: 77.1015,
      currentStopIndex: 0,
      nextStopName: 'Tumakuru Bus Stand Depot',
      etaMins: 5,
      expectedDelayMins: 0,
      gpsSignal: 'Strong',
      lastUpdate: 'Just now'
    };
    setBuses(prev => [newBus, ...prev]);
    showToast('Bus Added Successfully', `Bus ${newBus.busNumber} added to fleet.`);
  };

  const updateBus = (busId, updatedFields) => {
    setBuses(prev => prev.map(b => b.id === busId ? { ...b, ...updatedFields } : b));
    showToast('Bus Updated', `Bus records updated.`);
  };

  const deleteBus = (busId) => {
    setBuses(prev => prev.filter(b => b.id !== busId));
    showToast('Bus Deleted', `Bus removed from fleet database.`, 'warning');
  };

  const addDriver = (driverData) => {
    const newDriver = {
      id: `d${Date.now()}`,
      name: driverData.name,
      phone: driverData.phone || '+91 98450 00000',
      license: driverData.license || `KA-06-2023-${Math.floor(1000 + Math.random() * 9000)}`,
      assignedBus: driverData.assignedBus || 'Unassigned',
      assignedRoute: driverData.assignedRoute || 'None',
      status: 'available',
      rating: 5.0,
      shiftHours: '08:00 - 16:00'
    };
    setDrivers(prev => [newDriver, ...prev]);
    showToast('Driver Registered', `Driver ${newDriver.name} added.`);
  };

  const addRoute = (routeData) => {
    const newRoute = {
      id: `r${Date.now()}`,
      routeNumber: routeData.routeNumber || `R${Math.floor(100 + Math.random() * 800)}`,
      routeName: routeData.routeName,
      startStop: routeData.startStop,
      endStop: routeData.endStop,
      totalDistanceKm: Number(routeData.totalDistanceKm) || 10,
      estimatedDurationMins: Number(routeData.estimatedDurationMins) || 25,
      assignedBusesCount: 1,
      status: 'active',
      color: '#2563eb',
      stops: [
        { id: `s_${Date.now()}_1`, name: routeData.startStop, lat: 13.3392, lng: 77.1015 },
        { id: `s_${Date.now()}_2`, name: routeData.endStop, lat: 13.3150, lng: 77.1480 }
      ]
    };
    setRoutes(prev => [newRoute, ...prev]);
    showToast('Route Created', `Route ${newRoute.routeNumber} successfully mapped.`);
  };

  const reportLostFoundItem = (itemData) => {
    const newItem = {
      id: `${itemData.type === 'found' ? 'f' : 'l'}${Date.now()}`,
      title: itemData.title,
      category: itemData.category || 'General',
      description: itemData.description,
      photoUrl: itemData.photoUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500',
      busNumber: itemData.busNumber || 'BUS-101',
      reportedBy: userRole === 'driver' ? `${currentUser?.name || 'Driver'} (Driver)` : `${currentUser?.name || 'Passenger'} (Passenger)`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      tags: itemData.tags || ['personal_item'],
      status: 'reported'
    };

    if (itemData.type === 'found') {
      setFoundItems(prev => [newItem, ...prev]);
    } else {
      setLostItems(prev => [newItem, ...prev]);
    }
    showToast('Report Submitted', `Your Lost & Found item has been logged. AI matching initialized.`);
  };

  const reportDriverIncident = (incidentType, note) => {
    const newNotif = {
      id: `n${Date.now()}`,
      title: `Driver Alert: ${incidentType.toUpperCase()}`,
      message: `Driver ${currentUser?.name || 'Ramesh Gowda'} (BUS-101) reported: ${note || incidentType}`,
      type: 'delay',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    showToast('Incident Broadcasted', `Control center notified of ${incidentType}.`, 'warning');
  };

  const aiMatches = matchLostAndFoundItems(lostItems, foundItems);

  return (
    <AppContext.Provider
      value={{
        buses,
        routes,
        stops,
        drivers,
        lostItems,
        foundItems,
        notifications,
        aiMatches,
        isDemoSimulating,
        setIsDemoSimulating,
        selectedBusForTracking,
        setSelectedBusForTracking,
        selectedRouteForView,
        setSelectedRouteForView,
        driverTripState,
        setDriverTripState,
        toastAlert,
        showToast,
        addBus,
        updateBus,
        deleteBus,
        addDriver,
        addRoute,
        reportLostFoundItem,
        reportDriverIncident
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
