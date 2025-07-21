import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // Get regToken and email from navigation state
  const regToken = location.state?.regToken;
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Call backend verifyEmail with regToken and otp
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regToken, otp })
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Email verified successfully. You can now log in.');
        toast.success('Email verified successfully. Please log in.');
        setTimeout(() => navigate('/login'), 1000);
      } else {
        setError(data.message || 'Verification failed');
        toast.error(data.message || 'Verification failed');
      }
    } catch (err) {
      setError(err.message || 'Verification failed');
      toast.error(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={e => setOtp(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-2"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">{success}</p>}
      </form>
      <p className="mt-4 text-gray-600">OTP sent to: <span className="font-semibold">{email}</span></p>
    </div>
  );
};

export default VerifyEmail;