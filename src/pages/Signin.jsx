import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Shield,
  BarChart2,
  Settings,
  Users,
} from "lucide-react";
import { toast } from "react-toastify";

const Signin = () => {
  const { admin, initialized, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // Redirect if already authenticated
  useEffect(() => {
    if (initialized && admin) {
      navigate(from, { replace: true });
    }
  }, [admin, initialized, navigate, from]);

  useEffect(() => {
    if (isLocked) {
      const timer = setInterval(() => {
        setLockTime((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setLoginAttempts(0);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLocked]);

  useEffect(() => {
    setErrors({});
  }, [email, password]);

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || isLocked) return;

    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        toast.success("Login successful!");
      } else {
        // Handle specific error types
        if (result.type === "admin_account_deactivated") {
          toast.error(result.error, {
            duration: 10000,
            style: {
              background: "#fef3c7",
              color: "#d97706",
              border: "1px solid #fde68a",
              borderRadius: "8px",
              padding: "16px",
              fontSize: "14px",
              fontWeight: "500",
            },
          });
        } else {
          setLoginAttempts((prev) => {
            const newAttempts = prev + 1;
            if (newAttempts >= 3) {
              setIsLocked(true);
              setLockTime(300);
              toast.error(
                "Too many failed attempts. Account locked for 5 minutes."
              );
            }
            return newAttempts;
          });
          toast.error(
            result.error || "Login failed. Please check your credentials."
          );
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.error || "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking auth
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0c0b45]"></div>
      </div>
    );
  }

  // Don't render login form if already authenticated
  if (admin) {
    return null;
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
              Welcome to your admin dashboard. Sign in to access powerful tools
              and manage your platform efficiently.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <div className="bg-white/10 p-2 rounded-lg">
                  <BarChart2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">Analytics Dashboard</h3>
                  <p className="text-sm text-white/60">
                    Track sales, users, and performance metrics
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <div className="bg-white/10 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">User Management</h3>
                  <p className="text-sm text-white/60">
                    Manage users, roles, and permissions
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <div className="bg-white/10 p-2 rounded-lg">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">Platform Settings</h3>
                  <p className="text-sm text-white/60">
                    Configure system settings and preferences
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-[#0c0b45]/5 p-3 rounded-full">
                <Shield className="h-6 w-6 text-[#0c0b45]" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome Back
            </h1>
            <p className="text-gray-500">Sign in to your admin account</p>
          </div>

          {isLocked && (
            <div className="mb-6 bg-red-50 p-4 rounded-lg border-l-4 border-red-500 animate-fade-in">
              <p className="text-sm text-red-600">
                Account locked. Please try again in {Math.floor(lockTime / 60)}:
                {(lockTime % 60).toString().padStart(2, "0")} minutes.
              </p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="group">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#0c0b45] transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`appearance-none block w-full pl-10 pr-3 py-2.5 border ${
                      errors.email
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-[#0c0b45]"
                    } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0c0b45] transition-all duration-200`}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting || isLocked}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600 animate-fade-in">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="group">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#0c0b45] transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className={`appearance-none block w-full pl-10 pr-10 py-2.5 border ${
                      errors.password
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-[#0c0b45]"
                    } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0c0b45] transition-all duration-200`}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting || isLocked}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting || isLocked}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-600 animate-fade-in">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLocked}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-white bg-[#0c0b45] hover:bg-[#14136a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0c0b45] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/request-reset"
              className="text-sm text-[#0c0b45] hover:text-[#14136a] hover:underline transition-colors"
            >
              Forgot your password?
            </Link>
          </div>

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

export default Signin;
