import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setProfileData({
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      address: currentUser.address || ''
    });
  }, [currentUser, navigate]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(profileData);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Implement password change logic here
      alert('Password change functionality to be implemented');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      alert('Failed to change password: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <section className="content-section">
      <div className="container my-5">
        <h2 className="mb-4">Your Profile</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body text-center">
                <div 
                  className="user-avatar mx-auto mb-3"
                  style={{ width: '80px', height: '80px', fontSize: '1.5rem' }}
                >
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <h5>{currentUser.name}</h5>
                <p>{currentUser.email}</p>
                <p className="badge bg-primary">
                  {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Account Information</h5>
                <form onSubmit={handleProfileSubmit}>
                  <div className="mb-3">
                    <label htmlFor="profileFullName" className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="profileFullName"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="profileEmailInput" className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      id="profileEmailInput"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="profilePhone" className="form-label">Phone</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      id="profilePhone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="profileAddress" className="form-label">Address</label>
                    <textarea 
                      className="form-control" 
                      id="profileAddress"
                      name="address"
                      rows="3"
                      value={profileData.address}
                      onChange={handleProfileChange}
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </button>
                </form>

                <hr className="my-4" />

                <h5 className="card-title">Change Password</h5>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;