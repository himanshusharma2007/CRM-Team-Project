import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, sendOtpForRegister } from "../../services/authService";
import { useToast } from "../../context/ToastContext";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for spinner
  const { showToast } = useToast();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading spinner
    try {
      await sendOtpForRegister(name, email); // Send OTP using the email
      setIsOtpSent(true); // Show additional fields for OTP and Password
      showToast("OTP sent successfully!", "success");
    } catch (error) {
      showToast("Failed to send OTP. Please try again.", "error");
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    try {
      // Register the user with the name, password, and OTP
      await registerUser(otp, password);
      showToast("User registered successfully!", "success");
      navigate("/login");
    } catch (error) {
      showToast(
        "Invalid OTP or registration failed. Please try again.",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-blue-500">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Create an Account
        </h2>

        <form onSubmit={isOtpSent ? handleVerifyAndRegister : handleSendOtp}>
          {/* Name Field */}
          <div className="mb-6">
            <label
              className="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isOtpSent ? true : false}
            />
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <label
              className="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              disabled={isOtpSent ? true : false}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Conditionally render OTP and Password fields if OTP is sent */}
          {isOtpSent && (
            <>
              {/* OTP Field */}
              <div className="mb-6">
                <label
                  className="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2"
                  htmlFor="otp"
                >
                  OTP
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="otp"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="mb-6">
                <label
                  className="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {/* Buttons */}
          <button
            className={`w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            type="submit"
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <span className="flex justify-center items-center">
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Sending...
              </span>
            ) : isOtpSent ? (
              "Verify & Sign Up"
            ) : (
              "Send OTP"
            )}
          </button>
        </form>

        {/* Redirect to Login */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
