import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaBuildingColumns, FaEnvelope, FaLock, FaArrowRightToBracket } from "react-icons/fa6";

const API_URL = "https://trialbal-1.onrender.com";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setStatus({ type: "success", text: "Login successful! Redirecting…" });

        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        setStatus({
          type: "error",
          text: data.error || "Login failed. Please check your credentials.",
        });
      }
    } catch (err) {
      setStatus({
        type: "error",
        text: "Couldn't reach the server. Check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="brand-icon"><FaBuildingColumns /></div>
        <h1 className="form-title">IPSAS annual financial reporting</h1>
        <p className="form-subtitle">Sign in to your school account</p>

        <div className="field">
          <label className="field-label"><FaEnvelope /> Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="field-input"
            required
          />
        </div>

        <div className="field">
          <label className="field-label"><FaLock /> Password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="field-input"
            required
          />
        </div>

        <Link to="/forgot" className="forgot-link">Forgot password?</Link>

        <button type="submit" className="submit-button" disabled={loading}>
          <FaArrowRightToBracket /> {loading ? "Signing in…" : "Sign in"}
        </button>

        {status.text && (
          <p
            className={`form-message ${
              status.type === "success"
                ? "form-message-success"
                : "form-message-error"
            }`}
          >
            {status.text}
          </p>
        )}

        <p className="signin-link">
          New school? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}
