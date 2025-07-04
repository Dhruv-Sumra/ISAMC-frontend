import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { sendResetOtp, loading, error: resetError } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");

    try {
      const result = await sendResetOtp(email);

      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          navigate("/reset-password", { state: { email } });
        }, 1000);
      } else {
        setError(result.message || resetError || "Failed to send OTP");
      }
    } catch (err) {
      setError(err.message || resetError || "Failed to send OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
          Forgot Password
        </h2>
        {error && (
          <p className="text-sm text-red-500 mb-2 text-center">{error}</p>
        )}
        {success && (
          <p className="text-sm text-green-600 mb-2 text-center">{success}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white font-semibold ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
        <p className="text-sm mt-4 text-center text-gray-600">
          Remember your password?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
