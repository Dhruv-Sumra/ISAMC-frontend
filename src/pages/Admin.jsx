import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useAuthStore } from '../store/useAuthStore';
import Spinner from '../components/ui/Spinner';
import { toast } from 'react-hot-toast';

// Admin access is now role-based instead of email-based

const Admin = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [activeSection, setActiveSection] = useState('dashboard');
  const [editingItem, setEditingItem] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const sections = [
    { key: 'News', label: 'Latest News', icon: 'fa-solid fa-newspaper', color: 'blue' },
    { key: 'Events', label: 'Featured Events', icon: 'fa-solid fa-calendar', color: 'green' },
    { key: 'upevents', label: 'Upcoming Events', icon: 'fa-solid fa-calendar-plus', color: 'purple' },
    { key: 'pastEvents', label: 'Past Events', icon: 'fa-solid fa-calendar-check', color: 'gray' },
    { key: 'eventsArchives', label: 'Events Archive', icon: 'fa-solid fa-archive', color: 'gray' },
    { key: 'Publications', label: 'Publications', icon: 'fa-solid fa-book', color: 'indigo' },
    { key: 'partners', label: 'Partners', icon: 'fa-solid fa-handshake', color: 'yellow' },
    { key: 'leadership', label: 'Leadership', icon: 'fa-solid fa-users', color: 'pink' },
    { key: 'tier', label: 'Member Tiers', icon: 'fa-solid fa-crown', color: 'amber' },
    { key: 'Testimonials', label: 'Testimonials', icon: 'fa-solid fa-quote-left', color: 'emerald' },
    { key: 'Mission', label: 'Mission', icon: 'fa-solid fa-bullseye', color: 'red' },
    { key: 'Member', label: 'Member Benefits', icon: 'fa-solid fa-gift', color: 'teal' },
    { key: 'features', label: 'Features', icon: 'fa-solid fa-star', color: 'orange' },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    
    // Check if user is admin
    if (!isAdmin()) {
      toast.error('Access denied. Admin privileges required.');
      window.location.href = '/';
      return;
    }
    
    fetchDashboardData();
    
    // Set up periodic token refresh (every 10 minutes)
    const tokenRefreshInterval = setInterval(async () => {
      try {
        const { refreshAccessToken } = useAuthStore.getState();
        await refreshAccessToken();
      } catch (error) {
        console.error('Token refresh failed:', error);
      }
    }, 10 * 60 * 1000); // 10 minutes
    
    // User activity detection for token refresh
    let lastActivity = Date.now();
    const activityThreshold = 5 * 60 * 1000; // 5 minutes
    
    const handleUserActivity = async () => {
      const now = Date.now();
      if (now - lastActivity > activityThreshold) {
        // User became active after being idle, refresh token
        try {
          const { refreshAccessToken } = useAuthStore.getState();
          await refreshAccessToken();
        } catch (error) {
          console.error('Token refresh on activity failed:', error);
        }
      }
      lastActivity = now;
    };
    
    // Add event listeners for user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });
    
    // Cleanup interval and event listeners on unmount
    return () => {
      clearInterval(tokenRefreshInterval);
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard');
      console.log('Dashboard data:', response.data.data);
      setData(response.data.data || {});
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to safely render data values
  const renderValue = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string' || typeof value === 'number') return value;
    if (typeof value === 'object') {
      if (value.day && value.month) {
        return `${value.day} ${value.month}`;
      }
      return JSON.stringify(value);
    }
    return String(value);
  };

  // Helper function to get count for a section
  const getSectionCount = (sectionKey) => {
    const sectionData = data[sectionKey];
    if (!sectionData) return 0;
    
    if (Array.isArray(sectionData)) {
      return sectionData.length;
    }
    
    if (typeof sectionData === 'object') {
      if (sectionData.items && Array.isArray(sectionData.items)) {
        return sectionData.items.length;
      }
      if (sectionData.title || sectionData.body || sectionData.fullName) {
        return 1;
      }
      return Object.keys(sectionData).length;
    }
    
    return 0;
  };

  const handleAddItem = async (sectionName) => {
    try {
      setIsSubmitting(true);
      const response = await api.post(`/admin/add-item/${sectionName}`, formData);
      if (response.data.success) {
        setShowAddForm(false);
        setFormData({});
        fetchDashboardData();
        toast.success('Item added successfully!');
      }
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateItem = async (sectionName, itemIndex) => {
    try {
      setIsSubmitting(true);
      console.log(`Updating item at index ${itemIndex} in section ${sectionName}`);
      
      const sectionData = data[sectionName];
      if (!Array.isArray(sectionData)) {
        console.error('Section data is not an array');
        toast.error('Invalid data structure');
        return;
      }

      const updatedData = [...sectionData];
      updatedData[itemIndex] = { ...updatedData[itemIndex], ...formData };

      const response = await api.put(`/admin/update-section/${sectionName}`, updatedData);
      
      if (response.data.success) {
        console.log('Item updated successfully');
        setEditingItem(null);
        setEditingIndex(null);
        setFormData({});
        fetchDashboardData();
        toast.success('Item updated successfully!');
      } else {
        console.error('Failed to update item:', response.data.message);
        toast.error('Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (sectionName, itemIndex) => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      try {
        setIsSubmitting(true);
        console.log(`Deleting item at index ${itemIndex} from section ${sectionName}`);
        
        const sectionData = data[sectionName];
        if (!Array.isArray(sectionData)) {
          console.error('Section data is not an array');
          toast.error('Invalid data structure');
          return;
        }

        const updatedData = [...sectionData];
        updatedData.splice(itemIndex, 1);

        const response = await api.put(`/admin/update-section/${sectionName}`, updatedData);
        
        if (response.data.success) {
          console.log('Item deleted successfully');
          fetchDashboardData();
          toast.success('Item deleted successfully!');
        } else {
          console.error('Failed to delete item:', response.data.message);
          toast.error('Failed to delete item');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Failed to delete item');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleEditItem = (item, index) => {
    setEditingItem(item);
    setEditingIndex(index);
    
    const initialFormData = {};
    Object.keys(item).forEach(key => {
      initialFormData[key] = renderValue(item[key]);
    });
    setFormData(initialFormData);

    setTimeout(() => {
      const formElement = document.querySelector('.bg-white.p-6.rounded-lg.shadow-lg.border.border-gray-200');
      if (formElement) {
        formElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 50);
  };

  const getFormFields = (sectionName) => {
    switch (sectionName) {
      case 'News':
        return ['date', 'title', 'body', 'imageUrl', 'referenceUrl'];
      case 'Events':
      case 'upevents':
      case 'pastEvents':
        return ['date', 'location', 'title', 'body', 'imageUrl'];
      case 'eventsArchives':
        return ['date.day', 'date.month', 'title', 'body'];
      case 'Publications':
        return ['title', 'subtitle', 'body', 'imageUrl'];
      case 'partners':
        return ['title', 'imageUrl'];
      case 'leadership':
        return ['fullName', 'post', 'place', 'expertise', 'imageUrl', 'email', 'linkedinUrl', 'websiteUrl'];
      case 'tier':
        return ['title', 'timeline', 'fees'];
      case 'Testimonials':
        return ['title', 'body', 'imageUrl'];
      case 'Mission':
      case 'Member':
      case 'features':
        return ['title', 'body', 'imageUrl'];
      default:
        return ['title', 'body', 'imageUrl'];
    }
  };

  const renderForm = (sectionName, item = null) => {
    const isEditing = !!item;
    const currentData = item || formData;
    const fields = getFormFields(sectionName);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Item' : 'Add New Item'}
          </h3>
          <button
            onClick={() => {
              setShowAddForm(false);
              setEditingItem(null);
              setEditingIndex(null);
              setFormData({});
            }}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => {
            // Handle nested date fields
            if (field === 'date.day' || field === 'date.month') {
              const label = field === 'date.day' ? 'Day' : 'Month';
              return (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.date?.[label.toLowerCase()] || ''}
                    onChange={e => {
                      setFormData({
                        ...formData,
                        date: {
                          ...formData.date,
                          [label.toLowerCase()]: e.target.value
                        }
                      });
                    }}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder={`Enter ${label.toLowerCase()}...`}
                  />
                </div>
              );
            }
            if (field === 'body' ? 'md:col-span-2' : '') {
              return (
                <div key={field} className={field === 'body' ? 'md:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                    {field.replace(/([A-Z])/g, ' $1').trim()}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    value={formData[field] || renderValue(currentData[field]) || ''}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows="4"
                    placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}...`}
                  />
                </div>
              );
            }
            // For title
            return (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={formData[field] || renderValue(currentData[field]) || ''}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}...`}
                />
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={() => {
              setShowAddForm(false);
              setEditingItem(null);
              setEditingIndex(null);
              setFormData({});
            }}
            className="px-6 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={() => isEditing ? handleUpdateItem(sectionName, editingIndex) : handleAddItem(sectionName)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                {isEditing ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              <>
                <i className={`fa-solid ${isEditing ? 'fa-save' : 'fa-plus'} mr-2`}></i>
                {isEditing ? 'Update' : 'Add'}
              </>
            )}
          </button>
        </div>
      </motion.div>
    );
  };

  const renderSectionContent = (sectionName) => {
    const sectionData = data[sectionName] || [];
    const section = sections.find(s => s.key === sectionName);
    console.log(`Section ${sectionName} data:`, sectionData);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <i className={`${section?.icon} mr-3 text-blue-600 dark:text-blue-400`}></i>
              {section?.label || sectionName}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {Array.isArray(sectionData) ? `${sectionData.length} items` : 'No items available'}
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            Add New
          </button>
        </div>

        {showAddForm && renderForm(sectionName)}

        {Array.isArray(sectionData) && sectionData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectionData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow"
              >
                {item.imageUrl && (
                  <div className="relative mb-4">
                    <img
                      src={item.imageUrl}
                      alt={renderValue(item.title) || renderValue(item.fullName) || 'Item'}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      #{index + 1}
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  {/* Only show day, month, title, and body for pastEvents and eventsArchives */}
                  {(sectionName === 'pastEvents' || sectionName === 'eventsArchives') ? (
                    <>
                      {item.date && item.date.day && item.date.month && (
                        <p className="text-sm text-blue-700 font-semibold flex items-center">
                          <i className="fa-solid fa-calendar-days mr-1"></i>
                          {item.date.day} {item.date.month}
                        </p>
                      )}
                      {item.title && (
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{renderValue(item.title)}</h3>
                      )}
                      {item.body && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{renderValue(item.body)}</p>
                      )}
                    </>
                  ) : (
                    <>
                      {item.fullName && (
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{renderValue(item.fullName)}</h3>
                      )}
                      {item.post && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-600 px-2 py-1 rounded">{renderValue(item.post)}</p>
                      )}
                      {item.date && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <i className="fa-solid fa-calendar mr-1"></i>
                          {renderValue(item.date)}
                        </p>
                      )}
                      {item.location && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <i className="fa-solid fa-map-marker-alt mr-1"></i>
                          {renderValue(item.location)}
                        </p>
                      )}
                    </>
                  )}
                  {item.referenceUrl && (
                    <div className="mt-2">
                      <a
                        href={renderValue(item.referenceUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                      >
                        <i className="fa-solid fa-external-link-alt mr-1"></i>
                        Reference Link
                      </a>
                    </div>
                  )}
                  {item.fees && (
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                      ₹{renderValue(item.fees)}
                    </p>
                  )}
                </div>
                
                <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-600">
                  <button
                    onClick={() => handleEditItem(item, index)}
                    className="px-3 py-1 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    title="Edit item"
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDeleteItem(sectionName, index)}
                    className="px-3 py-1 text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Delete item"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <i className="fa-solid fa-inbox text-4xl text-gray-400 dark:text-gray-500 mb-4"></i>
            <p className="text-gray-500 dark:text-gray-400 text-lg">No items available</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Click "Add New" to create your first item</p>
          </div>
        )}

        {editingItem && renderForm(sectionName, editingItem)}
      </div>
    );
  };

  // Function to check if current user is admin
  const isAdmin = () => {
    // Check both role-based and email-based admin access
    const adminEmails = ['dhruvsumra13@gmail.com']; // Add admin emails here
    return user?.role === 'admin' || adminEmails.includes(user?.email);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-lock text-4xl text-gray-400 dark:text-gray-500 mb-4"></i>
          <p className="text-gray-600 dark:text-gray-300">Please log in to access admin panel.</p>
        </div>
      </div>
    );
  }

  // Check if user is admin
  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-shield-alt text-4xl text-red-400 dark:text-red-500 mb-4"></i>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-semibold mb-2">Access Denied</p>
          <p className="text-gray-500 dark:text-gray-400">You don't have permission to access the admin panel.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Last updated</p>
                <p className="text-sm font-medium dark:text-gray-200">{new Date().toLocaleTimeString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-user text-white"></i>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <i className="fa-solid fa-bars mr-2"></i>
                Sections
              </h2>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveSection('dashboard')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeSection === 'dashboard'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-l-4 border-blue-600'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <i className="fa-solid fa-tachometer-alt mr-3"></i>
                  Dashboard
                </button>
                {sections.map((section) => (
                  <button
                    key={section.key}
                    onClick={() => setActiveSection(section.key)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      activeSection === section.key
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-l-4 border-blue-600'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <i className={`${section.icon} mr-3 text-blue-500`}></i>
                    {section.label}
                    <span className="float-right bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                      {getSectionCount(section.key)}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
              {activeSection === 'dashboard' ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
                    <i className="fa-solid fa-chart-bar mr-3 text-blue-600"></i>
                    Overview
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sections.map((section) => (
                      <motion.div
                        key={section.key}
                        whileHover={{ y: -5 }}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer"
                        onClick={() => setActiveSection(section.key)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{section.label}</h3>
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                              {getSectionCount(section.key)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {getSectionCount(section.key) === 1 ? 'item' : 'items'}
                            </p>
                          </div>
                          <div className={`w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center`}>
                            <i className={`${section.icon} text-2xl text-blue-600 dark:text-blue-400`}></i>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                renderSectionContent(activeSection)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin; 