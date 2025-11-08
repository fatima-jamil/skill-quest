import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Target, TrendingUp, LogOut, Menu, X } from 'lucide-react';
import { logout } from '../../utils/auth';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.nav-container')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
  };

  const handleNavigate = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="app-nav">
      <div className="nav-container">
        <div className="nav-logo" onClick={() => handleNavigate('/dashboard')}>
          🎯 Skill Quest
        </div>

        {/* Hamburger Menu Button */}
        <button 
          className="nav-toggle" 
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links */}
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <button 
            onClick={() => handleNavigate('/dashboard')} 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <Home size={20} /> Dashboard
          </button>
          <button 
            onClick={() => handleNavigate('/skills')} 
            className={`nav-link ${isActive('/skills') ? 'active' : ''}`}
          >
            <BookOpen size={20} /> Skills
          </button>
          <button 
            onClick={() => handleNavigate('/challenges')} 
            className={`nav-link ${isActive('/challenges') ? 'active' : ''}`}
          >
            <Target size={20} /> Challenges
          </button>
          <button 
            onClick={() => handleNavigate('/ranking')} 
            className={`nav-link ${isActive('/ranking') ? 'active' : ''}`}
          >
            <TrendingUp size={20} /> Ranking
          </button>
          <button onClick={handleLogout} className="nav-link logout">
            <LogOut size={20} /> Logout
          </button>
        </div>

        {/* Overlay for mobile */}
        {isMenuOpen && (
          <div 
            className="nav-overlay" 
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;