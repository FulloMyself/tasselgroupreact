import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import StaffDashboard from './StaffDashboard';
import CustomerDashboard from './CustomerDashboard';

const Dashboard = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          Please log in to access the dashboard.
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'staff':
        return <StaffDashboard />;
      default:
        return <CustomerDashboard />;
    }
  };

  return (
    <section className="content-section">
      <div className="container my-5">
        <h2 className="mb-4">Dashboard</h2>
        {renderDashboard()}
      </div>
    </section>
  );
};

export default Dashboard;