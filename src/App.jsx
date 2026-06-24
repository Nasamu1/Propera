import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Browse from "./pages/Browse";
import PropertyDetail from "./pages/PropertyDetail";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import DevDashboard from "./pages/developer/Dashboard";
import MyListings from "./pages/developer/MyListings";
import AddListing from "./pages/developer/AddListing";
import MeetingRequests from "./pages/developer/MeetingRequests";
import Saved from "./pages/buyer/Saved";
import MyViewings from "./pages/buyer/MyViewings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/developer/dashboard"
          element={
            <ProtectedRoute requiredRole="developer">
              <DevDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/developer/listings"
          element={
            <ProtectedRoute requiredRole="developer">
              <MyListings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/developer/add-listing"
          element={
            <ProtectedRoute requiredRole="developer">
              <AddListing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/developer/meetings"
          element={
            <ProtectedRoute requiredRole="developer">
              <MeetingRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/saved"
          element={
            <ProtectedRoute>
              <Saved />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/viewings"
          element={
            <ProtectedRoute>
              <MyViewings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
