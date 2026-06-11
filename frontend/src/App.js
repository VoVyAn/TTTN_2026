import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AboutUs from './components/AboutUs';
import Home from './components/Home';
import Menu from './components/Menu';
import Events from './components/Events';
import Press from './components/Press';
import ReservationForm from './components/ReservationForm';
import { LanguageProvider } from './LanguageContext';
import './css/App.css';

// Admin Components
import AdminLayout from './components/Admin/AdminLayout';
import AdminLogin from './components/Admin/AdminLogin';
import AdminRegister from './components/Admin/AdminRegister';
import AdminReservations from './components/Admin/AdminReservations';
import AdminBooking from './components/Admin/booking/AdminBooking';
import AdminBookingLogin from './components/Admin/booking/AdminBookingLogin';
import AdminMenu from './components/Admin/AdminMenu';
import AdminCategories from './components/Admin/AdminCategories';
import AdminEvents from './components/Admin/AdminEvents';
import AdminPress from './components/Admin/AdminPress';
import AdminSetMenus from './components/Admin/AdminSetMenus';
import AdminMenuPanels from './components/Admin/AdminMenuPanels';

// Layout component for public pages
function PublicLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      <Header />
      <main className={`main-content ${isHomePage ? 'home-main' : ''}`}>
        <Outlet />
      </main>
      {!isHomePage && <Footer />}
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Admin Routes (No default Navbar) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin/reservations/booking/login" element={<AdminBookingLogin />} />
            <Route path="/admin/reservations/booking" element={<AdminBooking />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="reservations" replace />} />
              <Route path="reservations" element={<AdminReservations />} />
              <Route path="menu" element={<AdminMenu />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="set-menus" element={<AdminSetMenus />} />
              <Route path="menu-panels" element={<AdminMenuPanels />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="press" element={<AdminPress />} />
            </Route>

            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/events" element={<Events />} />
              <Route path="/press" element={<Press />} />
              <Route path="/reservations" element={<ReservationForm />} />
            </Route>

            {/* Catch-all 404 route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;