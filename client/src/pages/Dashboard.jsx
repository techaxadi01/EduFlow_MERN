import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  // Retrieve logged-in user details from localStorage
  const loggedUser = JSON.parse(localStorage.getItem('eduflow_logged_user')) || {
    name: 'Student',
    role: 'student',
    classOrSubject: 'Academic Member',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col justify-between">
      
      {/* MAIN CONTENT AREA */}
      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-20 px-6 border-b border-slate-900 bg-gradient-to-b from-slate-900/50 via-slate-950 to-slate-950">
          <div className="max-w-7xl mx-auto text-center relative z-10">
            
            {/* User Welcome Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-xs font-semibold mb-6">
              <i className="fas fa-user-circle"></i> Welcome back, {loggedUser.name} ({loggedUser.role})
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Empower Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Academic Journey</span>
            </h1>

            <p className="max-w-2xl mx-auto text-slate-400 text-base md:text-lg mb-8 font-medium">
              Track assignments, join peer focus rooms, and optimize your study sessions with EduFlow's integrated workspace.
            </p>

            {/* HERO CTA BUTTONS - Only Explore Resources is retained */}
            <div className="flex justify-center items-center gap-4">
              <a
                href="#resources"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-lg transition text-sm flex items-center gap-2"
              >
                <i className="fas fa-compass"></i> Explore Resources
              </a>
            </div>
          </div>
        </section>

        {/* DASHBOARD QUICK ACCESS / FEATURES SECTION */}
        <section id="resources" className="py-16 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Your Workspace Tools
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Quickly access all core modules from your dashboard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Focus Mode Card */}
            <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition rounded-2xl p-6 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition">
                  <i className="fas fa-stopwatch text-xl"></i>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Focus Mode</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Start distraction-free study sessions with customizable timers and ambient audio.
                </p>
              </div>
              <Link
                to="/focus"
                className="mt-6 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                Launch Focus Session <i className="fas fa-arrow-right text-[10px]"></i>
              </Link>
            </div>

            {/* Peer Radar Card */}
            <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition rounded-2xl p-6 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition">
                  <i className="fas fa-users text-xl"></i>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Peer Radar</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Discover study partners and active peer groups working on similar subjects.
                </p>
              </div>
              <Link
                to="/peer-radar"
                className="mt-6 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                Find Peers <i className="fas fa-arrow-right text-[10px]"></i>
              </Link>
            </div>

            {/* Assignment Tracker Card */}
            <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition rounded-2xl p-6 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition">
                  <i className="fas fa-tasks text-xl"></i>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Assignments</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Keep track of upcoming deadlines, submissions, and course assignments.
                </p>
              </div>
              <Link
                to="/assignment"
                className="mt-6 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                View Assignments <i className="fas fa-arrow-right text-[10px]"></i>
              </Link>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}

export default Dashboard;
