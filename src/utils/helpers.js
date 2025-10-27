// Utility functions
export const showNotification = (message, type = 'info') => {
  const notification = document.createElement('div');
  notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
  notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
  notification.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR'
  }).format(amount);
};

export const getStatusBadgeColor = (status) => {
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

export const setMinimumDates = () => {
  const today = new Date().toISOString().split('T')[0];
  const bookingDate = document.getElementById('bookingDate');
  const deliveryDate = document.getElementById('deliveryDate');

  if (bookingDate) bookingDate.min = today;
  if (deliveryDate) deliveryDate.min = today;
};