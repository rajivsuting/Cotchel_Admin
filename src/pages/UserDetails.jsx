import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Trash2,
  Mail,
  Calendar,
  Shield,
  MapPin,
  Briefcase,
  Phone,
  User,
  Power,
} from "lucide-react";

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching user with ID:", id);
        if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
          setError("The user ID provided is invalid.");
          return;
        }

        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/auth/get/${id}`
        );
        console.log("API Response:", response);

        if (response.status === 200) {
          const data = response.data.data || response.data;
          if (data && typeof data === "object") {
            setUser(data);
            setError(null);
          } else {
            throw new Error("Received invalid user data from server.");
          }
        } else {
          throw new Error(`Server responded with status ${response.status}`);
        }
      } catch (err) {
        console.error("Fetch Error:", err, err.response?.data);
        setError(
          err.response?.data?.message ||
            (err.response?.status === 404
              ? "User not found."
              : err.response?.status === 400
              ? "Invalid user ID."
              : err.message === "Network Error"
              ? "Unable to connect to the server. Please check your network."
              : "An error occurred while fetching user details.")
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Not provided";
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/auth/get/${id}`);
        window.location.href = "/users";
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to delete user. Please try again."
        );
        console.error("Delete Error:", err);
      }
    }
  };

  const handleToggleActive = async () => {
    const action = user.isActive ? "deactivate" : "activate";
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/auth/deactivate/${id}`,
          { isActive: !user.isActive }
        );
        if (response.status === 200) {
          setUser({ ...user, isActive: !user.isActive });
          setError(null);
        } else {
          throw new Error(`Server responded with status ${response.status}`);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            `Failed to ${action} user. Please try again.`
        );
        console.error("Toggle Active Error:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg font-medium">{error}</p>
          <Link
            to="/users"
            className="mt-4 inline-flex items-center px-4 py-2 bg-[#0c0b45] text-white rounded-lg hover:bg-[#14136a] transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg">User not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-6">
          <Link
            to="/users"
            className="flex items-center hover:text-[#0c0b45] transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Users
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">
            {user.fullName || "Unknown User"}
          </span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center mr-6 shadow-md">
                <span className="text-gray-600 text-3xl font-semibold">
                  {user.fullName?.charAt(0) || "?"}
                </span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  {user.fullName || "Unknown User"}
                </h1>
                <p className="text-sm text-gray-500 mt-1">ID: {user._id}</p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#0c0b45] text-white">
                    <MapPin size={16} className="mr-2" />
                    {user.addresses?.length || 0} Addresses
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#0c0b45] text-white">
                    <Briefcase size={16} className="mr-2" />
                    {user.sellerDetails ? "Seller" : "Non-Seller"}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#0c0b45] text-white">
                    <Power size={16} className="mr-2" />
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex gap-4">
              <button
                onClick={handleToggleActive}
                className={`flex items-center px-4 py-2 rounded-lg text-white transition-colors ${
                  user.isActive
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                <Power size={16} className="mr-2" />
                {user.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
            <div className="flex items-center">
              <Calendar size={18} className="mr-3 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Created</p>
                <p className="text-sm text-gray-600">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Mail size={18} className="mr-3 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-sm text-gray-600">
                  {user.email || "No email provided"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Shield size={18} className="mr-3 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Role</p>
                <p className="text-sm text-gray-600 capitalize">
                  {user.role || "No role assigned"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Shield size={18} className="mr-3 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Email Status
                </p>
                <p className="text-sm text-gray-600">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.isEmailVerified
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.isEmailVerified ? "Verified" : "Unverified"}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <User size={18} className="mr-3 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Gender</p>
                <p className="text-sm text-gray-600 capitalize">
                  {user.gender || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar size={18} className="mr-3 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Date of Birth
                </p>
                <p className="text-sm text-gray-600">
                  {formatDate(user.dateOfBirth)}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone size={18} className="mr-3 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Phone</p>
                <p className="text-sm text-gray-600">
                  {user.phone || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Addresses Section */}
        {user.addresses?.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <MapPin size={20} className="mr-2 text-gray-500" />
              Addresses ({user.addresses.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.addresses.map((address, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-gray-700 font-medium text-lg">
                      {address.name || `Address ${index + 1}`}
                    </h3>
                    {address.isDefault && (
                      <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                  </p>
                  <p className="text-gray-600">
                    {address.city}, {address.state} {address.postalCode},{" "}
                    {address.country}
                  </p>
                  {address.phone && (
                    <p className="text-gray-600 flex items-center mt-2">
                      <Phone size={14} className="mr-2" />
                      {address.phone}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seller Details Section - Only shown if exists */}
        {user.sellerDetails && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Briefcase size={20} className="mr-2 text-gray-500" />
              Seller Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-gray-600">
                  <strong className="font-medium">Business Name:</strong>{" "}
                  {user.sellerDetails.businessName}
                </p>
                {user.sellerDetails.gstin && (
                  <p className="text-gray-600">
                    <strong className="font-medium">GSTIN:</strong>{" "}
                    {user.sellerDetails.gstin}
                  </p>
                )}
                {user.sellerDetails.pan && (
                  <p className="text-gray-600">
                    <strong className="font-medium">PAN:</strong>{" "}
                    {user.sellerDetails.pan}
                  </p>
                )}
                <p className="text-gray-600">
                  <strong className="font-medium">Bank Name:</strong>{" "}
                  {user.sellerDetails.bankName}
                </p>
                <p className="text-gray-600">
                  <strong className="font-medium">Account Name:</strong>{" "}
                  {user.sellerDetails.accountName}
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-gray-600">
                  <strong className="font-medium">Account Number:</strong>{" "}
                  {user.sellerDetails.accountNumber}
                </p>
                {user.sellerDetails.ifscCode && (
                  <p className="text-gray-600">
                    <strong className="font-medium">IFSC Code:</strong>{" "}
                    {user.sellerDetails.ifscCode}
                  </p>
                )}
                {user.sellerDetails.branch && (
                  <p className="text-gray-600">
                    <strong className="font-medium">Branch:</strong>{" "}
                    {user.sellerDetails.branch}
                  </p>
                )}
                <p className="text-gray-600">
                  <strong className="font-medium">Address:</strong>{" "}
                  {user.sellerDetails.addressLine1}
                  {user.sellerDetails.addressLine2 &&
                    `, ${user.sellerDetails.addressLine2}`}
                </p>
                <p className="text-gray-600">
                  {user.sellerDetails.city}, {user.sellerDetails.state}{" "}
                  {user.sellerDetails.postalCode}, {user.sellerDetails.country}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
