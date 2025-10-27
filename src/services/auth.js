import { apiCall } from './api';

export const authService = {
  async fetchCurrentUser() {
    try {
      const data = await apiCall('/auth/me');
      const user = data.user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      throw error;
    }
  },

  async login(email, password) {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: { email, password }
    });

    if (!data.token || !data.user) {
      throw new Error('Invalid response from server');
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('currentUser', JSON.stringify(data.user));
    return data;
  },

  async register(userData) {
    const data = await apiCall('/auth/register', {
      method: 'POST',
      body: userData
    });

    if (!data.token || !data.user) {
      throw new Error('Invalid response from server');
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('currentUser', JSON.stringify(data.user));
    return data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  },

  async updateProfile(profileData) {
    const data = await apiCall('/auth/profile', {
      method: 'PUT',
      body: profileData
    });

    if (data.user) {
      localStorage.setItem('currentUser', JSON.stringify(data.user));
    }

    return data;
  }
};