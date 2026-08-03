import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function FocusMode() {
  const [studyMins, setStudyMins] = useState(45);
  const [breakMins, setBreakMins] = useState(15);
  const [timeRemaining, setTimeRemaining] = useState(45 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreakPhase, setIsBreakPhase] = useState(false);

  // Analytics State
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(0);
  const [completedSessionsCount, setCompletedSessionsCount] = useState(0);

  // Audio References
  const focusEndAudioRef = useRef(null);
  const breakEndAudioRef = useRef(null);
  const soundTimerRef = useRef(null);

  // Fetch Focus Stats from MongoDB on Load
  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('eduflow_token');
      if (!token) return;

      try {
        const response = await axios.get('/api/focus-sessions/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalFocusMinutes(response.data.totalMinutes || 0);
        setCompletedSessionsCount(response.data.totalSessions || 0);
      } catch (error) {
        console.error('Error fetching focus stats:', error);
      }
    };

    fetchStats();

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Timer Countdown Loop
  useEffect(() => {
    let timer = null;

    if (isRunning && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isRunning) {
      handlePhaseCompletion();
    }

    return () => clearInterval(timer);
  }, [isRunning, timeRemaining]);

  // Handle Phase Switch / Session Logging
  const handlePhaseCompletion = async () => {
    setIsRunning(false);

    if (!isBreakPhase) {
      // Focus Completed -> Switch to Break
      setIsBreakPhase(true);
      setTimeRemaining(breakMins * 60);
      playAlarmLoop(focusEndAudioRef.current);
      triggerNotification('Focus Complete!', 'Time to step away and take your break.');

      // Log Session to Database
      const token = localStorage.getItem('eduflow_token');
      if (token) {
        try {
          await axios.post(
            '/api/focus-sessions',
            { subject: 'General Focus', durationMinutes: studyMins },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setTotalFocusMinutes((prev) => prev + studyMins);
          setCompletedSessionsCount((prev) => prev + 1);
        } catch (error) {
          console.error('Error logging focus session:', error);
        }
      }
    } else {
      // Break Completed -> Switch back to Focus
      setIsBreakPhase(false);
      setTimeRemaining(studyMins * 60);
      playAlarmLoop(breakEndAudioRef.current);
      triggerNotification('Break Over!', "Let's dive back in and focus.");
    }
  };

  const stopAlarmPlayback = () => {
    if (soundTimerRef.current) clearTimeout(soundTimerRef.current);
    if (focusEndAudioRef.current) {
      focusEndAudioRef.current.pause();
      focusEndAudioRef.current.currentTime = 0;
    }
    if (breakEndAudioRef.current) {
      breakEndAudioRef.current.pause();
      breakEndAudioRef.current.currentTime = 0;
    }
  };

  const playAlarmLoop = (audioElement) => {
    stopAlarmPlayback();
    if (audioElement) {
      audioElement.currentTime = 0;
      audioElement.loop = true;
      audioElement.play().catch(() => console.log('Awaiting user activation.'));

      soundTimerRef.current = setTimeout(() => {
        audioElement.pause();
        audioElement.currentTime = 0;
      }, 60000);
    }
  };

  const triggerNotification = (title, msg) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: msg,
        icon: 'https://cdn-icons-png.flaticon.com/512/2921/2921222.png',
      });
    } else {
      alert(`${title}\n${msg}`);
    }
  };

  const toggleTimer = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => console.log('Fullscreen handled.'));
    }

    stopAlarmPlayback();
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    stopAlarmPlayback();
    setIsRunning(false);
    setIsBreakPhase(false);
    setTimeRemaining(studyMins * 60);
  };

  const handleStudyChange = (e) => {
    const newMins = parseInt(e.target.value) || 1;
    setStudyMins(newMins);
    if (!isRunning && !isBreakPhase) setTimeRemaining(newMins * 60);
  };

  const handleBreakChange = (e) => {
    const newMins = parseInt(e.target.value) || 1;
    setBreakMins(newMins);
    if (!isRunning && isBreakPhase) setTimeRemaining(newMins * 60);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => console.log('Blocked'));
    } else {
      document.exitFullscreen();
    }
  };

  // Format Display
  const mins = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
  const secs = (timeRemaining % 60).toString().padStart(2, '0');

  return (
    <div className="bg-slate-950 text-white min-h-screen flex flex-col items-center justify-center font-sans relative overflow-hidden">
      {/* Exit / Fullscreen Header */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center text-sm">
        <Link to="/" className="text-slate-400 hover:text-white transition flex items-center gap-2">
          <i className="fas fa-graduation-cap text-xl"></i> EduFlow - Focus Mode
        </Link>
        <button
          onClick={toggleFullscreen}
          className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition"
        >
          Toggle Fullscreen
        </button>
      </div>

      <div className="text-center max-w-md w-full px-6 flex flex-col items-center">
        
        {/* ANALYTICS STATS CARDS (INTEGRATED MATCHING THEME) */}
        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center shadow-lg">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Focused Minutes</p>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">{totalFocusMinutes} mins</h3>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center shadow-lg">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Completed Sessions</p>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">{completedSessionsCount}</h3>
          </div>
        </div>

        {/* TIMER STATUS BADGE */}
        <span
          className={`text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full ${
            isBreakPhase
              ? 'text-rose-400 bg-rose-500/10'
              : 'text-emerald-400 bg-emerald-500/10'
          }`}
        >
          {isBreakPhase ? 'Break Time!' : 'Focus Session'}
        </span>

        {/* TIMER DISPLAY */}
        <h1 className="text-8xl md:text-9xl font-mono font-bold my-6 select-none tracking-tighter">
          {mins}:{secs}
        </h1>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3 mb-8 w-full">
          <button
            onClick={toggleTimer}
            className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl shadow-lg text-sm transition"
          >
            {isRunning
              ? 'Pause Session'
              : isBreakPhase
              ? 'Start Break'
              : 'Click to Open & Start Focus'}
          </button>
          <button
            onClick={resetTimer}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition"
          >
            Reset
          </button>
        </div>

        {/* DURATION INPUTS */}
        <div className="grid grid-cols-2 gap-4 border-t border-slate-900 pt-6 text-left w-full">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Study (Mins)
            </label>
            <input
              type="number"
              value={studyMins}
              min="1"
              max="180"
              onChange={handleStudyChange}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Break (Mins)
            </label>
            <input
              type="number"
              value={breakMins}
              min="1"
              max="60"
              onChange={handleBreakChange}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* AUDIO ELEMENTS */}
      <audio ref={focusEndAudioRef} className="hidden" controls>
        <source src="/focus-end.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={breakEndAudioRef} className="hidden" controls>
        <source src="/break-end.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}

export default FocusMode;
