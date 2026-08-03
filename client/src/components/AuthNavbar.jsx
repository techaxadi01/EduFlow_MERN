import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function AuthNavbar() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 shadow-xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3">
            <span className="text-3xl font-bold text-white flex items-center gap-2">
              <i className="fas fa-graduation-cap"></i> EduFlow
            </span>
          </Link>
          <div className="flex gap-3">
            {isLoginPage ? (
              <Link
                to="/register"
                className="px-5 py-2 rounded-xl bg-white text-emerald-600 font-semibold hover:scale-105 transition shadow-sm"
              >
                Get Started
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 rounded-xl bg-white text-emerald-600 font-semibold hover:scale-105 transition shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AuthNavbar;
