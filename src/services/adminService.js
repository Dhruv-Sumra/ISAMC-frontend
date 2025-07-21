import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Create axios instance with default config
const adminAPI = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
adminAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
adminAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
        const refreshResponse = await fetch(`${apiUrl}/auth/refresh`, {
          method: 'GET',
          credentials: 'include'
        });
        
        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          if (data.success && data.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return adminAPI(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
      
      // If refresh fails, redirect to login
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

class AdminService {
  // Check if user has valid token
  hasValidToken() {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    
    try {
      // Simple token expiry check (decode without verification)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }
  
  // Manually refresh token
  async refreshToken() {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
      const response = await fetch(`${apiUrl}/auth/refresh`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Manual token refresh failed:', error);
      return false;
    }
  }

  // Get dashboard data
  async getDashboard() {
    try {
      const response = await adminAPI.get('/dashboard');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get section data
  async getSectionData(sectionName) {
    try {
      const response = await adminAPI.get(`/section/${sectionName}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Add item to section
  async addItem(sectionName, itemData) {
    try {
      const response = await adminAPI.post(`/add-item/${sectionName}`, itemData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update item in section
  async updateItem(sectionName, itemId, itemData) {
    try {
      const response = await adminAPI.put(`/update-item/${sectionName}/${itemId}`, itemData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete item from section
  async deleteItem(sectionName, itemId) {
    try {
      const response = await adminAPI.delete(`/delete-item/${sectionName}/${itemId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Bulk upload items from Excel
  async bulkUpload(sectionName, data) {
    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/admin/bulk-upload/${sectionName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ data })
    });

    // Handle the response as JSON
    let result;
    try {
      result = await response.json();
    } catch (e) {
      result = { success: false, message: 'Invalid server response' };
    }
    return result;
  }

  // User management methods
  async getUsers(page = 1, limit = 10) {
    try {
      const response = await adminAPI.get('/users', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async searchUsers(query, role = null) {
    try {
      const params = { q: query };
      if (role) params.role = role;
      
      const response = await adminAPI.get('/users/search', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async promoteUser(userId) {
    try {
      const response = await adminAPI.put(`/users/${userId}/promote`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async demoteUser(userId) {
    try {
      const response = await adminAPI.put(`/users/${userId}/demote`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteUser(userId) {
    try {
      const response = await adminAPI.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getStats() {
    try {
      const response = await adminAPI.get('/stats');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Utility methods
  validateExcelData(data, sectionName) {
    const errors = [];
    const validData = [];

    data.forEach((row, index) => {
      // Skip rows that are completely empty (all fields blank or whitespace)
      if (Object.values(row).every(val => !String(val).trim())) {
        return;
      }
      const rowNumber = index + 2; // +2 because Excel is 1-indexed and we skip header
      const rowErrors = [];

      // Validate based on section
      switch (sectionName) {
        case 'Publications':
          if (!row.title || row.title.trim() === '') {
            rowErrors.push('Title is required');
          }
          if (!row.subtitle || row.subtitle.trim() === '') {
            rowErrors.push('Subtitle is required');
          }
          if (!row.body || row.body.trim() === '') {
            rowErrors.push('Body is required');
          }
          // pdfUrl is optional, but if present, should be a valid URL
          if (row.pdfUrl && typeof row.pdfUrl === 'string' && !/^https?:\/\//.test(row.pdfUrl)) {
            rowErrors.push('pdfUrl must be a valid URL starting with http or https');
          }
          break;
        case 'News':
          if (!row.title || row.title.trim() === '') {
            rowErrors.push('Title is required');
          }
          if (!row.body || row.body.trim() === '') {
            rowErrors.push('Body is required');
          }
          if (!row.date || row.date.trim() === '') {
            rowErrors.push('Date is required');
          }
          break;
        case 'Events':
        case 'upevents':
        case 'pastEvents':
          if (!row.title || row.title.trim() === '') {
            rowErrors.push('Title is required');
          }
          if (!row.body || row.body.trim() === '') {
            rowErrors.push('Body is required');
          }
          if (!row.date || row.date.trim() === '') {
            rowErrors.push('Date is required');
          }
          if (!row.location || row.location.trim() === '') {
            rowErrors.push('Location is required');
          }
          break;
        case 'otherEvents':
          if (!row.title || String(row.title).trim() === '') {
            rowErrors.push('Title is required');
          }
          if (!row.body || String(row.body).trim() === '') {
            rowErrors.push('Body is required');
          }
          if (!row.date || String(row.date).trim() === '') {
            rowErrors.push('Date is required');
          }
          if (!row.location || String(row.location).trim() === '') {
            rowErrors.push('Location is required');
          }
          if (!row.imageUrl || String(row.imageUrl).trim() === '') {
            rowErrors.push('Image URL is required');
          }
          break;
        default:
          if (!row.title || row.title.trim() === '') {
            rowErrors.push('Title is required');
          }
      }

      if (rowErrors.length > 0) {
        errors.push({
          row: rowNumber,
          errors: rowErrors,
          data: row
        });
      } else {
        validData.push(row);
      }
    });

    return { data: validData, errors };
  }

  getTemplateData(sectionName) {
    switch (sectionName) {
      case 'Publications':
        return [
          {
            title: 'Sample Publication Title',
            subtitle: 'Sample Subtitle',
            body: 'Sample publication description or abstract',
            imageUrl: 'https://example.com/image.jpg',
            pdfUrl: 'https://example.com/sample.pdf'
          }
        ];
      case 'News':
        return [
          {
            title: 'Sample News Title',
            body: 'Sample news content',
            date: '2024-01-01',
            imageUrl: 'https://example.com/image.jpg',
            referenceUrl: 'https://example.com/reference'
          }
        ];
      case 'Events':
      case 'upevents':
      case 'pastEvents':
        return [
          {
            title: 'Sample Event Title',
            body: 'Sample event description',
            date: '2024-01-01',
            location: 'Sample Location',
            imageUrl: 'https://example.com/image.jpg'
          }
        ];
      case 'otherEvents':
        return [
          {
            date: '2025-07-20',
            location: 'Berlin, Germany',
            title: 'International Robotics Expo 2025',
            body: 'A global showcase of robotics and automation, featuring innovators and companies from over 30 countries.',
            imageUrl: 'https://www.un.org/sites/un2.un.org/files/2021/09/international-event.jpg'
          }
        ];
      default:
        return [
          {
            title: 'Sample Title',
            body: 'Sample content',
            imageUrl: 'https://example.com/image.jpg'
          }
        ];
    }
  }

  // Error handler
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        success: false,
        message: error.response.data.message || 'An error occurred',
        status: error.response.status,
        data: error.response.data,
        errors: error.response.data.errors || []
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        success: false,
        message: 'Network error. Please check your connection.',
        status: 0
      };
    } else {
      // Something else happened
      return {
        success: false,
        message: error.message || 'An unexpected error occurred',
        status: 0
      };
    }
  }
}

// Export singleton instance
export default new AdminService();
