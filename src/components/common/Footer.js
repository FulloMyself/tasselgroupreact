import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5><i className="fas fa-spa me-2"></i>Tassel Group</h5>
            <p>Your premier destination for beauty, wellness, and self-care experiences.</p>
          </div>
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light">Home</Link></li>
              <li><Link to="/shop" className="text-light">Shop</Link></li>
              <li><Link to="/services" className="text-light">Book Services</Link></li>
              <li><Link to="/gifts" className="text-light">Gift Services</Link></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contact Us</h5>
            <p><i className="fas fa-map-marker-alt me-2"></i>123 Beauty Street, Cape Town</p>
            <p><i className="fas fa-phone me-2"></i>+27 21 123 4567</p>
            <p><i className="fas fa-envelope me-2"></i>info@tasselgroup.co.za</p>
          </div>
        </div>
        <hr className="my-4" />
        <div className="text-center">
          <p>&copy; 2023 Tassel Group. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;