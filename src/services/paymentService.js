import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://isamc-backend-195u.onrender.com/api';

// Create axios instance with default config
const paymentAPI = axios.create({
  baseURL: `${API_BASE_URL}/payment`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
paymentAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
paymentAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class PaymentService {
  // Get membership pricing
  async getMembershipPricing() {
    try {
      const response = await paymentAPI.get('/pricing');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create payment intent
  async createPaymentIntent(membershipType, membershipDuration, amount) {
    try {
      const response = await paymentAPI.post('/create-intent', {
        membershipType,
        membershipDuration,
        amount
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Process payment after successful Stripe confirmation
  async processPayment(paymentData) {
    try {
      const response = await paymentAPI.post('/process', paymentData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get user's membership status
  async getMembershipStatus() {
    try {
      const response = await paymentAPI.get('/membership-status');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get transaction history with optional filters
  async getTransactionHistory(page = 1, limit = 10, status = null) {
    try {
      const params = { page, limit };
      if (status) params.status = status;
      
      const response = await paymentAPI.get('/transactions', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Initiate refund
  async initiateRefund(transactionId, reason) {
    try {
      const response = await paymentAPI.post('/refund', {
        transactionId,
        reason
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Renew membership
  async renewMembership(membershipId, paymentMethodId) {
    try {
      const response = await paymentAPI.post('/renew', {
        membershipId,
        paymentMethodId
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get payment analytics (admin only)
  async getPaymentAnalytics(startDate = null, endDate = null) {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await paymentAPI.get('/analytics', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Utility function to format currency
  formatCurrency(amount, currency = 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Utility function to get membership benefits
  getMembershipBenefits(membershipType, pricing) {
    return pricing[membershipType]?.benefits || [];
  }

  // Utility function to calculate savings for lifetime vs annual
  calculateLifetimeSavings(membershipType, pricing) {
    const annual = pricing[membershipType]?.annual;
    const lifetime = pricing[membershipType]?.lifetime;
    
    if (!annual || !lifetime) return null;
    
    const yearsToBreakEven = Math.ceil(lifetime / annual);
    const fiveYearAnnualCost = annual * 5;
    const savings = fiveYearAnnualCost - lifetime;
    
    return {
      yearsToBreakEven,
      fiveYearSavings: savings,
      savingsPercentage: Math.round((savings / fiveYearAnnualCost) * 100)
    };
  }

  // Check if membership is expiring soon
  isMembershipExpiringSoon(expiresAt, daysThreshold = 30) {
    if (!expiresAt) return false;
    
    const now = new Date();
    const expiry = new Date(expiresAt);
    const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    
    return daysUntilExpiry <= daysThreshold && daysUntilExpiry > 0;
  }

  // Format transaction status for display
  getTransactionStatusDisplay(status) {
    const statusMap = {
      'pending': { text: 'Pending', color: 'yellow', icon: '⏳' },
      'completed': { text: 'Completed', color: 'green', icon: '✅' },
      'failed': { text: 'Failed', color: 'red', icon: '❌' },
      'cancelled': { text: 'Cancelled', color: 'gray', icon: '🚫' },
      'refunded': { text: 'Refunded', color: 'blue', icon: '↩️' },
      'disputed': { text: 'Disputed', color: 'orange', icon: '⚠️' }
    };
    
    return statusMap[status] || { text: status, color: 'gray', icon: '❓' };
  }

  // Validate membership form data
  validateMembershipForm(formData) {
    const errors = {};
    
    if (!formData.fullName?.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone?.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[+]?[\d\s-()]{10,}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.membershipType) {
      errors.membershipType = 'Please select a membership type';
    }
    
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Error handler
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        success: false,
        message: error.response.data.message || 'An error occurred',
        status: error.response.status,
        data: error.response.data
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
export default new PaymentService();
