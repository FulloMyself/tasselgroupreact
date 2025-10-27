// api.js — resilient version
const FALLBACK_LOCAL = 'http://localhost:5000/api';
const FALLBACK_REMOTE = 'https://tasselgroup-back.onrender.com/api';

// Select base URL dynamically
export const getApiBaseUrl = () => {
  const envUrl =
    import.meta.env?.VITE_API_URL ||
    process.env.REACT_APP_API_URL ||
    null;

  if (envUrl) return envUrl;

  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') return FALLBACK_LOCAL;
  return FALLBACK_REMOTE;
};

const API_BASE = getApiBaseUrl();

// Generic fetch wrapper with retry + timeout
async function safeFetch(url, options = {}, retries = 2, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) return response.json();
    return await response.text();

  } catch (err) {
    if (retries > 0 && (err.name === 'AbortError' || err.message.includes('fetch'))) {
      console.warn('Retrying request...', retries);
      return safeFetch(url, options, retries - 1, timeoutMs);
    }
    throw err;
  }
}

// Base call with error mapping
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };

  if (config.body && !['GET', 'HEAD'].includes(config.method?.toUpperCase())) {
    config.body = JSON.stringify(config.body);
  }

  try {
    console.log(`📡 [API] → ${API_BASE}${endpoint}`);
    return await safeFetch(`${API_BASE}${endpoint}`, config);
  } catch (error) {
    console.error(`❌ [API] ${endpoint}:`, error.message);
    throw new Error(
      error.name === 'AbortError'
        ? '⏱️ Request timed out. Please retry.'
        : 'Cannot connect to server. Check internet or backend status.'
    );
  }
};

// ----- Specific API endpoints remain identical -----
export const apiService = {
  // Products
  getProducts: () => apiCall('/products'),

  // Services
  getServices: () => apiCall('/services'),
  createService: (d) => apiCall('/services', { method: 'POST', body: d }),

  // Bookings
  getBookings: (p = '') => apiCall(`/bookings${p}`),
  createBooking: (d) => apiCall('/bookings', { method: 'POST', body: d }),
  updateBookingStatus: (id, s) =>
    apiCall(`/bookings/${id}/status`, { method: 'PATCH', body: { status: s } }),
  assignStaffToBooking: (id, staffId) =>
    apiCall(`/bookings/${id}/assign-staff`, { method: 'PATCH', body: { staffId } }),

  // Gifts
  getGiftPackages: () => apiCall('/gift-packages'),
  createGiftOrder: (d) => apiCall('/gift-orders', { method: 'POST', body: d }),

  // Orders
  getOrders: (p = '') => apiCall(`/orders${p}`),
  createOrder: (d) => apiCall('/orders', { method: 'POST', body: d }),
  updateOrderStatus: (id, s) =>
    apiCall(`/orders/${id}/status`, { method: 'PATCH', body: { status: s } }),

  // Staff
  getStaffMembers: () => apiCall('/users/staff'),

  // Dashboard
  getAdminDashboard: () => apiCall('/dashboard/admin'),
  getStaffDashboard: () => apiCall('/dashboard/staff'),
  getCustomerOrders: () => apiCall('/dashboard/orders/my-orders'),
  getCustomerBookings: () => apiCall('/dashboard/bookings/my-bookings'),
  getCustomerGifts: () => apiCall('/dashboard/gift-orders/my-gifts'),

  // Payment
  initiatePayment: (d) => apiCall('/payment/initiate', { method: 'POST', body: d }),
  createManualOrder: (d) => apiCall('/payment/manual-order', { method: 'POST', body: d }),

  // Receipts
  generateReceipt: (t, id) => apiCall(`/dashboard/receipt/${t}/${id}`)
};
