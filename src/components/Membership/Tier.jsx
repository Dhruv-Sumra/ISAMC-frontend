import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from "../ui/Spinner";
import api from "../../utils/api";
import EnhancedMembershipPurchase from "./EnhancedMembershipPurchase";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-hot-toast";  

const Leadership = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEventsData = useCallback(async () => {
    try {
      const response = await api.get("/v1/db/member-tiers"); 
      setTiers(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventsData();
  }, [fetchEventsData]);

  const memoizedTiers = useMemo(() => {
    // Separate honorary membership and other tiers
    const honoraryTier = tiers.find(tier => tier.type === "Honorary Membership");
    const otherTiers = tiers.filter(tier => tier.type !== "Honorary Membership");
    
    // Return other tiers first, then honorary membership at the end
    return [...otherTiers, honoraryTier].filter(Boolean);
  }, [tiers]);

  // Function to check if price should show rupee symbol
  const shouldShowRupeeSymbol = (price) => {
    if (typeof price === 'string') {
      const lowerPrice = price.toLowerCase();
      return !lowerPrice.includes('invitation') && !lowerPrice.includes('free') && !lowerPrice.includes('complimentary');
    }
    return true; // Show rupee symbol for numeric prices
  };

  // Function to format price display
  const formatPrice = (price) => {
    if (typeof price === 'string') {
      const lowerPrice = price.toLowerCase();
      if (lowerPrice.includes('invitation') || lowerPrice.includes('free') || lowerPrice.includes('complimentary')) {
        return price; // Return as is without rupee symbol
      }
    }
    return `₹${price}`; // Add rupee symbol for numeric prices
  };

  // Handle tier selection
  const handleTierClick = (tier) => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase membership');
      navigate('/login');
      return;
    }
    setSelectedTier(tier);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTier(null);
  };

  if (loading) {
    return (
      <Spinner/>
    );
  }

  if (error) {
    return (
      <div className="w-full h-auto mt-10 py-10 flex justify-center items-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-auto mt-10 py-5 md:px-10" id="tier">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3">
          Membership Tiers
        </h2>
        <div className='border-2 border-blue-500 w-20 m-auto'></div>
      </div>

      <div className="px-3 md:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
        {memoizedTiers.map((item, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg rounded-lg p-5 transition-shadow duration-200 cursor-pointer transform hover:scale-105 transition-all duration-200"
            onClick={() => handleTierClick(item)}
          >
            {/* Card Header */}
            <div className="text-center mb-4">
              <img 
                src={item.img} 
                alt={item.fullName} 
                className="w-16 h-16 mx-auto mb-3 object-cover rounded-full border-2 border-gray-200 dark:border-gray-600" 
              />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {item.type}
              </h3>
            </div>

            {/* Pricing Section */}
            <div className="space-y-3">
              {item.time_period?.annual && item.time_period?.lifetime && item.price?.annualPrice && item.price?.lifePrice ? (
                <>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      {item.time_period.annual}
                    </p>
                    <p className={`text-xl font-bold ${shouldShowRupeeSymbol(item.price.annualPrice) ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`}>
                      {formatPrice(item.price.annualPrice)}
                    </p>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      {item.time_period.lifetime}
                    </p>
                    <p className={`text-xl font-bold ${shouldShowRupeeSymbol(item.price.lifePrice) ? 'text-green-600 dark:text-green-400' : 'text-green-600 dark:text-green-400'}`}>
                      {formatPrice(item.price.lifePrice)}
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    {item.time_period?.annual || item.time_period?.lifetime || item.time_period}
                  </p>
                  <p className={`text-2xl font-bold ${shouldShowRupeeSymbol(item.price?.annualPrice || item.price?.lifePrice || item.price) ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`}>
                    {formatPrice(item.price?.annualPrice || item.price?.lifePrice || item.price)}
                  </p>
                </div>
              )}
            </div>

            {/* Become a Member Button */}
            <div className="text-center mt-4">
              <button 
                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card's onClick from firing
                  handleTierClick(item);
                }}
              >
                Become a Member
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Membership Purchase Modal */}
      <EnhancedMembershipPurchase
        isOpen={isModalOpen}
        onClose={handleModalClose}
        selectedTier={selectedTier}
      />
    </div>
  );
};

export default Leadership;