import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./auth/register";
import Login from "./auth/login";
import Header from "./nav/header";
import Footer from "./nav/footer";
import Home from "./home";
import FinancialYear from "./financial-year";
import ProtectedRoute from "./ProtectedRoute";

import "./App.css";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/financial-years"
          element={
            <ProtectedRoute>
              <FinancialYear />
            </ProtectedRoute>
          }
        />

        {/* Optional: redirect unknown routes to /home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
