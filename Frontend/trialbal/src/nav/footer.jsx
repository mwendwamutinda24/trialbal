export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p className="footer-copy">
          &copy; {year} IPSAS Annual Financial Reporting System
        </p>

        <nav className="footer-links">
          <a href="/login" className="footer-link">Sign in</a>
          <a href="/register" className="footer-link">Register</a>
          <a href="/forgot" className="footer-link">Reset password</a>
        </nav>
      </div>
    </footer>
  );
}