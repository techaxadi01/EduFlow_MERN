import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function WelcomeBack() {
  const navigate = useNavigate();
  const loggedUser = JSON.parse(sessionStorage.getItem('eduflow_logged_user')) || {};

  useEffect(() => {
    const token = sessionStorage.getItem('eduflow_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const timer = setTimeout(() => {
      navigate('/');
    }, 500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-100 text-center px-4">
      <div>
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-600 flex items-center justify-center text-white text-2xl shadow-lg">
          <i className="fas fa-graduation-cap"></i>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-2">
          Welcome Back, {loggedUser?.name || 'Student'}
        </h1>
        <p className="text-emerald-600 font-medium text-lg">
          ({loggedUser?.role || 'Student'})
        </p>
      </div>
    </div>
  );
}

export default WelcomeBack;
