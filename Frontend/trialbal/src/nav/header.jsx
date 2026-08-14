import { useState } from "react";
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
        <a href="/" className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-icon">
            <FaGraduationCap />
          </span>
          <span className="brand-name">IPSAS Reporting</span>
        </a>

        {/* Desktop nav */}
        <nav className="nav-desktop">
          <a href="/home" className="nav-link">Home</a>
          <a href="/login" className="nav-link">
            <FaArrowRightToBracket className="nav-link-icon" /> Sign in
          </a>
          <a href="/register" className="nav-cta">Register your school</a>
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
          <a href="/" className="brand" onClick={() => setMenuOpen(false)}>
            <span className="brand-icon">
              <FaGraduationCap />
            </span>
            <span className="brand-name">IPSAS Reporting</span>
          </a>
          <button
            className="menu-close"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <FaXmark />
          </button>
        </div>

        <nav className="nav-mobile">
          <a href="/home" className="nav-link-mobile" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="/login" className="nav-link-mobile" onClick={() => setMenuOpen(false)}>
            <FaArrowRightToBracket className="nav-link-icon" /> Sign in
          </a>
          <a href="/register" className="nav-cta-mobile" onClick={() => setMenuOpen(false)}>
            Register your school
          </a>
        </nav>
      </div>
    </header>
  );
}