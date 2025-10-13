import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Eye, EyeOff, Lock, Shield, ArrowLeft } from "lucide-react";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      setTokenValid(false);
      toast.error("Invalid reset link");
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    } else if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one special character (@$!%*?&)";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const response = await axios.post(
        "https://starfish-app-6q6ot.ondigitalocean.app/api/auth/reset-password",
        {
          token,
          password: formData.password,
        }
      );

      if (response.data.message) {
        toast.success("Password reset successful!");
        navigate("/signin", { replace: true });
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to reset password. Please try again.";
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordToggle = () => {
    setShowPassword((prev) => !prev);
  };

  const handleConfirmPasswordToggle = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c0b45] to-[#14136a]">
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
          </div>
          <div className="relative z-10 flex items-center justify-center p-12 w-full">
            <div className="max-w-md text-white">
              <div className="flex items-center justify-center mb-8">
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm transform transition-transform hover:scale-105">
                  <Shield className="h-12 w-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4">Cotchel Admin</h1>
              <p className="text-lg text-white/80 leading-relaxed mb-8">
                The password reset link is invalid or has expired. Please
                request a new one.
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Error Message */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Invalid Reset Link
              </h2>
              <p className="text-gray-600 mb-6">
                The password reset link is invalid or has expired.
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Please request a new password reset link.
              </p>
              <Link
                to="/request-reset"
                className="block w-full bg-[#0c0b45] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0c0b45]/90 transition-colors"
              >
                Request New Reset Link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c0b45] to-[#14136a]">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center p-12 w-full">
          <div className="max-w-md text-white">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm transform transition-transform hover:scale-105">
                <Shield className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Cotchel Admin</h1>
            <p className="text-lg text-white/80 leading-relaxed mb-8">
              Create a new secure password for your admin account. Make sure
              it's strong and unique.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-[#0c0b45]/5 p-3 rounded-full">
                <Shield className="h-6 w-6 text-[#0c0b45]" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Reset Password
            </h1>
            <p className="text-gray-500">Enter your new password</p>
          </div>

          <div className="mb-6">
            <Link
              to="/signin"
              className="inline-flex items-center text-sm text-[#0c0b45] hover:text-[#14136a] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-left mb-2 hidden lg:block">
            Reset Your Password
          </h2>
          <p className="text-gray-600 mb-6 hidden lg:block">
            Enter your new password below.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c0b45] bg-gray-100 ${
                  errors.password ? "ring-2 ring-red-400" : ""
                }`}
                placeholder="Enter your new password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={handlePasswordToggle}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-700 cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>
            <div className="relative">
              <label className="block text-sm font-medium mb-1">
                Confirm New Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c0b45] bg-gray-100 ${
                  errors.confirmPassword ? "ring-2 ring-red-400" : ""
                }`}
                placeholder="Confirm your new password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={handleConfirmPasswordToggle}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-700 cursor-pointer"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            {errors.submit && (
              <p className="text-xs text-red-500">{errors.submit}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0c0b45] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#0c0b45]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              © 2024 Cotchel Admin. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
