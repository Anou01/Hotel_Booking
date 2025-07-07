import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import MainLayout from "./layouts/MainLayout";
import BookingPage from "./pages/BookingPage";
import RoomPage from "./pages/RoomPage";
import UserPage from "./pages/UserPage";
import CustomerServicePage from "./pages/CustomerServicePage";
import DashboardPage from "./pages/Dashboard";

const App: React.FC = () => {
  return (

      <Router>
        <Routes>
          {/* ✅ Redirect ไปหน้า Login ถ้าเข้า '/' */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public Routes (เช่น Login, Register) */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
          {/* Private Routes (ต้องล็อกอินก่อน) */}
          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/bookings" element={<BookingPage />} />
              <Route path="/rooms" element={<RoomPage />} />
              <Route path="/users" element={<UserPage />} />
              <Route path="/customers" element={<CustomerServicePage />} />
            </Route>
          </Route>
          {/* Not Found Page */}
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </Router>

  );
};

export default App;
