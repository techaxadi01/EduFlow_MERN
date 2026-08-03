import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/users/login', {
        identifier,
        password,
      });

      const user = response.data.user;
      const token = response.data.token;

      localStorage.setItem('eduflow_token', token);
      localStorage.setItem('eduflow_logged_user', JSON.stringify(user));

      setMessage({ text: `Welcome back, ${user.name}! Redirecting...`, isError: false });
      setIdentifier('');
      setPassword('');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid username/email or password.';
      setMessage({ text: errorMessage, isError: true });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white via-emerald-50/30 to-slate-50 text-slate-800">
      <div className="flex-grow bg-gradient-to-br from-teal-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-emerald-100 my-8">
          
          {/* Header Card Design with Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full text-emerald-600 mb-4 shadow-sm">
              <i className="fas fa-user-lock text-3xl"></i>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 text-sm mt-1.5 font-medium">Log in to manage your account credentials</p>
          </div>

          {message.text && (
            <div className="text-center mb-6 bg-slate-50 py-2.5 rounded-xl border border-slate-100">
              <p className={`text-sm font-semibold ${message.isError ? 'text-red-500' : 'text-emerald-600'}`}>
                {message.text}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username or Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <i className="fas fa-user"></i>
                </span>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Username or Email"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <i className="fas fa-lock"></i>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-emerald-600 transition"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3.5 rounded-xl shadow-lg hover:opacity-95 transition mt-2"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-600 font-bold hover:underline">
              Get Started
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
