import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <section className="content-section">
      <div className="hero-section">
        <div className="container">
          <h1 className="display-4">Welcome to Tassel Group</h1>
          <p className="lead">Your premier destination for beauty, wellness, and self-care</p>
          <Link to="/shop" className="btn btn-primary btn-lg mt-3">
            Explore Our Products
          </Link>
        </div>
      </div>

      <div className="container my-5">
        <div className="row">
          <div className="col-md-4 text-center">
            <i className="fas fa-gift fa-3x text-primary mb-3"></i>
            <h3>Gift Services</h3>
            <p>Perfect presents for your loved ones with our custom gift services.</p>
            <Link to="/gifts" className="btn btn-outline-primary">Learn More</Link>
          </div>
          <div className="col-md-4 text-center">
            <i className="fas fa-calendar-alt fa-3x text-primary mb-3"></i>
            <h3>Book Services</h3>
            <p>Schedule your massage, nail, or beauty treatments at your convenience.</p>
            <Link to="/services" className="btn btn-outline-primary">Book Now</Link>
          </div>
          <div className="col-md-4 text-center">
            <i className="fas fa-shopping-bag fa-3x text-primary mb-3"></i>
            <h3>Shop Products</h3>
            <p>Discover our curated collection of beauty and wellness products.</p>
            <Link to="/shop" className="btn btn-outline-primary">Shop Now</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;