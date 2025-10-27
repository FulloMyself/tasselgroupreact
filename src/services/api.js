// api.js — resilient version for React
const FALLBACK_LOCAL = 'http://localhost:5000/api';
const FALLBACK_REMOTE = 'https://tasselgroupreact.onrender.com/api';

// Select base URL dynamically
export const getApiBaseUrl = () => {
  // React uses REACT_APP_ prefix for environment variables
  const envUrl = process.env.REACT_APP_API_URL;

  if (envUrl) return envUrl;

  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0') {
    return FALLBACK_LOCAL;
  }
  return FALLBACK_REMOTE;
};

const API_BASE = getApiBaseUrl();

// Generic fetch wrapper with retry + timeout
async function safeFetch(url, options = {}, retries = 2, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { 
      ...options, 
      signal: controller.signal 
    });
    clearTimeout(timer);

    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        try {
          const errorText = await response.text();
          if (errorText) errorMessage = errorText;
        } catch {
          // Use default error message
        }
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await response.json();
    }
    return await response.text();

  } catch (err) {
    clearTimeout(timer);
    
    // Retry on network errors or timeouts
    if (retries > 0 && (err.name === 'AbortError' || err.name === 'TypeError' || err.message.includes('fetch'))) {
      console.warn(`Retrying request... (${retries} attempts left)`);
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return safeFetch(url, options, retries - 1, timeoutMs);
    }
    
    // Enhance error message for better user feedback
    if (err.name === 'AbortError') {
      throw new Error('Request timeout - please check your connection and try again');
    } else if (err.name === 'TypeError') {
      throw new Error('Network error - cannot connect to server');
    }
    throw err;
  }
}

// Base call with error mapping
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  // Fix: Properly handle headers
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  const config = {
    headers,
    ...options
  };

  // Fix: Handle request body properly
  if (config.body && typeof config.body === 'object' && !['GET', 'HEAD'].includes(options.method?.toUpperCase() || 'GET')) {
    config.body = JSON.stringify(config.body);
  }

  try {
    console.log(`📡 [API] ${config.method || 'GET'} → ${API_BASE}${endpoint}`);
    const response = await safeFetch(`${API_BASE}${endpoint}`, config);
    console.log(`✅ [API] ${endpoint} → Success`);
    return response;
  } catch (error) {
    console.error(`❌ [API] ${endpoint}:`, error.message);
    
    // Provide more specific error messages
    let userMessage = error.message;
    
    if (error.message.includes('Cannot connect to server') || error.message.includes('Network error')) {
      userMessage = 'Cannot connect to server. Please check your internet connection and ensure the backend is running.';
    } else if (error.message.includes('timeout')) {
      userMessage = 'Request timed out. The server is taking too long to respond. Please try again.';
    } else if (error.message.includes('401')) {
      userMessage = 'Authentication failed. Please log in again.';
      // Auto-logout on auth errors
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      window.dispatchEvent(new Event('storage'));
    } else if (error.message.includes('403')) {
      userMessage = 'You do not have permission to perform this action.';
    } else if (error.message.includes('404')) {
      userMessage = 'The requested resource was not found.';
    } else if (error.message.includes('500')) {
      userMessage = 'Server error. Please try again later.';
    }
    
    throw new Error(userMessage);
  }
};

// API Service methods
export const apiService = {
  // Products
  getProducts: () => apiCall('/products'),

  // Services
  getServices: () => apiCall('/services'),
  createService: (serviceData) => apiCall('/services', { 
    method: 'POST', 
    body: serviceData 
  }),

  // Bookings
  getBookings: (params = '') => {
    const queryString = params ? `?${params}` : '';
    return apiCall(`/bookings${queryString}`);
  },
  createBooking: (bookingData) => apiCall('/bookings', { 
    method: 'POST', 
    body: bookingData 
  }),
  updateBookingStatus: (bookingId, status) =>
    apiCall(`/bookings/${bookingId}/status`, { 
      method: 'PATCH', 
      body: { status } 
    }),
  assignStaffToBooking: (bookingId, staffId) =>
    apiCall(`/bookings/${bookingId}/assign-staff`, { 
      method: 'PATCH', 
      body: { staffId } 
    }),
  getUnassignedBookings: () => apiCall('/bookings/unassigned'),

  // Gifts
  getGiftPackages: () => apiCall('/gift-packages'),
  createGiftOrder: (giftData) => apiCall('/gift-orders', { 
    method: 'POST', 
    body: giftData 
  }),
  updateGiftOrderStatus: (giftOrderId, status) =>
    apiCall(`/gift-orders/${giftOrderId}/status`, { 
      method: 'PATCH', 
      body: { status } 
    }),

  // Orders
  getOrders: (params = '') => {
    const queryString = params ? `?${params}` : '';
    return apiCall(`/orders${queryString}`);
  },
  createOrder: (orderData) => apiCall('/orders', { 
    method: 'POST', 
    body: orderData 
  }),
  updateOrderStatus: (orderId, status) =>
    apiCall(`/orders/${orderId}/status`, { 
      method: 'PATCH', 
      body: { status } 
    }),

  // Staff
  getStaffMembers: () => apiCall('/users/staff'),

  // Users
  getUsers: () => apiCall('/users'),
  searchUsers: (query) => apiCall(`/users/search?q=${encodeURIComponent(query)}`),
  getUserActivity: (userId) => apiCall(`/dashboard/user-activity/${userId}`),

  // Dashboard
  getAdminDashboard: () => apiCall('/dashboard/admin'),
  getStaffDashboard: () => apiCall('/dashboard/staff'),
  getCustomerOrders: () => apiCall('/dashboard/orders/my-orders'),
  getCustomerBookings: () => apiCall('/dashboard/bookings/my-bookings'),
  getCustomerGifts: () => apiCall('/dashboard/gift-orders/my-gifts'),

  // In api.js - update the initiatePayment method
initiatePayment: (paymentData) => {
  const enhancedPaymentData = {
    ...paymentData,
    timestamp: new Date().toISOString(),
    merchantReference: paymentData.merchantReference || `TASSEL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    customer: paymentData.customer || {},
    returnUrl: paymentData.returnUrl || `${window.location.origin}/payment/success`,
    cancelUrl: paymentData.cancelUrl || `${window.location.origin}/payment/cancelled`,
    notifyUrl: paymentData.notifyUrl || `${window.location.origin}/api/payment/notify`
  };

  console.log('💰 [API] Payment data:', enhancedPaymentData);
  
  return apiCall('/payment/initiate', { 
    method: 'POST', 
    body: enhancedPaymentData 
  });
},
  
  createManualOrder: (orderData) => {
    const enhancedOrderData = {
      ...orderData,
      timestamp: new Date().toISOString(),
      merchantReference: orderData.merchantReference || `MANUAL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    return apiCall('/payment/manual-order', { 
      method: 'POST', 
      body: enhancedOrderData 
    });
  },

  // Receipts
  generateReceipt: (type, id) => apiCall(`/dashboard/receipt/${type}/${id}`),

  // Auth
  login: (credentials) => apiCall('/auth/login', { 
    method: 'POST', 
    body: credentials 
  }),
  register: (userData) => apiCall('/auth/register', { 
    method: 'POST', 
    body: userData 
  }),
  getCurrentUser: () => apiCall('/auth/me'),
  updateProfile: (profileData) => apiCall('/auth/profile', { 
    method: 'PUT', 
    body: profileData 
  }),

  // Vouchers
  createVoucher: (voucherData) => apiCall('/vouchers', {
    method: 'POST',
    body: voucherData
  }),
  getVouchers: () => apiCall('/vouchers'),

  // Bulk operations
  bulkAssignStaff: (bookingIds, staffId) => apiCall('/bookings/bulk/assign-staff', {
    method: 'PATCH',
    body: { bookingIds, staffId }
  })
};

// Utility function to check API connectivity
export const checkApiHealth = async () => {
  try {
    const response = await safeFetch(`${API_BASE}/health`, {}, 1, 5000);
    return { healthy: true, response };
  } catch (error) {
    return { healthy: false, error: error.message };
  }
};

// Enhanced connectivity check with fallback
export const checkApiConnectivity = async () => {
  const results = {
    primary: { healthy: false, url: API_BASE },
    fallbackLocal: { healthy: false, url: FALLBACK_LOCAL },
    fallbackRemote: { healthy: false, url: FALLBACK_REMOTE }
  };

  // Check primary
  try {
    const health = await checkApiHealth();
    results.primary.healthy = health.healthy;
  } catch (error) {
    results.primary.error = error.message;
  }

  // If primary fails, check fallbacks
  if (!results.primary.healthy) {
    console.warn('Primary API unavailable, checking fallbacks...');
    
    // Check local fallback
    try {
      const response = await safeFetch(`${FALLBACK_LOCAL}/health`, {}, 1, 3000);
      results.fallbackLocal.healthy = true;
    } catch (error) {
      results.fallbackLocal.error = error.message;
    }

    // Check remote fallback  
    try {
      const response = await safeFetch(`${FALLBACK_REMOTE}/health`, {}, 1, 3000);
      results.fallbackRemote.healthy = true;
    } catch (error) {
      results.fallbackRemote.error = error.message;
    }
  }

  return results;
};

// Payment-specific helper
export const paymentHelpers = {
  // Format payment data for Payfast
  formatPayfastData: (orderData, customer) => ({
    merchant_id: process.env.REACT_APP_PAYFAST_MERCHANT_ID,
    merchant_key: process.env.REACT_APP_PAYFAST_MERCHANT_KEY,
    amount: orderData.totalAmount.toFixed(2),
    item_name: `Tassel Group Order - ${orderData.merchantReference}`,
    item_description: `Purchase of ${orderData.items.length} item(s)`,
    name_first: customer.name.split(' ')[0] || 'Customer',
    name_last: customer.name.split(' ').slice(1).join(' ') || ' ',
    email_address: customer.email,
    cell_number: customer.phone || '',
    m_payment_id: orderData.merchantReference,
    return_url: orderData.returnUrl,
    cancel_url: orderData.cancelUrl,
    notify_url: orderData.notifyUrl,
    email_confirmation: 1,
    confirmation_address: process.env.REACT_APP_CONFIRMATION_EMAIL
  }),

  // Validate payment data before sending
  validatePaymentData: (paymentData) => {
    const required = ['totalAmount', 'items', 'customer'];
    const missing = required.filter(field => !paymentData[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required payment fields: ${missing.join(', ')}`);
    }

    if (!paymentData.customer.email || !paymentData.customer.name) {
      throw new Error('Customer email and name are required');
    }

    if (paymentData.items.length === 0) {
      throw new Error('Cart cannot be empty');
    }

    return true;
  }
};

export default apiService;