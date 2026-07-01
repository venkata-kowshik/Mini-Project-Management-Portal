import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar sticky-top mb-4">
      <div className="container">
        <Link className="navbar-brand navbar-brand-text" to="/">
          TaskPortal
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <span className="navbar-toggler-icon" style={{ filter: darkMode ? 'invert(1)' : 'none' }}></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link px-3 fw-medium" style={{ color: 'var(--text-primary)' }} to="/dashboard">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 fw-medium" style={{ color: 'var(--text-primary)' }} to="/add-task">
                Add Task
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="theme-toggle-btn btn btn-sm"
              title="Toggle Dark/Light Mode"
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
