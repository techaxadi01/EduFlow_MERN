import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [classOrSubject, setClassOrSubject] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      // API call to MongoDB Atlas backend route
      const response = await axios.post('/api/users/register', {
        name,
        role,
        classOrSubject,
        username,
        email,
        password,
      });

      setMessage({
        text: 'Account created successfully! Redirecting to login...',
        isError: false,
      });

      setName('');
      setClassOrSubject('');
      setUsername('');
      setEmail('');
      setPassword('');

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to create account. Please try again.';
      setMessage({ text: errorMessage, isError: true });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white via-emerald-50/30 to-slate-50 text-slate-800">
      
      {/* MAIN FORM CONTAINER */}
      <div className="flex-grow bg-gradient-to-br from-teal-50 to-emerald-100 flex items-center justify-center p-4 py-10">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-emerald-100">
          
          {/* HEADER MATCHING IMAGE DESIGN */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full text-emerald-600 mb-4 shadow-sm">
              <i className="fas fa-user-plus text-3xl"></i>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-slate-500 text-sm mt-1.5 font-medium">
              Join EduFlow to start managing your academic workflow
            </p>
          </div>

          {/* Toast / Status Message */}
          {message.text && (
            <div className="text-center mb-6 bg-slate-50 py-2.5 rounded-xl border border-slate-100">
              <p
                className={`text-sm font-semibold ${
                  message.isError ? 'text-red-500' : 'text-emerald-600'
                }`}
              >
                {message.text}
              </p>
            </div>
          )}

          {/* ROLE SELECTOR TABS */}
          <div className="bg-slate-100 p-1.5 rounded-xl flex mb-6">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`w-1/2 py-2 text-sm font-semibold rounded-lg transition ${
                role === 'student' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={`w-1/2 py-2 text-sm font-semibold rounded-lg transition ${
                role === 'teacher' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500'
              }`}
            >
              Teacher
            </button>
          </div>

          {/* REGISTRATION FORM */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <i className="fas fa-user"></i>
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 transition text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {role === 'student' ? 'Class' : 'Core Subject'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <i className={role === 'student' ? 'fas fa-school' : 'fas fa-book-open'}></i>
                </span>
                <input
                  type="text"
                  value={classOrSubject}
                  onChange={(e) => setClassOrSubject(e.target.value)}
                  placeholder={role === 'student' ? 'e.g., MCA' : 'e.g., Physics'}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 transition text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <i className="fas fa-id-card"></i>
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 transition text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <i className="fas fa-envelope"></i>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 transition text-slate-800"
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
                  className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 transition text-slate-800"
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

            {/* TERMS AND CONDITIONS */}
            <div className="flex items-start pt-1">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="w-4 h-4 border border-gray-300 rounded bg-slate-50 focus:ring-3 focus:ring-emerald-300 accent-emerald-600 cursor-pointer"
                />
              </div>
              <label
                htmlFor="terms"
                className="ml-2.5 text-sm font-medium text-gray-600 select-none cursor-pointer"
              >
                I agree with the{' '}
                <a href="#" className="text-emerald-600 hover:underline font-bold">
                  Terms and Conditions
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3.5 rounded-xl shadow-lg hover:opacity-95 transition mt-2"
            >
              Create Account
            </button>
          </form>

          {/* BOTTOM REDIRECT LINK */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
