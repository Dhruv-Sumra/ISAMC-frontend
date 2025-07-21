import React, { useState, useEffect } from 'react';
import { X, CreditCard, User, Mail, Phone, Building, Calendar, Shield, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import paymentService from '../../services/paymentService';
import { useAuthStore } from '../../store/useAuthStore';

const EnhancedMembershipPurchase = ({ isOpen, onClose, selectedTier }) => {
  const { user, isAuthenticated } = useAuthStore();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    institute: '',
    designation: '',
    linkedinProfile: '',
    gender: '',
    dateOfBirth: '',
    expertise: '',
    membershipType: '',
    membershipDuration: 'annual',
    agreeToTerms: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [notes, setNotes] = useState("");

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
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Require login for membership application
    if (!isAuthenticated) {
      toast.error("Please log in to apply for membership.");
      window.location.href = "/login";
      return;
    }
    // Validate required fields
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required.';
    if (!formData.email.trim()) errors.email = 'Email is required.';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required.';
    if (!formData.institute.trim()) errors.institute = 'Institute is required.';
    if (!formData.designation.trim()) errors.designation = 'Designation is required.';
    if (!formData.gender.trim()) errors.gender = 'Gender is required.';
    if (!formData.dateOfBirth.trim()) errors.dateOfBirth = 'Date of birth is required.';
    if (!formData.expertise.trim()) errors.expertise = 'Area of expertise is required.';
    if (!formData.agreeToTerms) errors.agreeToTerms = 'You must confirm the details.';
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setIsSubmitting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://isamc-backend-195u.onrender.com';
      const response = await fetch(`${apiUrl}/api/contact/send-membership-application`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.accessToken || ''}`
        },
        body: JSON.stringify({ 
          ...formData, 
          notes, 
          membershipType: selectedTier.type,
          userId: user?._id,
          tierTitle: selectedTier.type,
          tierPrice: selectedTier.price?.annualPrice || selectedTier.price?.lifePrice || selectedTier.price,
          tierDuration: selectedTier.time_period?.annual || selectedTier.time_period?.lifetime || selectedTier.time_period
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update local auth store with new profile data
        if (user && data.success) {
          const updatedUser = {
            ...user,
            name: formData.fullName,
            contact: formData.phone,
            institute: formData.institute,
            designation: formData.designation,
            gender: formData.gender,
            dateOfBirth: formData.dateOfBirth,
            expertise: formData.expertise,
            linkedinProfile: formData.linkedinProfile,
            bio: formData.expertise // Use expertise as bio
          };
          
          // Update the auth store
          useAuthStore.getState().setUser(updatedUser);
        }
        
        toast.success('Your application has been submitted for approval. Our team will review your application and contact you soon with further instructions.');
        handleClose();
      } else {
        toast.error(data.message || 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      institute: '',
      designation: '',
      linkedinProfile: '',
      gender: '',
      dateOfBirth: '',
      expertise: '',
      membershipType: '',
      membershipDuration: 'annual',
      agreeToTerms: false
    });
    setValidationErrors({});
    onClose();
  };

  if (!isOpen || !selectedTier) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={selectedTier.img || '/default-membership.png'} 
                alt={selectedTier.type} 
                className="w-16 h-16 object-cover rounded-full border-4 border-white dark:border-gray-600 shadow-lg" 
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Purchase {selectedTier.type} Membership
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Complete your membership application
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Selected Tier Card Details */}
        <div className="flex flex-col md:flex-row items-center gap-8 p-6 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-slate-800 rounded-t-2xl">
          <img
            src={selectedTier.img || '/default-membership.png'}
            alt={selectedTier.type}
            className="w-28 h-28 object-cover rounded-full border-4 border-white dark:border-gray-600 shadow-xl mb-4 md:mb-0 bg-white dark:bg-slate-700"
          />
          <div className="flex-1 flex flex-col justify-center items-start md:items-start">
            <h3 className="text-2xl font-extrabold text-blue-800 dark:text-blue-300 mb-2 tracking-tight">{selectedTier.type}</h3>
            {selectedTier.description && (
              <p className="text-base text-gray-700 dark:text-gray-200 mb-2 leading-relaxed">{selectedTier.description}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-1">
              {/* Price Display */}
              {(selectedTier.price?.annualPrice || selectedTier.price?.lifePrice || selectedTier.price) && (
                <span className="inline-flex items-center border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-lg font-semibold text-sm shadow-sm">
                  <span className="mr-1">Price:</span> ₹{selectedTier.price?.annualPrice || selectedTier.price?.lifePrice || selectedTier.price}
                </span>
              )}
              
              {/* Duration Display */}
              {(selectedTier.time_period?.annual || selectedTier.time_period?.lifetime || selectedTier.time_period) && (
                <span className="inline-flex items-center border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-lg font-medium text-sm shadow-sm">
                  <span className="mr-1">Duration:</span> {selectedTier.time_period?.annual || selectedTier.time_period?.lifetime || selectedTier.time_period}
                </span>
              )}
              
              {/* Fallback for any price format */}
              {!selectedTier.price?.annualPrice && !selectedTier.price?.lifePrice && !selectedTier.price && (
                <span className="inline-flex items-center border border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-lg font-semibold text-sm shadow-sm">
                  Contact for pricing
                </span>
              )}
              
              {/* Fallback for any duration format */}
              {!selectedTier.time_period?.annual && !selectedTier.time_period?.lifetime && !selectedTier.time_period && (
                <span className="inline-flex items-center border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-lg font-medium text-sm shadow-sm">
                  Flexible duration
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Title, Price and Duration Display */}
        {/* <div className="px-8 py-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 border border-blue-200 dark:border-gray-600 shadow-lg">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedTier.type}
              </h3>
              <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
   
              <div className="bg-white dark:bg-gray-700 rounded-xl p-4 text-center border border-blue-200 dark:border-gray-600 shadow-sm">
                <span className="text-xs uppercase tracking-wider text-blue-700 dark:text-blue-300 font-semibold mb-2 block">Card Title</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{selectedTier.type}</span>
              </div>
              

              <div className="bg-white dark:bg-gray-700 rounded-xl p-4 text-center border border-blue-200 dark:border-gray-600 shadow-sm">
                <span className="text-xs uppercase tracking-wider text-blue-700 dark:text-blue-300 font-semibold mb-2 block">Price</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {selectedTier.price?.annualPrice || selectedTier.price?.lifePrice || selectedTier.price ? 
                    `₹${selectedTier.price.annualPrice || selectedTier.price.lifePrice || selectedTier.price}` : 
                    'Contact for pricing'
                  }
                </span>
              </div>
              
  
              <div className="bg-white dark:bg-gray-700 rounded-xl p-4 text-center border border-blue-200 dark:border-gray-600 shadow-sm">
                <span className="text-xs uppercase tracking-wider text-blue-700 dark:text-blue-300 font-semibold mb-2 block">Duration</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedTier.time_period?.annual || selectedTier.time_period?.lifetime || selectedTier.time_period || 'Flexible'}
                </span>
              </div>
            </div>
          </div>
        </div> */}

        {/* Success Step */}
        {isSubmitting && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your membership application is being submitted...
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
              Thank you for your application! We are reviewing your details. You will receive further instructions or confirmation soon.
            </p>
          </div>
        )}

        {/* Form and Payment Steps */}
        {!isSubmitting && (
          <>
            {/* Membership Application Form */}
            <form onSubmit={handleFormSubmit} className="p-8 space-y-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center mb-6">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
                Membership Application
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <User className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" /> Full Name <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    placeholder="Enter your full name"
                  />
                  {validationErrors.fullName && <p className="text-red-500 text-xs mt-1">{validationErrors.fullName}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" /> Email <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    placeholder="Enter your email"
                  />
                  {validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" /> Phone <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    placeholder="Enter your phone number"
                  />
                  {validationErrors.phone && <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="institute" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Building className="w-4 h-4 mr-2 text-orange-600 dark:text-orange-400" /> Institute <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="institute"
                    id="institute"
                    value={formData.institute}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    placeholder="Enter your institute"
                  />
                  {validationErrors.institute && <p className="text-red-500 text-xs mt-1">{validationErrors.institute}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="designation" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" /> Designation <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="designation"
                    id="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    placeholder="Enter your designation"
                  />
                  {validationErrors.designation && <p className="text-red-500 text-xs mt-1">{validationErrors.designation}</p>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="linkedinProfile" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedinProfile"
                    id="linkedinProfile"
                    value={formData.linkedinProfile}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <User className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" /> Gender <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    name="gender"
                    id="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {validationErrors.gender && <p className="text-red-500 text-xs mt-1">{validationErrors.gender}</p>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" /> Date of Birth <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  />
                  {validationErrors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{validationErrors.dateOfBirth}</p>}
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="expertise" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Area of Expertise <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    name="expertise"
                    id="expertise"
                    value={formData.expertise}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    placeholder="Describe your area of expertise, research interests, or specialization..."
                  />
                  {validationErrors.expertise && <p className="text-red-500 text-xs mt-1">{validationErrors.expertise}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" /> Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    id="notes"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    placeholder="Any additional information (optional)"
                  />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  required
                />
                <label htmlFor="agreeToTerms" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  I confirm the above details are correct <span className="text-red-500">*</span>
                </label>
              </div>
              {validationErrors.agreeToTerms && <p className="text-red-500 text-xs mt-1">{validationErrors.agreeToTerms}</p>}
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Submitting...
                    </>
                  ) : (
                    <>Submit Application</>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EnhancedMembershipPurchase;
