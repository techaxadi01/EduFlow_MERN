import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ isLoggedIn, user }) {
  const navigate = useNavigate();

  const scrollToTop = (e) => {
    // If already on home page, handle smooth scroll to top directly
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('eduflow_token');
    sessionStorage.removeItem('eduflow_logged_user');
    navigate('/login');
  };

  return (
    <nav id="top" className="sticky top-0 z-50 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 shadow-xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <span className="text-3xl font-bold text-white flex items-center gap-2">
              <i className="fas fa-graduation-cap text-2xl"></i> EduFlow
            </span>
          </Link>

          {/* NAVIGATION LINKS */}
          <ul className="hidden md:flex gap-8 font-medium text-white">
            <li>
              <a 
                href="/#top" 
                onClick={scrollToTop} 
                className="hover:text-emerald-100 transition font-bold"
              >
                Home
              </a>
            </li>
            <li><a href="/#utility" className="hover:text-emerald-100 transition">Utility Hub</a></li>
            <li><a href="/#ai-bot" className="hover:text-emerald-100 transition">AI Bot</a></li>
            <li><Link to="/peer-radar" className="hover:text-emerald-100 transition">Peer Radar</Link></li>
            <li><Link to="/focus" className="hover:text-emerald-100 transition">Focus Mode</Link></li>
          </ul>

          {/* ACTION BUTTONS */}
          <div className="hidden md:flex gap-4">
            {isLoggedIn ? (
              <>
                <Link
                  to="/"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/20 text-white font-medium hover:bg-white/30 transition duration-200"
                >
                  <i className="fas fa-user-circle"></i>
                  {user?.name} ({user?.role || 'Student'})
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 rounded-xl border border-white text-white font-semibold hover:bg-white/20 hover:scale-105 transition duration-200 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-xl border border-white text-white font-semibold hover:bg-white/20 hover:scale-105 transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-white text-emerald-600 font-bold hover:bg-emerald-50 hover:scale-105 shadow-md transition duration-200"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
