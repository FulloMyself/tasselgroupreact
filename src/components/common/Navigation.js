import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navigation = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-spa me-2"></i>Tassel Group
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/shop">Shop</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/services">Book Services</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/gifts">Gift Services</Link>
            </li>
          </ul>
          
          <ul className="navbar-nav">
            {currentUser ? (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                  data-bs-toggle="dropdown">
                  <div className="user-avatar d-inline-flex me-2">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{currentUser.name}</span>
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="fas fa-user me-2"></i>Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/dashboard">
                      <i className="fas fa-chart-line me-2"></i>Dashboard
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;