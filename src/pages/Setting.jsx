import React, { useState, useEffect } from "react";
import {
  Settings,
  Building2,
  Users,
  Save,
  Edit2,
  X,
  UserPlus,
  Trash2,
  User,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const Setting = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    platformName: "Cotchel",
    commissionRate: 10,
  });

  const [admins, setAdmins] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    gender: "Male",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileData, setProfileData] = useState({
    fullName: "",
    phoneNumber: "",
    gender: "Male",
    email: "",
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    fetchPlatformSettings();
    fetchAdmins();
    fetchProfileData();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(
        "https://starfish-app-6q6ot.ondigitalocean.app/api/admin/admins",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.data) {
        setAdmins(response.data.data);
      } else {
        setAdmins([]);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error(
        error.response?.data?.message || "Failed to load admin list",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      setAdmins([]);
    }
  };

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(
        "https://starfish-app-6q6ot.ondigitalocean.app/api/admin/profile",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.data) {
        setProfileData({
          fullName: response.data.data.fullName || "",
          phoneNumber: response.data.data.phoneNumber || "",
          gender: response.data.data.gender || "Male",
          email: response.data.data.email || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const fetchPlatformSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://starfish-app-6q6ot.ondigitalocean.app/api/admin/settings/platform",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.data) {
        setSettings((prev) => ({
          ...prev,
          commissionRate: response.data.data.platformFeePercentage,
        }));
      }
    } catch (error) {
      console.error("Error fetching platform settings:", error);
      toast.error("Failed to load platform settings", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (index) => {
    setActiveTab(index);
    setShowAddForm(false);
  };

  const handleInputChange = (setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleNewAdminChange = (field, value) => {
    setNewAdmin((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    // Real-time validation for new password
    if (field === "newPassword") {
      validateNewPassword(value);
    }

    // Real-time validation for confirm password
    if (field === "confirmPassword") {
      validateConfirmPassword(value, passwordForm.newPassword);
    }
  };

  const handleProfileChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put(
        "https://starfish-app-6q6ot.ondigitalocean.app/api/admin/profile",
        {
          fullName: profileData.fullName,
          phoneNumber: profileData.phoneNumber,
          gender: profileData.gender,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Profile updated successfully", {
        position: "top-right",
        autoClose: 3000,
      });

      setIsEditingProfile(false);
      fetchProfileData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleCancelProfileEdit = () => {
    fetchProfileData();
    setIsEditingProfile(false);
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateNewPassword = (password) => {
    const errors = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push(
        "Password must contain at least one special character (@$!%*?&)"
      );
    }

    setPasswordErrors((prev) => ({
      ...prev,
      newPassword: errors.length > 0 ? errors.join(", ") : "",
    }));

    return errors.length === 0;
  };

  const validateConfirmPassword = (confirmPassword, newPassword) => {
    if (confirmPassword && confirmPassword !== newPassword) {
      setPasswordErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return false;
    } else {
      setPasswordErrors((prev) => ({
        ...prev,
        confirmPassword: "",
      }));
      return true;
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!passwordForm.currentPassword.trim()) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordForm.newPassword.trim()) {
      errors.newPassword = "New password is required";
    } else if (!validateNewPassword(passwordForm.newPassword)) {
      // Error already set by validateNewPassword
    }

    if (!passwordForm.confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (
      !validateConfirmPassword(
        passwordForm.confirmPassword,
        passwordForm.newPassword
      )
    ) {
      // Error already set by validateConfirmPassword
    }

    setPasswordErrors((prev) => ({ ...prev, ...errors }));
    return (
      Object.keys(errors).length === 0 &&
      !passwordErrors.newPassword &&
      !passwordErrors.confirmPassword
    );
  };

  const handleAddAdmin = async () => {
    if (newAdmin.password !== newAdmin.confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      await axios.post(
        "https://starfish-app-6q6ot.ondigitalocean.app/api/admin/create-admin",
        {
          fullName: newAdmin.fullName,
          email: newAdmin.email,
          password: newAdmin.password,
          phoneNumber: newAdmin.phoneNumber,
          gender: newAdmin.gender,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("New admin added successfully", {
        position: "top-right",
        autoClose: 3000,
      });

      setNewAdmin({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        gender: "Male",
      });
      setShowAddForm(false);
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add new admin", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    try {
      await axios.delete(
        `https://starfish-app-6q6ot.ondigitalocean.app/api/admin/${adminId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Admin deleted successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      fetchAdmins();
    } catch (error) {
      toast.error("Failed to delete admin", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleSaveSettings = async () => {
    try {
      if (activeTab === 0) {
        await axios.post(
          "https://starfish-app-6q6ot.ondigitalocean.app/api/admin/settings/platform",
          {
            platformFeePercentage: settings.commissionRate,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Platform settings updated successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      setIsEditMode(false);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleCancelEdit = () => {
    fetchPlatformSettings();
    setIsEditMode(false);
  };

  const handleChangePassword = async () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors before submitting", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      await axios.put(
        "https://starfish-app-6q6ot.ondigitalocean.app/api/admin/change-password",
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Password updated successfully", {
        position: "top-right",
        autoClose: 3000,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordErrors({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordVisibility({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update password";

      if (errorMessage.includes("Current password is incorrect")) {
        setPasswordErrors((prev) => ({
          ...prev,
          currentPassword: "Current password is incorrect",
        }));
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const tabs = [
    { icon: Building2, label: "General" },
    { icon: Users, label: "Admins" },
    { icon: User, label: "Account" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#0c0b45]" />
            <h1 className="text-2xl font-semibold text-gray-800">
              Platform Settings
            </h1>
          </div>
          {!isEditMode && activeTab === 0 ? (
            <button
              onClick={() => setIsEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0c0b45] text-white rounded-lg hover:bg-[#0c0b45]/90 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Settings</span>
            </button>
          ) : (
            activeTab === 0 && (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0c0b45] text-white rounded-lg hover:bg-[#0c0b45]/90 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            )
          )}
        </div>
        <div className="border-b border-gray-200 mb-6"></div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-gray-50 rounded-lg p-4">
            <nav className="space-y-1">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => handleTabChange(index)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === index
                      ? "bg-[#0c0b45]/10 text-[#0c0b45]"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* General Settings */}
            {activeTab === 0 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  General Settings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform Name
                    </label>
                    <div className="px-4 py-2 bg-gray-50 rounded-lg">
                      {settings.platformName}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform Fee (%)
                    </label>
                    {isEditMode ? (
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={settings.commissionRate}
                          onChange={(e) =>
                            handleInputChange(
                              "commissionRate",
                              Number(e.target.value)
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0c0b45] focus:border-[#0c0b45]"
                        />
                        <span className="absolute right-3 top-2.5 text-gray-500">
                          %
                        </span>
                      </div>
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 rounded-lg">
                        {settings.commissionRate}%
                      </div>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      This percentage will be deducted from each transaction as
                      platform fee
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Admin List */}
            {activeTab === 1 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Admin List
                  </h2>
                  {!showAddForm && (
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#0c0b45] text-white rounded-lg hover:bg-[#0c0b45]/90 transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Add Admin</span>
                    </button>
                  )}
                </div>

                {showAddForm ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Add New Admin
                      </h3>
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={newAdmin.fullName}
                          onChange={(e) =>
                            handleNewAdminChange("fullName", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0c0b45] focus:border-[#0c0b45]"
                          placeholder="Enter full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={newAdmin.email}
                          onChange={(e) =>
                            handleNewAdminChange("email", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0c0b45] focus:border-[#0c0b45]"
                          placeholder="Enter admin email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={newAdmin.phoneNumber}
                          onChange={(e) =>
                            handleNewAdminChange("phoneNumber", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0c0b45] focus:border-[#0c0b45]"
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender
                        </label>
                        <select
                          value={newAdmin.gender}
                          onChange={(e) =>
                            handleNewAdminChange("gender", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0c0b45] focus:border-[#0c0b45]"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <input
                          type="password"
                          value={newAdmin.password}
                          onChange={(e) =>
                            handleNewAdminChange("password", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0c0b45] focus:border-[#0c0b45]"
                          placeholder="Enter password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          value={newAdmin.confirmPassword}
                          onChange={(e) =>
                            handleNewAdminChange(
                              "confirmPassword",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0c0b45] focus:border-[#0c0b45]"
                          placeholder="Confirm password"
                        />
                      </div>
                      <div className="flex justify-end gap-2 mt-6">
                        <button
                          onClick={() => setShowAddForm(false)}
                          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddAdmin}
                          className="px-4 py-2 bg-[#0c0b45] text-white rounded-lg hover:bg-[#0c0b45]/90 transition-colors"
                        >
                          Add Admin
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Phone
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {admins.map((admin) => (
                            <tr key={admin._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {admin.fullName}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {admin.email}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {admin.phoneNumber}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button
                                  onClick={() => handleDeleteAdmin(admin._id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Account Settings */}
            {activeTab === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Account Settings
                </h2>

                {/* Profile Information */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-[#0c0b45]" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Profile Information
                      </h3>
                    </div>
                    {!isEditingProfile ? (
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="flex items-center gap-2 px-4 py-2 text-[#0c0b45] border border-[#0c0b45] rounded-lg hover:bg-[#0c0b45] hover:text-white transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleCancelProfileEdit}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          className="flex items-center gap-2 px-4 py-2 bg-[#0c0b45] text-white rounded-lg hover:bg-[#0c0b45]/90 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={profileData.fullName}
                          onChange={(e) =>
                            handleProfileChange("fullName", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0c0b45] focus:border-[#0c0b45]"
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                          {profileData.fullName || "Not set"}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                        {profileData.email || "Not set"}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Email cannot be changed
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="tel"
                          value={profileData.phoneNumber}
                          onChange={(e) =>
                            handleProfileChange("phoneNumber", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0c0b45] focus:border-[#0c0b45]"
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                          {profileData.phoneNumber || "Not set"}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      {isEditingProfile ? (
                        <select
                          value={profileData.gender}
                          onChange={(e) =>
                            handleProfileChange("gender", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0c0b45] focus:border-[#0c0b45]"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                          {profileData.gender || "Not set"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Change Password */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Lock className="w-5 h-5 text-[#0c0b45]" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Change Password
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={
                            passwordVisibility.currentPassword
                              ? "text"
                              : "password"
                          }
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            handlePasswordChange(
                              "currentPassword",
                              e.target.value
                            )
                          }
                          className={`w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-[#0c0b45] focus:border-[#0c0b45] ${
                            passwordErrors.currentPassword
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            togglePasswordVisibility("currentPassword")
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {passwordVisibility.currentPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {passwordErrors.currentPassword}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={
                            passwordVisibility.newPassword ? "text" : "password"
                          }
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            handlePasswordChange("newPassword", e.target.value)
                          }
                          className={`w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-[#0c0b45] focus:border-[#0c0b45] ${
                            passwordErrors.newPassword
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            togglePasswordVisibility("newPassword")
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {passwordVisibility.newPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {passwordErrors.newPassword}
                        </p>
                      )}
                      <div className="mt-2 text-xs text-gray-600">
                        <p>Password must contain:</p>
                        <ul className="list-disc list-inside space-y-1 mt-1">
                          <li
                            className={
                              passwordForm.newPassword.length >= 8
                                ? "text-green-600"
                                : "text-gray-500"
                            }
                          >
                            At least 8 characters
                          </li>
                          <li
                            className={
                              /(?=.*[a-z])/.test(passwordForm.newPassword)
                                ? "text-green-600"
                                : "text-gray-500"
                            }
                          >
                            One lowercase letter
                          </li>
                          <li
                            className={
                              /(?=.*[A-Z])/.test(passwordForm.newPassword)
                                ? "text-green-600"
                                : "text-gray-500"
                            }
                          >
                            One uppercase letter
                          </li>
                          <li
                            className={
                              /(?=.*\d)/.test(passwordForm.newPassword)
                                ? "text-green-600"
                                : "text-gray-500"
                            }
                          >
                            One number
                          </li>
                          <li
                            className={
                              /(?=.*[@$!%*?&])/.test(passwordForm.newPassword)
                                ? "text-green-600"
                                : "text-gray-500"
                            }
                          >
                            One special character (@$!%*?&)
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={
                            passwordVisibility.confirmPassword
                              ? "text"
                              : "password"
                          }
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            handlePasswordChange(
                              "confirmPassword",
                              e.target.value
                            )
                          }
                          className={`w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-[#0c0b45] focus:border-[#0c0b45] ${
                            passwordErrors.confirmPassword
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            togglePasswordVisibility("confirmPassword")
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {passwordVisibility.confirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {passwordErrors.confirmPassword}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-end mt-6">
                      <button
                        onClick={handleChangePassword}
                        className="flex items-center gap-2 px-6 py-2 bg-[#0c0b45] text-white rounded-lg hover:bg-[#0c0b45]/90 transition-colors"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Update Password</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
