import React, { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Compass, LogOut, User as UserIcon, LogIn } from 'lucide-react';

export const Layout: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-brand-600 font-bold text-xl">
            <Compass className="w-8 h-8" />
            <span>WanderLust</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-brand-600 font-medium">Packages</Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-800">
                   {user.name} ({user.role})
                </span>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-sm text-brand-600 font-medium hover:underline">Dashboard</Link>
                )}
                {user.role === 'partner' && (
                  <Link to="/partner" className="text-sm text-brand-600 font-medium hover:underline">Dashboard</Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-700 font-medium hover:bg-brand-100 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Partner/Admin</span>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 text-white font-bold text-xl">
            <Compass className="w-6 h-6" />
            <span>WanderLust</span>
          </div>
          <p className="mb-6 max-w-lg mx-auto">
            Connecting travelers with the best local agencies for unforgettable journeys.
          </p>
          <div className="text-sm">
            © {new Date().getFullYear()} WanderLust Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
