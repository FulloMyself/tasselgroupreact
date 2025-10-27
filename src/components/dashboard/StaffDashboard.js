import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';

const StaffDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await apiService.getStaffDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load staff dashboard:', error);
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
    <div id="staffDashboard">
      <div className="row">
        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <i className="fas fa-shopping-cart fa-2x mb-2"></i>
            <h4 className="stats-number">
              {(dashboardData.stats?.totalSales || 0).toLocaleString()}
            </h4>
            <p>Total Sales</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <i className="fas fa-users fa-2x mb-2"></i>
            <h4 className="stats-number">
              {(dashboardData.stats?.totalClients || 0).toLocaleString()}
            </h4>
            <p>Clients Served</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <i className="fas fa-clock fa-2x mb-2"></i>
            <h4 className="stats-number">
              {(dashboardData.stats?.totalHours || 0).toLocaleString()}
            </h4>
            <p>Hours Worked</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <i className="fas fa-money-bill-wave fa-2x mb-2"></i>
            <h4 className="stats-number">
              R {(dashboardData.stats?.totalCommission || 0).toLocaleString()}
            </h4>
            <p>Commission Earned</p>
          </div>
        </div>
      </div>

      {/* Add more staff dashboard components here */}
      <div className="mt-4">
        <p>Staff-specific dashboard components would be implemented here.</p>
      </div>
    </div>
  );
};

export default StaffDashboard;