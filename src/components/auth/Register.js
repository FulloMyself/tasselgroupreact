import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.address) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate('/');
    } catch (error) {
      alert('Registration failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="content-section">
      <div className="container">
        <div className="login-container">
          <h2 className="text-center mb-4">Create Account</h2>
          
          <ul className="nav nav-tabs" id="authTabs">
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link active">Register</a>
            </li>
          </ul>

          <div className="tab-content">
            <div className="tab-pane fade show active">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="registerName" className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="registerName"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="registerEmail" className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="registerEmail"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="registerPassword" className="form-label">Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="registerPassword"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="registerPhone" className="form-label">Phone Number</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    id="registerPhone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="registerAddress" className="form-label">Address</label>
                  <textarea 
                    className="form-control" 
                    id="registerAddress"
                    name="address"
                    rows="2"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;