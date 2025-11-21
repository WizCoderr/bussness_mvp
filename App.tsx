import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User } from './types';
import { HomePage } from './pages/HomePage';
import { PackageDetails } from './pages/PackageDetails';
import { AdminDashboard } from './pages/AdminDashboard';
import { PartnerDashboard } from './pages/PartnerDashboard';
import { LoginPage } from './pages/Login';
import { Layout } from './components/Layout';

// Auth Context Helper
export const AuthContext = React.createContext<{
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
}>({
  user: null,
  login: () => {},
  logout: () => {},
});

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('wanderlust_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('wanderlust_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('wanderlust_user');
  };

  return (
    <AuthContext.Provider value={{ user, login: handleLogin, logout: handleLogout }}>
      <HashRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/package/:id" element={<PackageDetails />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/admin" 
              element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/partner" 
              element={user?.role === 'partner' ? <PartnerDashboard /> : <Navigate to="/login" />} 
            />
          </Route>
        </Routes>
      </HashRouter>
    </AuthContext.Provider>
  );
}
