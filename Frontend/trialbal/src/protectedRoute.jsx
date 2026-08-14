import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const API_URL = "https://trialbal-1.onrender.com";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("ProtectedRoute: token from localStorage:", token);

    if (!token) {
      console.log("ProtectedRoute: no token, redirecting");
      setStatus("invalid");
      return;
    }

    fetch(`${API_URL}/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        console.log("ProtectedRoute: /verify status:", res.status);
        setStatus(res.ok ? "valid" : "invalid");
      })
      .catch((err) => {
        console.log("ProtectedRoute: /verify fetch error:", err);
        setStatus("invalid");
      });
  }, []);

  if (status === "checking") return <div>Checking session…</div>;
  if (status === "invalid") return <Navigate to="/login" replace />;
  return children;
}
