import { useState } from 'react';
import { useNavigate , useLocation} from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
const ResetPassword = () => {
  const location = useLocation();
  const email = location.state?.email;
  const [formData, setFormData] = useState({
    email: email,
    otp: '',
    newPassword: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const {resetPassword , loading , error:resetError} = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const result = await resetPassword(formData);
      if (result.success) {
        setSuccess(result.message || "Reset password successfully");
        setTimeout(() => navigate('/login'), 500);
      } else {
        setError(result.message || resetError || "Failed to reset password");
      }
    } catch (err) {
      setError( err.message || resetError || "Failed to reset password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-centerpx-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">Reset Password</h2>
        {error && <p className="text-sm text-red-500 mb-2 text-center">{error}</p>}
        {success && <p className="text-sm text-green-600 mb-2 text-center">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled  
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">OTP</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white font-semibold ${
              loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;