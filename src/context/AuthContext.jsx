import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Navigation & Auth Screens: 'ROLE_SELECTION' | 'LOGIN_FORM' | 'AUTHENTICATED'
  const [activeScreen, setActiveScreen] = useState('ROLE_SELECTION');
  const [selectedRoleForLogin, setSelectedRoleForLogin] = useState(null); // 'customer' | 'driver' | 'admin'

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'customer' | 'driver' | 'admin'
  const [currentUser, setCurrentUser] = useState(null);

  // Pre-configured Demo Accounts
  const demoUsers = {
    customer: {
      id: 'usr_c101',
      name: 'Alex Vance',
      email: 'customer@cityride.demo',
      role: 'customer',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500',
      phone: '+1 (555) 012-7788'
    },
    driver: {
      id: 'usr_d202',
      name: 'John Mitchell',
      email: 'driver@cityride.demo',
      driverId: 'DRV-102',
      role: 'driver',
      licenseNumber: 'DL-98214-X',
      rating: 4.92,
      assignedBus: 'BUS-102',
      assignedRoute: 'R102 - Airport Express'
    },
    admin: {
      id: 'usr_a303',
      name: 'Sarah Jenkins',
      email: 'admin@cityride.demo',
      role: 'admin',
      title: 'Senior Transit Administrator'
    }
  };

  const selectRole = (role) => {
    setSelectedRoleForLogin(role);
    setActiveScreen('LOGIN_FORM');
  };

  const backToRoleSelection = () => {
    setSelectedRoleForLogin(null);
    setActiveScreen('ROLE_SELECTION');
  };

  const login = (role, credentials = {}) => {
    const profile = demoUsers[role] || {
      id: `usr_${Date.now()}`,
      name: credentials.email ? credentials.email.split('@')[0] : 'User',
      email: credentials.email || `${role}@cityride.com`,
      role: role
    };

    setIsAuthenticated(true);
    setUserRole(role);
    setCurrentUser(profile);
    setActiveScreen('AUTHENTICATED');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentUser(null);
    setSelectedRoleForLogin(null);
    setActiveScreen('ROLE_SELECTION');
  };

  return (
    <AuthContext.Provider
      value={{
        activeScreen,
        selectedRoleForLogin,
        isAuthenticated,
        userRole,
        currentUser,
        selectRole,
        backToRoleSelection,
        login,
        logout,
        demoUsers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
