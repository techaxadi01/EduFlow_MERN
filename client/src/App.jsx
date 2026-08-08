import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthNavbar from './components/AuthNavbar';
import Footer from './components/Footer';
import SimpleFooter from './components/SimpleFooter';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FocusMode from './pages/FocusMode';
import PeerRadar from './pages/PeerRadar';
import Assignment from './pages/Assignment';
import WelcomeBack from './pages/WelcomeBack';

function Layout() {
  const location = useLocation();
  // Derived directly from sessionStorage so it stays in sync with login/logout
  // without needing every page to manually update shared state.
  const isLoggedIn = !!sessionStorage.getItem('eduflow_token');
  const loggedUser = JSON.parse(sessionStorage.getItem('eduflow_logged_user') || 'null');

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isFocusPage = location.pathname === '/focus';
  const isWelcomePage = location.pathname === '/welcome';
  const isRichFooterPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      {/* Dynamic Navbar Selection */}
      {isAuthPage ? (
        <AuthNavbar />
      ) : isFocusPage || isWelcomePage ? null : (
        <Navbar isLoggedIn={isLoggedIn} user={loggedUser} />
      )}

      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/focus" element={<FocusMode />} />
          <Route path="/peer-radar" element={<PeerRadar />} />
          <Route path="/assignment" element={<Assignment />} />
          <Route path="/welcome" element={<WelcomeBack />} />
        </Routes>
      </main>

      {/* Conditional Footer logic */}
      {isFocusPage || isWelcomePage ? null : isRichFooterPage ? <Footer /> : <SimpleFooter />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
