import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      alert('Login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="content-section">
      <div className="container">
        <div className="login-container">
          <h2 className="text-center mb-4">Welcome Back</h2>
          
          <ul className="nav nav-tabs" id="authTabs">
            <li className="nav-item">
              <a className="nav-link active">Login</a>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/register">Register</Link>
            </li>
          </ul>

          <div className="tab-content">
            <div className="tab-pane fade show active">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="loginEmail"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="loginPassword" className="form-label">Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="loginPassword"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;