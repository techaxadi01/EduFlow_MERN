import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const isLoggedIn = !!sessionStorage.getItem('eduflow_token');

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCardClick = (target) => {
    if (!target) return;
    if (target.startsWith('#')) {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(target);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* BACK TO TOP BUTTON */}
      <button
        id="backToTop"
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl border border-emerald-500/20 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          showScrollTop
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-10 scale-90 pointer-events-none'
        }`}
      >
        <i className="fas fa-arrow-up text-sm"></i>
      </button>

      {/* HERO SECTION */}
      <section className="relative flex items-center justify-center bg-slate-950 overflow-hidden py-24">
        <video id="heroVideo" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0">
          <source src="/bg.mp4" type="video/mp4" />
        </video>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Grid */}
            <div>
              <div className="inline-block bg-white px-5 py-2 rounded-full shadow mb-6">
                <span className="text-emerald-600 font-medium">Next Generation Learning Platform</span>
              </div>

              <h3 className="text-emerald-700 text-4xl md:text-5xl lg:text-5xl font-bold leading-tight mb-6">
                Your All-in-One Academic Resource & Assignment Management Platform
              </h3>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Access resources, connect with teachers, collaborate with peers, manage assignments, discover free tools and use AI-powered learning assistance.
              </p>

              <div className="flex flex-wrap gap-4">
                <a href="#utility" className="bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-teal-600 hover:scale-105 transition">
                  Explore Resources
                </a>
                {!isLoggedIn && (
                  <Link to="/register" className="bg-white border border-emerald-500 text-emerald-600 px-6 py-3 rounded-xl hover:bg-slate-200 hover:border-emerald-600 hover:scale-105 transition">
                    Get Started
                  </Link>
                )}
              </div>
            </div>

            {/* Right Grid */}
            <div>
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <Link to="/peer-radar" className="block bg-slate-50 rounded-2xl p-6 text-center shadow border border-transparent hover:border-emerald-400 hover:scale-105 transition duration-300">
                    <i className="fas fa-users text-4xl text-purple-600"></i>
                    <h3 className="font-semibold mt-4 text-slate-800">Peer Radar</h3>
                  </Link>

                  <Link to="/focus" className="block bg-slate-50 rounded-2xl p-6 text-center shadow border border-transparent hover:border-emerald-400 hover:scale-105 transition duration-300">
                    <i className="fas fa-stopwatch text-4xl text-orange-600"></i>
                    <h3 className="font-semibold mt-4 text-slate-800">Focus Mode</h3>
                  </Link>

                  <Link to="/assignment" className="block bg-slate-50 rounded-2xl p-6 text-center shadow border border-transparent hover:border-emerald-400 hover:scale-105 transition duration-300">
                    <i className="fas fa-list-check text-4xl text-red-500"></i>
                    <h3 className="font-semibold mt-4 text-slate-800">Assignments</h3>
                  </Link>

                  <a href="#ai-bot" className="block bg-slate-50 rounded-2xl p-6 text-center shadow border border-transparent hover:border-emerald-400 hover:scale-105 transition duration-300">
                    <i className="fas fa-robot text-4xl text-blue-600"></i>
                    <h3 className="font-semibold mt-4 text-slate-800">AI Tools</h3>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UTILITY HUB */}
      <section id="utility" className="py-24 bg-white text-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-4">Take Your Learning to the Next Level</h2>
          <p className="text-center text-gray-500 mb-16">One platform for learning, collaboration, productivity and growth.</p>

          <div className="grid md:grid-cols-3 gap-8">
            <div onClick={() => handleCardClick('/peer-radar')} className="utility-card bg-white hover:bg-emerald-50/50 hover:border-emerald-400 hover:scale-105 hover:shadow-lg rounded-xl shadow border border-slate-100 p-6 text-center transition-all duration-300 cursor-pointer">
              <i className="fas fa-users text-4xl text-purple-500"></i>
              <h3 className="font-semibold mt-4">Student Collaboration</h3>
              <p className="mt-2 text-gray-600">Find study partners and collaborate on projects.</p>
            </div>

            <div className="utility-card bg-white hover:bg-emerald-50/50 hover:border-emerald-400 hover:scale-105 hover:shadow-lg rounded-xl shadow border border-slate-100 p-6 text-center transition-all duration-300 cursor-pointer">
              <i className="fas fa-chalkboard-user text-4xl text-emerald-600"></i>
              <h3 className="font-semibold mt-4">Teacher Connect</h3>
              <p className="mt-2 text-gray-600">Faculty interaction, mentorship and academic guidance.</p>
            </div>

            <div onClick={() => handleCardClick('/focus')} className="utility-card bg-white hover:bg-emerald-50/50 hover:border-emerald-400 hover:scale-105 hover:shadow-lg rounded-xl shadow border border-slate-100 p-6 text-center transition-all duration-300 cursor-pointer">
              <i className="fas fa-stopwatch text-4xl text-orange-500"></i>
              <h3 className="text-2xl font-bold mt-4">Focus Mode</h3>
              <p className="mt-2 text-gray-600">Study with all the Distractions Blocked.</p>
            </div>

            <div onClick={() => handleCardClick('/assignment')} className="utility-card bg-white hover:bg-emerald-50/50 hover:border-emerald-400 hover:scale-105 hover:shadow-lg rounded-xl shadow border border-slate-100 p-6 text-center transition-all duration-300 cursor-pointer">
              <i className="fas fa-list-check text-4xl text-blue-500"></i>
              <h3 className="font-semibold mt-4">Assignment Tracker</h3>
              <p className="mt-2 text-gray-600">Track deadlines and receive smart reminders.</p>
            </div>

            <div className="utility-card bg-white hover:bg-emerald-50/50 hover:border-emerald-400 hover:scale-105 hover:shadow-lg rounded-xl shadow border border-slate-100 p-6 text-center transition-all duration-300 cursor-pointer">
              <i className="fas fa-calendar-check text-4xl text-red-500"></i>
              <h3 className="text-2xl font-bold mt-4">Study Planner</h3>
              <p className="mt-2 text-gray-600">Plan your Day & Stay Productive.</p>
            </div>

            <div className="utility-card bg-white hover:bg-emerald-50/50 hover:border-emerald-400 hover:scale-105 hover:shadow-lg rounded-xl shadow border border-slate-100 p-6 text-center transition-all duration-300 cursor-pointer">
              <i className="fas fa-circle-question text-4xl text-amber-500"></i>
              <h3 className="text-2xl font-bold mt-4">Quiz Hub</h3>
              <p className="mt-2 text-gray-600">Revise what you Studied through AI made Quizes.</p>
            </div>

            <div className="utility-card bg-white hover:bg-emerald-50/50 hover:border-emerald-400 hover:scale-105 hover:shadow-lg rounded-xl shadow border border-slate-100 p-6 text-center transition-all duration-300 cursor-pointer">
              <i className="fas fa-book text-4xl text-purple-400"></i>
              <h3 className="font-semibold mt-4">Academic Resources</h3>
              <p className="mt-2 text-gray-600">Notes, PDFs, PYQs, lab manuals and curated learning material.</p>
            </div>

            <div onClick={() => handleCardClick('#ai-bot')} className="utility-card bg-white hover:bg-emerald-50/50 hover:border-emerald-400 hover:scale-105 hover:shadow-lg rounded-xl shadow border border-slate-100 p-6 text-center transition-all duration-300 cursor-pointer">
              <i className="fas fa-robot text-4xl text-blue-600"></i>
              <h3 className="font-semibold mt-4">AI Study Assistant</h3>
              <p className="mt-2 text-gray-600">Generate summaries, quizzes and study plans.</p>
            </div>

            <div className="utility-card bg-white hover:bg-emerald-50/50 hover:border-emerald-400 hover:scale-105 hover:shadow-lg rounded-xl shadow border border-slate-100 p-6 text-center transition-all duration-300 cursor-pointer">
              <i className="fas fa-briefcase text-4xl text-amber-800"></i>
              <h3 className="font-semibold mt-4">Career Development</h3>
              <p className="mt-2 text-gray-600">Access internships, job opportunities and professional growth resources.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI BOT SECTION */}
      <section id="ai-bot" className="bg-gradient-to-b from-slate-100 to-white py-24 text-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-16">AI Powered Learning</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/60 border border-slate-200/80 rounded-2xl p-8 shadow-sm">
              <i className="fas fa-file-lines text-4xl text-emerald-500"></i>
              <h3 className="text-2xl font-bold mt-4">Notes Summarizer</h3>
            </div>
            <div className="bg-white/60 border border-slate-200/80 rounded-2xl p-8 shadow-sm">
              <i className="fas fa-calendar-check text-4xl text-blue-500"></i>
              <h3 className="text-2xl font-bold mt-4">Study Planner</h3>
            </div>
            <div className="bg-white/60 border border-slate-200/80 rounded-2xl p-8 shadow-sm">
              <i className="fas fa-circle-question text-4xl text-purple-500"></i>
              <h3 className="text-2xl font-bold mt-4">Quiz Generator</h3>
            </div>
          </div>
        </div>
      </section>

      {/* TYPOGRAPHY SECTION */}
      <section className="bg-slate-800 text-white py-24">
        <div className="max-w-4xl mx-auto px-6 prose prose-lg prose-invert">
          <h2 className="text-4xl font-bold text-white mb-6">How AI is Transforming Education</h2>
          <p className="mb-4">Artificial Intelligence is revolutionizing learning through adaptive study recommendations, automated assessments, note summarization and intelligent tutoring systems.</p>
          <p className="mb-4">EduFlow combines resources, assignments, collaboration and AI-driven assistance to help students learn more effectively and stay productively structured.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
