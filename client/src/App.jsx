import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Layout from "./Layout.jsx"
import Home from "./pages/Home.jsx"
import Experiences from "./pages/Experiences.jsx"
import Services from "./pages/Services.jsx"
import BecomeHost from "./pages/BecomeHost.jsx"
import ListingsPage from "./pages/ListingsPage.jsx"
import MyBookings from "./pages/MyBookings.jsx"
import AdminLogin from "./components/admin/AdminLogin.jsx"
import AdminDashboard from "./pages/admin/AdminDash.jsx"
import ManageUsers from "./pages/admin/ManageUsers.jsx"
import ManageListings from "./pages/admin/ManageListings.jsx"
import ManageBookings from "./pages/admin/ManageBookings.jsx"
import ProtectedRoute from "./components/ProtectedRoutes.jsx"

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/services" element={<Services />} />
          <Route path="/become-host" element={<BecomeHost />} />
          <Route path="/listing/:id" element={<ListingsPage />} />
          <Route 
            path="/my-bookings" 
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            } 
          />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manage-users" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <ManageUsers />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manage-listings" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <ManageListings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manage-bookings" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <ManageBookings />
            </ProtectedRoute>
          } 
        />
        </Route>
      </Routes>
    </Router>
  )
}

export default App