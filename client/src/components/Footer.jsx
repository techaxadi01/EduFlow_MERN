import { useState, useEffect } from 'react';

export default function Footer() {
  const campusLocation = "Bangalore";
  const [userCoords, setUserCoords] = useState(null);
  const [geoText, setGeoText] = useState('');
  const [mapUrl, setMapUrl] = useState(`https://maps.google.com/maps?q=${campusLocation}&z=13&output=embed`);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserCoords({ lat, lng });
          setGeoText(`${lat.toFixed(2)}° N, ${lng.toFixed(2)}° E`);
        },
        () => {
          setGeoText('Access Denied');
        }
      );
    }
  }, []);

  const route = () => {
    if (userCoords) {
      setMapUrl(`https://maps.google.com/maps?saddr=${userCoords.lat},${userCoords.lng}&daddr=${campusLocation}&output=embed`);
    }
  };

  return (
    <footer id="footer" className="bg-black text-gray-300 border-t border-slate-900 mt-auto">
      <div className="max-w-8xl mx-auto px-10 py-12">
        <div className="grid md:grid-cols-11 gap-10">
          <div className="max-w-xs md:col-span-3 mr-10 pl-10">
            <h3 className="text-white text-2xl font-bold mb-4">EduFlow</h3>
            <p className="text-slate-400 text-sm">Empowering students through technology, collaboration and AI.</p>
          </div>

          <div className="md:col-span-4 grid md:grid-cols-2 gap-7">
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="hover:text-white cursor-pointer transition">Notes</li>
                <li className="hover:text-white cursor-pointer transition">Assignments</li>
                <li className="hover:text-white cursor-pointer transition">Courses</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="hover:text-white cursor-pointer transition">Students</li>
                <li className="hover:text-white cursor-pointer transition">Teachers</li>
                <li className="hover:text-white cursor-pointer transition">Projects</li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4 text-2xl mb-4 text-slate-400">
              <i className="fab fa-github hover:text-white cursor-pointer transition"></i>
              <i className="fab fa-linkedin hover:text-white cursor-pointer transition"></i>
              <i className="fab fa-youtube hover:text-white cursor-pointer transition"></i>
              <i className="fas fa-envelope hover:text-white cursor-pointer transition"></i>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-1">Address</h5>
              <p className="text-xs leading-relaxed text-slate-400">Bangalore, Karnataka,<br />India</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-semibold">Geo Location</h4>
              <button onClick={route} className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-1 px-3 rounded-lg text-xs transition">
                Show Route
              </button>
            </div>

            <iframe id="MapFrame" title="Location Map" src={mapUrl} className="w-full h-48 rounded-lg border border-slate-800" loading="lazy"></iframe>

            <div className="mt-2">
              <p className="text-xs text-gray-400 mt-2">
                Your Location: <span className={geoText === 'Access Denied' ? 'text-red-400 font-bold' : 'text-emerald-400 font-mono'}>{geoText}</span>
              </p>
            </div>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />
        <p className="text-center text-xs text-slate-500">© 2026 EduFlow. All rights reserved.</p>
      </div>
    </footer>
  );
}
