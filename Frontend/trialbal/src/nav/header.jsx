import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaGraduationCap,
  FaArrowRightToBracket,
  FaBars,
  FaXmark,
} from "react-icons/fa6";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-icon">
            <FaGraduationCap />
          </span>
          <span className="brand-name">IPSAS Reporting</span>
        </Link>

        {/* Desktop nav */}
        <nav className="nav-desktop">
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/login" className="nav-link">
            <FaArrowRightToBracket className="nav-link-icon" /> Sign in
          </Link>
          <Link to="/register" className="nav-cta">Register your school</Link>
        </nav>

        {/* Hamburger toggle */}
        <button
          className="menu-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile slide-in panel */}
      <div className={`mobile-overlay ${menuOpen ? "is-open" : ""}`} onClick={() => setMenuOpen(false)} />
      <div className={`mobile-panel ${menuOpen ? "is-open" : ""}`}>
        <div className="mobile-panel-header">
          <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
            <span className="brand-icon">
              <FaGraduationCap />
            </span>
            <span className="brand-name">IPSAS Reporting</span>
          </Link>
          <button
            className="menu-close"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <FaXmark />
          </button>
        </div>

        <nav className="nav-mobile">
          <Link to="/home" className="nav-link-mobile" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/login" className="nav-link-mobile" onClick={() => setMenuOpen(false)}>
            <FaArrowRightToBracket className="nav-link-icon" /> Sign in
          </Link>
          <Link to="/register" className="nav-cta-mobile" onClick={() => setMenuOpen(false)}>
            Register your school
          </Link>
        </nav>
      </div>
    </header>
  );
}
