import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';

const CustomerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    orders: [],
    bookings: [],
    gifts: []
  });
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [orders, bookings, gifts] = await Promise.all([
        apiService.getCustomerOrders(),
        apiService.getCustomerBookings(),
        apiService.getCustomerGifts()
      ]);

      setDashboardData({
        orders: orders || [],
        bookings: bookings || [],
        gifts: gifts || []
      });
    } catch (error) {
      console.error('Failed to load customer dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalSpent = () => {
    let total = 0;
    
    dashboardData.orders.forEach(order => {
      total += order.finalTotal || order.total || 0;
    });
    
    dashboardData.bookings.forEach(booking => {
      total += booking.service?.price || booking.price || 0;
    });
    
    dashboardData.gifts.forEach(gift => {
      total += gift.price || gift.total || gift.giftPackage?.basePrice || 0;
    });
    
    return total;
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

  return (
    <div id="customerDashboard">
      <div className="row">
        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <i className="fas fa-shopping-bag fa-2x mb-2"></i>
            <h4 className="stats-number">{dashboardData.orders.length}</h4>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <i className="fas fa-calendar-check fa-2x mb-2"></i>
            <h4 className="stats-number">{dashboardData.bookings.length}</h4>
            <p>Total Bookings</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <i className="fas fa-gift fa-2x mb-2"></i>
            <h4 className="stats-number">{dashboardData.gifts.length}</h4>
            <p>Gifts Sent</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <i className="fas fa-money-bill-wave fa-2x mb-2"></i>
            <h4 className="stats-number">R {calculateTotalSpent().toLocaleString()}</h4>
            <p>Total Spent</p>
          </div>
        </div>
      </div>

      <div className="customer-controls mb-4 mt-4">
        <h4>My Activities</h4>
        <div className="row">
          <div className="col-md-4">
            <button 
              className="btn btn-info w-100 mb-2"
              onClick={() => setActiveSection('orders')}
            >
              <i className="fas fa-shopping-bag me-2"></i>My Orders
            </button>
          </div>
          <div className="col-md-4">
            <button 
              className="btn btn-info w-100 mb-2"
              onClick={() => setActiveSection('bookings')}
            >
              <i className="fas fa-calendar me-2"></i>My Bookings
            </button>
          </div>
          <div className="col-md-4">
            <button 
              className="btn btn-info w-100 mb-2"
              onClick={() => setActiveSection('gifts')}
            >
              <i className="fas fa-gift me-2"></i>My Gifts
            </button>
          </div>
        </div>
      </div>

      {/* Activity Sections */}
      {activeSection === 'orders' && (
        <div className="card">
          <div className="card-header">
            <h5>My Orders</h5>
          </div>
          <div className="card-body">
            {dashboardData.orders.length === 0 ? (
              <p className="text-center">No orders found</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Order ID</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.orders.map(order => (
                      <tr key={order._id}>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>{order._id.slice(-8)}</td>
                        <td>{order.items?.length || 0} items</td>
                        <td>R {(order.finalTotal || order.total || 0).toLocaleString()}</td>
                        <td>
                          <span className={`badge bg-${getStatusBadgeColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'bookings' && (
        <div className="card">
          <div className="card-header">
            <h5>My Bookings</h5>
          </div>
          <div className="card-body">
            {dashboardData.bookings.length === 0 ? (
              <p className="text-center">No bookings found</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Service</th>
                      <th>Staff</th>
                      <th>Appointment</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.bookings.map(booking => (
                      <tr key={booking._id}>
                        <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                        <td>{booking.service?.name || 'Service'}</td>
                        <td>{booking.staff?.name || 'Not assigned'}</td>
                        <td>
                          {new Date(booking.date).toLocaleDateString()} at {booking.time}
                        </td>
                        <td>
                          <span className={`badge bg-${getStatusBadgeColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'gifts' && (
        <div className="card">
          <div className="card-header">
            <h5>My Gift Orders</h5>
          </div>
          <div className="card-body">
            {dashboardData.gifts.length === 0 ? (
              <p className="text-center">No gift orders found</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Recipient</th>
                      <th>Gift Package</th>
                      <th>Delivery Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.gifts.map(gift => (
                      <tr key={gift._id}>
                        <td>{new Date(gift.createdAt).toLocaleDateString()}</td>
                        <td>{gift.recipientName}</td>
                        <td>{gift.giftPackage?.name || 'Gift Package'}</td>
                        <td>{new Date(gift.deliveryDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge bg-${getStatusBadgeColor(gift.status)}`}>
                            {gift.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const getStatusBadgeColor = (status) => {
  const colors = {
    'completed': 'success',
    'confirmed': 'primary',
    'pending': 'warning',
    'paid': 'info',
    'delivered': 'success',
    'cancelled': 'danger'
  };
  return colors[status] || 'secondary';
};

export default CustomerDashboard;