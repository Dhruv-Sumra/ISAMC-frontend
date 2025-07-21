import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { X, CreditCard, User, Mail, Phone, Building, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePhone(phone) {
  return /^\d{10,15}$/.test(phone.replace(/\D/g, ''));
}

const MembershipPurchaseModal = ({ isOpen, onClose, selectedTier }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    institute: '',
    designation: '',
    membershipType: '',
    paymentMethod: 'online',
    agreeToTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedTier && user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        phone: user.contact || '',
        institute: user.institute || '',
        designation: user.designation || '',
        membershipType: selectedTier.type || ''
      }));
    }
  }, [selectedTier, user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email address.';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
    else if (!validatePhone(formData.phone)) newErrors.phone = 'Invalid phone number.';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to purchase membership');
      return;
    }
    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Membership purchase request submitted successfully!');
      onClose();
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        institute: '',
        designation: '',
        membershipType: '',
        paymentMethod: 'online',
        agreeToTerms: false
      });
      setErrors({});
    } catch (error) {
      toast.error('Failed to submit membership request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    if (typeof price === 'string') {
      const lowerPrice = price.toLowerCase();
      if (lowerPrice.includes('invitation') || lowerPrice.includes('free') || lowerPrice.includes('complimentary')) {
        return price;
      }
    }
    return `₹${price}`;
  };

  const getMembershipPrice = () => {
    if (selectedTier?.price?.annualPrice && selectedTier?.price?.lifePrice) {
      return {
        annual: formatPrice(selectedTier.price.annualPrice),
        lifetime: formatPrice(selectedTier.price.lifePrice)
      };
    }
    return {
      single: formatPrice(selectedTier?.price?.annualPrice || selectedTier?.price?.lifePrice || selectedTier?.price)
    };
  };

  if (!isOpen || !selectedTier) return null;
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Please Login</h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">You must be logged in to purchase a membership.</p>
          <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Close</button>
        </div>
      </div>
    );
  }

  const prices = getMembershipPrice();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto border border-gray-200 dark:border-gray-700 relative">
        {isSubmitting && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 rounded-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={selectedTier.img} 
                alt={selectedTier.type} 
                className="w-16 h-16 object-cover rounded-full border-4 border-white dark:border-gray-600 shadow-lg" 
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Purchase {selectedTier.type}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Complete your membership application and join our community
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Membership Details */}
        <div className="p-8 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
              <div className="w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
            </div>
            Membership Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                  <div className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Type</p>
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-lg">{selectedTier.type}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
                  <div className="w-3 h-3 bg-green-600 dark:bg-green-400 rounded-full"></div>
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Duration</p>
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-lg">
                {selectedTier.time_period?.annual || selectedTier.time_period?.lifetime || selectedTier.time_period}
              </p>
            </div>
            
            {prices.annual && prices.lifetime ? (
              <>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                      <div className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                    </div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Annual</p>
                  </div>
                  <p className="font-bold text-blue-700 dark:text-blue-300 text-xl">{prices.annual}</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
                      <div className="w-3 h-3 bg-green-600 dark:bg-green-400 rounded-full"></div>
                    </div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Lifetime</p>
                  </div>
                  <p className="font-bold text-green-700 dark:text-green-300 text-xl">{prices.lifetime}</p>
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 md:col-span-2">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                    <div className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  </div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Price</p>
                </div>
                <p className="font-bold text-blue-700 dark:text-blue-300 text-2xl">{prices.single}</p>
              </div>
            )}
          </div>
        </div>

        {/* Purchase Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
              <div className="w-4 h-4 bg-green-600 dark:bg-green-400 rounded-full"></div>
            </div>
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                  <User className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                </div>
                Full Name <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm hover:shadow-md transition-shadow"
                placeholder="Enter your full name"
                id="fullName"
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
                  <Mail className="w-3 h-3 text-green-600 dark:text-green-400" />
                </div>
                Email Address <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm hover:shadow-md transition-shadow"
                placeholder="Enter your email address"
                id="email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                  <Phone className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                </div>
                Phone Number <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm hover:shadow-md transition-shadow"
                placeholder="Enter your phone number"
                id="phone"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="institute" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mr-3">
                  <Building className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                </div>
                Institute/Organization
              </label>
              <input
                type="text"
                name="institute"
                value={formData.institute}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm hover:shadow-md transition-shadow"
                placeholder="Enter your institute/organization"
                id="institute"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label htmlFor="designation" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mr-3">
                  <div className="w-3 h-3 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>
                </div>
                Designation/Area of Interest
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                placeholder="e.g., Professor, Research Scientist, Student"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm hover:shadow-md transition-shadow"
                id="designation"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mr-3">
                <CreditCard className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
              </div>
              Payment Method
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={formData.paymentMethod === 'online'}
                  onChange={handleInputChange}
                  className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Online Payment</span>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Credit/Debit Card</p>
                </div>
              </label>
              <label className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={formData.paymentMethod === 'bank_transfer'}
                  onChange={handleInputChange}
                  className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Bank Transfer</span>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Direct bank transfer</p>
                </div>
              </label>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
            <label htmlFor="agreeToTerms" className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="mr-3 mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                required
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                I agree to the{' '}
                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Privacy Policy
                </a>
                <span className="text-red-500 ml-1">*</span>
              </span>
            </label>
            {errors.agreeToTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-3" />
                  Purchase Membership
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MembershipPurchaseModal; 