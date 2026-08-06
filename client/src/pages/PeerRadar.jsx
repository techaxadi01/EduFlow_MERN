import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PeerRadar() {
  const navigate = useNavigate();

  // Form State
  const [subject, setSubject] = useState('');
  const [locationName, setLocationName] = useState('');
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');

  // GPS Telemetry State
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [geoStatus, setGeoStatus] = useState({ text: 'Checking Permissions...', color: 'text-amber-500' });
  const [isGpsBound, setIsGpsBound] = useState(false);
  const [isGpsQuerying, setIsGpsQuerying] = useState(false);
  const [isGpsError, setIsGpsError] = useState(false);

  // Sessions Feed Data
  const [mySessions, setMySessions] = useState([]);
  const [campusSessions, setCampusSessions] = useState([]);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Retrieve current user
  const loggedUser = JSON.parse(sessionStorage.getItem('eduflow_logged_user')) || { name: 'Anonymous Student' };

  // AUTH PROTECTION CHECK
  useEffect(() => {
    const token = sessionStorage.getItem('eduflow_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Fetch all sessions from MongoDB Atlas, split into mine vs. everyone else's
  const fetchSessions = async () => {
    try {
      const response = await axios.get('/api/sessions');
      const all = response.data;
      setMySessions(all.filter((s) => s.name === loggedUser.name));
      setCampusSessions(all.filter((s) => s.name !== loggedUser.name));
    } catch (error) {
      // Fallback mock data if backend server is offline
      setCampusSessions([
        { id: 101, name: "Rahul Sharma", subject: "Full Stack Dev - API Routes", locationName: "Christ University Central Campus", timeWindow: "10:00 AM - 01:00 PM" },
        { id: 102, name: "Sneha Patel", subject: "Advanced DB - B-Trees Practice", locationName: "Kendriya Vidyalaya No.2, Jallahali", timeWindow: "03:30 PM - 05:00 PM" },
        { id: 103, name: "Kevin Alvares", subject: "C Language Pointer Arithmetic", locationName: "St. Xavier's Lab 3 Mumbai", timeWindow: "11:15 AM - 02:00 PM" }
      ]);
    }
  };

  // Request GPS Location Telemetry
  const getGPSLocation = () => {
    setIsGpsQuerying(true);
    setIsGpsError(false);
    setGeoStatus({ text: 'Querying device hardware...', color: 'text-amber-500 animate-pulse' });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setLat(latitude);
          setLng(longitude);
          setIsGpsBound(true);
          setIsGpsQuerying(false);
          setIsGpsError(false);
          setGeoStatus({ text: `Bound: ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`, color: 'text-emerald-600 font-bold' });
        },
        () => {
          setIsGpsQuerying(false);
          setIsGpsError(true);
          setGeoStatus({ text: 'Access Warning: Permissions blocked.', color: 'text-red-500 font-bold' });
          triggerToast('Location Access Blocked! Enable browser permissions.');
        }
      );
    } else {
      setIsGpsQuerying(false);
      setGeoStatus({ text: 'Hardware lacking GPS support.', color: 'text-red-500 font-bold' });
    }
  };

  useEffect(() => {
    fetchSessions();
    getGPSLocation();
  }, []);

  // Handle Form Submission -> Save to MongoDB
  const handleCreateSession = async (e) => {
    e.preventDefault();

    if (!lat || !lng) {
      triggerToast('Error: GPS telemetry missing.');
      return;
    }

    const timeWindow = `${timeFrom} - ${timeTo}`;
    const newSession = {
      name: loggedUser.name,
      subject,
      locationName,
      timeWindow,
      lat,
      lng,
      createdAt: new Date(),
    };

    try {
      const response = await axios.post('/api/sessions', newSession);
      const savedSession = response.data;
      setMySessions([savedSession, ...mySessions]);
    } catch (error) {
      setMySessions([{ ...newSession, _id: Date.now() }, ...mySessions]);
    }

    triggerToast('Session Added Successfully!');

    // Reset Form & GPS State
    setSubject('');
    setLocationName('');
    setTimeFrom('');
    setTimeTo('');
    setIsGpsBound(false);
    setLat(null);
    setLng(null);
    getGPSLocation();
  };

  const handleDeleteSession = async (id) => {
    try {
      await axios.delete(`/api/sessions/${id}`);
    } catch (error) {
      console.log('Local session removal');
    }
    setMySessions(mySessions.filter((s) => s._id !== id && s.id !== id));
    triggerToast('Session Terminated.');
  };

  const copyAddress = (address, targetLat, targetLng, frameId) => {
    navigator.clipboard.writeText(address).then(() => triggerToast('Location Address Copied!'));
    
    if (lat && lng && frameId) {
      const iframe = document.getElementById(frameId);
      if (iframe) {
        iframe.src = `https://maps.google.com/maps?saddr=${lat},${lng}&daddr=${encodeURIComponent(address)}&output=embed`;
      }
    }
  };

  return (
    <div className="bg-radial from-white via-white to-emerald-50 flex-1 w-full flex flex-col">
    <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex flex-col gap-10 text-slate-800 font-sans">
      
      {/* Toast Notification */}
      <div
        className={`fixed bottom-6 left-6 z-50 transform bg-slate-900 backdrop-blur-md text-emerald-300 font-mono font-semibold text-sm px-5 py-3 rounded-xl shadow-2xl border border-slate-700/50 flex items-center gap-2.5 transition-all duration-300 pointer-events-none ${
          showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
      >
        <span>{toastMessage}</span>
      </div>

      {/* CREATE SESSION & ACTIVE USER SESSIONS GRID */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Create Session Form */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl">
                <i className="fas fa-plus text-lg"></i>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Create Session</h2>
                <p className="text-xs text-slate-400">Tell your peers that you are available for group study.</p>
              </div>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-4 text-xs mt-2">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">Target Subject / Topic</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Advanced Database Indexing"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors text-slate-800 font-medium"
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">Your Location</label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g., Central Library Block A"
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors text-slate-800 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">From Time</label>
                  <input
                    type="time"
                    value={timeFrom}
                    onChange={(e) => setTimeFrom(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors text-slate-800 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">To Time</label>
                  <input
                    type="time"
                    value={timeTo}
                    onChange={(e) => setTimeTo(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors text-slate-800 font-medium"
                  />
                </div>
              </div>

              {/* GPS Telemetry Pill */}
              <div
                className={`border rounded-xl p-4 flex items-center justify-between transition-colors ${
                  isGpsError
                    ? 'bg-red-50/50 border-red-500'
                    : isGpsBound
                    ? 'bg-slate-50 border-emerald-500'
                    : isGpsQuerying
                    ? 'bg-slate-50 border-amber-500'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <i
                    className={`text-xl ${
                      isGpsError
                        ? 'fas fa-triangle-exclamation text-red-500'
                        : isGpsBound
                        ? 'fas fa-map-pin text-emerald-600'
                        : isGpsQuerying
                        ? 'fas fa-map-pin text-amber-500 animate-bounce'
                        : 'fas fa-map-pin text-slate-400'
                    }`}
                  ></i>
                  <div>
                    <h4 className="font-bold text-slate-700">GPS Location</h4>
                    <p className={`text-[10px] font-mono ${geoStatus.color}`}>{geoStatus.text}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={getGPSLocation}
                  disabled={isGpsBound}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                    isGpsBound
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  <i className="fas fa-location-arrow mr-1 text-[10px]"></i>
                  {isGpsBound ? 'Coordinates Bound' : 'Get GPS'}
                </button>
              </div>

              <button
                type="submit"
                disabled={!isGpsBound}
                className={`w-full py-3 rounded-xl font-bold text-xs transition duration-200 tracking-wide flex items-center justify-center gap-2 ${
                  isGpsBound
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-md shadow-emerald-600/10'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                {!isGpsBound && <i className="fas fa-lock text-[11px]"></i>}
                {isGpsBound ? 'Broadcast Dynamic Peer Session' : 'Unlock via GPS Verification'}
              </button>
            </form>
          </div>
        </div>

        {/* User Active Sessions */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
            <div className="bg-blue-100 text-blue-600 p-2.5 rounded-xl">
              <i className="fas fa-user-clock text-lg"></i>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Your Active Sessions</h2>
              <p className="text-xs text-slate-400">Live Study Tracks Managed By You.</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[320px] pr-1">
            {mySessions.length === 0 ? (
              <p className="text-slate-400 italic text-center py-12 text-xs">
                You have no active study sessions right now. Use the left dashboard panel to launch one.
              </p>
            ) : (
              <ul className="space-y-3 text-xs">
                {mySessions.map((session, index) => (
                  <li
                    key={session._id || session.id || index}
                    className="bg-gradient-to-r from-slate-50 to-emerald-50/10 border border-emerald-200 rounded-xl p-4 shadow-sm flex flex-col gap-3 relative transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                          {session.subject}
                        </h3>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          <i className="fas fa-map-location-dot mr-0.5 text-emerald-600"></i> {session.locationName}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          <i className="fas fa-clock mr-0.5"></i> Duration: {session.timeWindow}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteSession(session._id || session.id)}
                        className="text-slate-300 hover:text-red-500 transition text-[12px]"
                        title="Terminate Stream Broadcast"
                      >
                        <i className="fas fa-trash-can"></i>
                      </button>
                    </div>

                    <div className="w-full h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                      <iframe
                        className="w-full h-full border-0"
                        src={`https://maps.google.com/maps?q=${session.lat},${session.lng}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                        allowFullScreen
                        loading="lazy"
                        title="GPS Location Map"
                      ></iframe>
                    </div>

                    <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 border-t border-slate-100 pt-2">
                      <span>
                        <i className="fas fa-crosshairs mr-0.5 text-emerald-500"></i> Telemetry:{' '}
                        {session.lat?.toFixed(4)}° N, {session.lng?.toFixed(4)}° E
                      </span>
                      <span className="text-emerald-600 font-bold tracking-wider">LIVE</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>

      {/* ACTIVE CAMPUS SESSIONS GRID */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
          <div className="bg-purple-100 text-purple-600 p-2.5 rounded-xl">
            <i className="fas fa-tower-broadcast text-lg"></i>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Active Campus Sessions</h2>
            <p className="text-xs text-slate-400">Explore and join active study clusters hosted by your peers.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {campusSessions.map((peer, idx) => (
            <div
              key={peer._id || peer.id || idx}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-all"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded text-[9px] tracking-wide">
                    PEER SIGNAL
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">
                    <i className="fas fa-user text-[9px] mr-1"></i> {peer.name}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <i className="fas fa-book-bookmark text-purple-500"></i> {peer.subject}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    <i className="fas fa-clock mr-1"></i> Window: {peer.timeWindow || peer.duration}
                  </p>
                </div>

                <div className="w-full h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-200 shadow-inner relative">
                  <iframe
                    id={`campus-frame-${idx}`}
                    className="w-full h-full border-0 opacity-90"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(peer.locationName || peer.place)}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
                    allowFullScreen
                    loading="lazy"
                    title="Campus Peer Location"
                  ></iframe>
                  <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white font-mono text-[9px] px-2 py-0.5 rounded flex items-center gap-1">
                    <i className="fas fa-map-location-dot text-purple-400"></i> Address Tracker
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex gap-2 items-center text-[10px]">
                <button
                  onClick={() => copyAddress(peer.locationName || peer.place, peer.lat, peer.lng, `campus-frame-${idx}`)}
                  className="bg-white hover:bg-slate-100 text-slate-700 font-semibold px-3 py-1.5 rounded-lg transition border border-slate-300 flex items-center gap-1 w-full justify-center"
                >
                  <i className="fas fa-copy text-[9px]"></i> Copy Peer Address
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
    </div>
  );
}

export default PeerRadar;
