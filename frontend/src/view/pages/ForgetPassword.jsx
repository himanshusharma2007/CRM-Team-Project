import { useState } from "react";
import { forgotPassword, resetPassword, verifyOtp } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otpInput, setOtpInput] = useState("");

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await forgotPassword(email);
      showToast("OTP Sent, Please kindly check your email.", "success");
      setIsModalOpen(true);
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to send OTP. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await verifyOtp(otpInput);
      showToast("OTP verified successfully.", "success");
      setIsModalOpen(false);
      setStep(2);
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to verify OTP. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    try {
    console.log("password in reset ", password);

      const response = await resetPassword(password);
      if (response?.success) {
        showToast("Password reset successful.", "success");
        navigate('/login');
      } else {
        showToast("Password reset failed.", "error");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to reset password. Please try again.", "error");
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
          <form onSubmit={handlePasswordReset}>
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

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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

        {/* Custom Modal for OTP Verification */}
        {isModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center z-60">
            <div className="bg-white w-80 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Verify OTP</h2>
              <form onSubmit={handleOtpVerification}>
                <div className="mb-4">
                  <label htmlFor="otpInput" className="block text-gray-700 text-sm font-bold mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    id="otpInput"
                    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className={`bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Verifying...' : 'Verify'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-800 focus:outline-none"
                  >
                    &times; {/* Close button */}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Close Button for main modal */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none"
          onClick={() => setIsModalOpen(false)}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ForgetPassword;
