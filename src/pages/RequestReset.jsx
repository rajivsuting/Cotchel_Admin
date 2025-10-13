import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Mail, Shield, ArrowLeft } from "lucide-react";

const RequestReset = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [resentSuccess, setResentSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "https://starfish-app-6q6ot.ondigitalocean.app/api/auth/request-reset",
        { email }
      );

      if (response.data.message) {
        setEmailSent(true);
        toast.success("Password reset link sent to your email!");
      }
    } catch (error) {
      console.error("Error requesting password reset:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send reset link. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
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
                Check your email for the password reset link. We've sent you a
                secure link to reset your password.
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Success Message */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Check Your Email
              </h2>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Click the link in the email to reset your password. The link
                will expire in 1 hour.
              </p>
              <div className="space-y-4">
                <Link
                  to="/signin"
                  className="block w-full bg-[#0c0b45] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0c0b45]/90 transition-colors"
                >
                  Back to Login
                </Link>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setEmailSent(false);
                      setEmail("");
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Send Another Email
                  </button>
                  <button
                    onClick={async () => {
                      setResending(true);
                      try {
                        const response = await axios.post(
                          "https://starfish-app-6q6ot.ondigitalocean.app/api/auth/request-reset",
                          { email }
                        );
                        if (response.data.message) {
                          toast.success("Password reset link resent!");
                          setResentSuccess(true);
                          setTimeout(() => setResentSuccess(false), 2000);
                        }
                      } catch (error) {
                        const errorMessage =
                          error.response?.data?.message ||
                          "Failed to resend reset link. Please try again.";
                        toast.error(errorMessage);
                      } finally {
                        setResending(false);
                      }
                    }}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200`}
                    disabled={resending}
                  >
                    {resentSuccess
                      ? "Link Sent!"
                      : resending
                      ? "Resending..."
                      : "Resend Link"}
                  </button>
                </div>
              </div>
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
              Forgot your password? No worries! Enter your email address and
              we'll send you a secure link to reset it.
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
              Forgot Password?
            </h1>
            <p className="text-gray-500">
              Enter your email to reset your password
            </p>
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
            Forgot Password?
          </h2>
          <p className="text-gray-600 mb-6 hidden lg:block">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c0b45] bg-gray-100 ${
                  error ? "ring-2 ring-red-400" : ""
                }`}
                placeholder="Enter your email address"
                disabled={loading}
              />
              {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0c0b45] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#0c0b45]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Sending..." : "Send Reset Link"}
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

export default RequestReset;
