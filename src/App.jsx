import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ShopDetails from './pages/ShopDetails'
import Booking from './pages/Booking'
import BookingConfirmed from './pages/BookingConfirmed'
import Login from './pages/Login'
import OwnerDashboard from './pages/owner/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import ManageGames from './pages/owner/ManageGames'
import ManageSlots from './pages/owner/ManageSlots'
import OwnerBookings from './pages/owner/Bookings'
import AdminDashboard from './pages/admin/Dashboard'
import CreateShop from './pages/owner/CreateShop'
import MyBooking from './pages/MyBooking'
import AdminUsers from './pages/admin/Users'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop/:id" element={<ShopDetails />} />
      <Route path="/booking/:id" element={<Booking />} />
      <Route path="/booking-confirmed" element={<BookingConfirmed />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute>
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/shop/:shopId/games"
        element={
          <ProtectedRoute>
            <ManageGames />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/shop/:shopId/slots"
        element={
          <ProtectedRoute>
            <ManageSlots />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/bookings"
        element={
          <ProtectedRoute>
            <OwnerBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/shop/new"
        element={
          <ProtectedRoute>
            <CreateShop />
          </ProtectedRoute>
        }
      />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route 
        path="/my-booking" 
        element={<MyBooking />
        } 
      />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />

    </Routes>
    
  )
}