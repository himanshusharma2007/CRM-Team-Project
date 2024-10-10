import { useState } from "react";
import { forgotPassword, verifyOTP } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate()
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await forgotPassword(email);
      alert("OTP bhej diya bhai, mail check karle.");
      setStep(2);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpAndPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await verifyOTP(email, otp, password);
      if (response?.message === 'Password reset successful') {
        alert("Password reset successful. You can now login with your new password.");
        // Implement redirect to login page or other post-success logic here
        navigate('/login')
      } else {
        setError("Password reset failed. Please try again.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>

        {error && (
          <div className="mb-4 text-red-500">{error}</div>
        )}

        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="mb-6">
              <button
                type="submit"
                className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpAndPasswordSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-gray-700 text-sm font-bold mb-2">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                New Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-6">
              <button
                type="submit"
                className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </div>
          </form>
        )}

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ForgetPassword;