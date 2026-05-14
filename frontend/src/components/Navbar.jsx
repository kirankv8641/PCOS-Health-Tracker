import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import ProfileMenu from "./ProfileMenu";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/symptoms", label: "Symptoms" },
    { to: "/diet", label: "Diet" },
    { to: "/exercise", label: "Exercise" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/about", label: "About" },
  ];

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">PCOS Care</div>

      {/* Desktop Nav Links */}
      <ul className="nav-links desktop-links">
        {navLinks.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className={location.pathname === link.to ? "active-link" : ""}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right side: Profile + Hamburger */}
      <div className="nav-right">
        <ProfileMenu />
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>
        <ul>
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={location.pathname === link.to ? "active-link" : ""}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay to close menu on outside click */}
      {menuOpen && (
        <div className="menu-overlay" onClick={closeMenu}></div>
      )}
    </nav>
  );
}

export default Navbar;