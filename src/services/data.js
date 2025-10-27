import { apiService } from './api';

// Data service for handling complex data operations
export const dataService = {
  // Staff management
  async populateStaffDropdowns() {
    try {
      const staffMembers = await apiService.getStaffMembers();
      return staffMembers;
    } catch (error) {
      console.error('Error populating staff dropdowns:', error);
      return [];
    }
  },

  // Dashboard data aggregation
  async getDashboardData(userRole, userId) {
    try {
      switch (userRole) {
        case 'admin':
          return await apiService.getAdminDashboard();
        case 'staff':
          return await apiService.getStaffDashboard();
        default:
          const [orders, bookings, gifts] = await Promise.all([
            apiService.getCustomerOrders(),
            apiService.getCustomerBookings(),
            apiService.getCustomerGifts()
          ]);
          return { orders, bookings, gifts };
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      throw error;
    }
  },

  // Order management
  async getOrdersWithFilters(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const queryString = queryParams.toString();
      return await apiService.getOrders(queryString ? `?${queryString}` : '');
    } catch (error) {
      console.error('Error fetching orders with filters:', error);
      throw error;
    }
  },

  // Booking management
  async getBookingsWithFilters(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const queryString = queryParams.toString();
      return await apiService.getBookings(queryString ? `?${queryString}` : '');
    } catch (error) {
      console.error('Error fetching bookings with filters:', error);
      throw error;
    }
  },

  // Analytics and reporting
  async generateReport(type, startDate, endDate) {
    try {
      // This would integrate with your backend reporting endpoints
      const reportData = {
        type,
        startDate,
        endDate,
        generatedAt: new Date().toISOString()
      };
      
      // Placeholder for actual report generation
      console.log('Generating report:', reportData);
      return reportData;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  },

  // Data export functionality
  async exportData(data, format = 'json') {
    try {
      let exportContent;
      
      switch (format) {
        case 'csv':
          exportContent = this.convertToCSV(data);
          break;
        case 'json':
          exportContent = JSON.stringify(data, null, 2);
          break;
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
      
      this.downloadFile(exportContent, `export-${Date.now()}.${format}`, format);
      return true;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  },

  // Helper methods
  convertToCSV(data) {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ];
    
    return csvRows.join('\n');
  },

  downloadFile(content, fileName, format) {
    const blob = new Blob([content], { 
      type: format === 'csv' ? 'text/csv' : 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Data validation helpers
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  },

  // Date utilities
  formatDate(date, format = 'local') {
    if (!date) return '';
    
    const dateObj = new Date(date);
    
    switch (format) {
      case 'iso':
        return dateObj.toISOString().split('T')[0];
      case 'time':
        return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case 'full':
        return dateObj.toLocaleString();
      default:
        return dateObj.toLocaleDateString();
    }
  },

  // Currency formatting
  formatCurrency(amount, currency = 'ZAR') {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },

  // Status management
  getStatusOptions(type) {
    const statusMap = {
      'order': [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
      ],
      'booking': [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'no-show', label: 'No Show' }
      ],
      'gift': [
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    };
    
    return statusMap[type] || [];
  },

  getStatusBadgeColor(status) {
    const colors = {
      'completed': 'success',
      'confirmed': 'primary',
      'pending': 'warning',
      'processing': 'info',
      'shipped': 'info',
      'delivered': 'success',
      'in-progress': 'info',
      'paid': 'success',
      'cancelled': 'danger',
      'no-show': 'danger'
    };
    return colors[status] || 'secondary';
  }
};