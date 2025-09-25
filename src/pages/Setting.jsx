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

  useEffect(() => {
    fetchPlatformSettings();
    fetchAdmins();
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

  const tabs = [
    { icon: Building2, label: "General" },
    { icon: Users, label: "Admins" },
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
