import { useState, useEffect } from "react";
import { FaSchool, FaUserPlus, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";

export default function RegisterSchool() {
  const [formData, setFormData] = useState({
    schoolName: "",
    regNumber: "",
    schoolType: "Day",
    county: "",
    subCounty: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [counties, setCounties] = useState({}); // { "Nairobi": [...], "Kiambu": [...] }
  const [countiesLoading, setCountiesLoading] = useState(true);

  useEffect(() => {
    const fetchCounties = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/counties`);
        const data = await res.json();
        setCounties(data);
      } catch (err) {
        setStatus({ type: "error", text: "Couldn't load counties list. Please refresh the page." });
      } finally {
        setCountiesLoading(false);
      }
    };
    fetchCounties();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "county") {
      // reset sub-county whenever county changes
      setFormData({ ...formData, county: value, subCounty: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });

    if (formData.password.length < 6) {
      setStatus({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        schoolName: formData.schoolName,
        regNumber: formData.regNumber,
        schoolType: formData.schoolType,
        county: formData.county,
        subCounty: formData.subCounty,
        principalName: formData.fullName,
        principalEmail: formData.email,
        principalPhone: formData.phone,
        principalPassword: formData.password,
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", text: "School registered successfully! Redirecting to login…" });
        setTimeout(() => {
          window.location.href = "/login";
        }, 1200);
      } else {
        setStatus({ type: "error", text: data.error || "Registration failed. Please try again." });
      }
    } catch (err) {
      setStatus({ type: "error", text: "Couldn't reach the server. Check your connection and try again." });
    } finally {
      setLoading(false);
    }
  };

  const subCountyOptions = formData.county ? counties[formData.county] || [] : [];

  return (
    <div className="register-page">
      <form className="register-card" onSubmit={handleSubmit}>
        <div className="brand-icon"><FaSchool /></div>
        <h1 className="form-title">Register your school</h1>
        <p className="form-subtitle">Set up your school and its first Principal account</p>

        <div className="field">
          <label className="field-label">School name</label>
          <input name="schoolName" value={formData.schoolName} onChange={handleChange} className="field-input" required />
        </div>

        <div className="field-row">
          <div className="field">
            <label className="field-label">Registration number</label>
            <input name="regNumber" value={formData.regNumber} onChange={handleChange} className="field-input" />
          </div>
          <div className="field">
            <label className="field-label">School type</label>
            <select name="schoolType" value={formData.schoolType} onChange={handleChange} className="field-input">
              <option>Day</option><option>Boarding</option><option>Mixed</option>
            </select>
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label className="field-label">County</label>
            <select
              name="county"
              value={formData.county}
              onChange={handleChange}
              className="field-input"
              disabled={countiesLoading}
            >
              <option value="">{countiesLoading ? "Loading..." : "Select..."}</option>
              {Object.keys(counties).sort().map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label className="field-label">Sub-County</label>
            <select
              name="subCounty"
              value={formData.subCounty}
              onChange={handleChange}
              className="field-input"
              disabled={!formData.county}
            >
              <option value="">{formData.county ? "Select..." : "Select a county first"}</option>
              {subCountyOptions.map((sc) => <option key={sc} value={sc}>{sc}</option>)}
            </select>
          </div>
        </div>

        <div className="section-divider"><span className="section-label">Principal account</span></div>

        <div className="field">
          <label className="field-label">Full name</label>
          <input name="fullName" value={formData.fullName} onChange={handleChange} className="field-input" required />
        </div>

        <div className="field-row">
          <div className="field">
            <label className="field-label"><FaEnvelope /> Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} className="field-input" required />
          </div>
          <div className="field">
            <label className="field-label"><FaPhone /> Phone</label>
            <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className="field-input" />
          </div>
        </div>

        <div className="field">
          <label className="field-label"><FaLock /> Password</label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} className="field-input" required />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          <FaUserPlus /> {loading ? "Registering…" : "Register school"}
        </button>

        {status.text && (
          <p className={`form-message ${status.type === "success" ? "form-message-success" : "form-message-error"}`}>
            {status.text}
          </p>
        )}

        <p className="signin-link">Already registered? <a href="/login">Sign in</a></p>
      </form>
    </div>
  );
}