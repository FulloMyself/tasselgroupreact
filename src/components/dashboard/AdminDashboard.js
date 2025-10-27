import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await apiService.getAdminDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load admin dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="alert alert-danger">
        Failed to load dashboard data.
      </div>
    );
  }

  return (
    <div id="adminDashboard">
      <div className="admin-controls mb-4">
        <h4>Admin Controls</h4>
        <div className="row">
          <div className="col-md-4">
            <button className="btn btn-primary w-100 mb-2">
              <i className="fas fa-plus me-2"></i>Add Service
            </button>
          </div>
          <div className="col-md-4">
            <button className="btn btn-primary w-100 mb-2">
              <i className="fas fa-plus me-2"></i>Add Product
            </button>
          </div>
          <div className="col-md-4">
            <button className="btn btn-primary w-100 mb-2">
              <i className="fas fa-tag me-2"></i>Create Voucher
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <i className="fas fa-chart-line fa-2x mb-2"></i>
            <h4 className="stats-number">
              R {(dashboardData.stats?.totalRevenue || 0).toLocaleString()}
            </h4>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <i className="fas fa-user-friends fa-2x mb-2"></i>
            <h4 className="stats-number">
              {(dashboardData.stats?.totalUsers || 0).toLocaleString()}
            </h4>
            <p>Total Users</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <i className="fas fa-calendar-check fa-2x mb-2"></i>
            <h4 className="stats-number">
              {(dashboardData.stats?.totalBookings || 0).toLocaleString()}
            </h4>
            <p>Total Bookings</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <i className="fas fa-box fa-2x mb-2"></i>
            <h4 className="stats-number">
              {(dashboardData.stats?.totalProducts || 0).toLocaleString()}
            </h4>
            <p>Products Sold</p>
          </div>
        </div>
      </div>

      {/* Add more admin dashboard components here */}
      <div className="mt-4">
        <p>Admin management tables and charts would be implemented here.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;