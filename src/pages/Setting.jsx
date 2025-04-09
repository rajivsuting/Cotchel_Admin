import React, { useState } from "react";
import {
  Settings,
  Shield,
  CreditCard,
  Bell,
  Building2,
  Users,
  Save,
  ChevronRight,
  Edit2,
  X,
} from "lucide-react";

const Setting = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [settings, setSettings] = useState({
    platformName: "Cotchel",
    commissionRate: 20,
    minimumWithdrawal: 100,
    maintenanceMode: false,
    allowNewRegistrations: true,
    emailNotifications: true,
    platformCurrency: "USD",
    maxFileSize: 50,
    autoApproveSellers: false,
  });

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const handleSettingChange = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleInputChange = (setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleSaveSettings = () => {
    // TODO: Implement API call to save settings
    console.log("Saving settings:", settings);
    setIsEditMode(false);
  };

  const handleCancelEdit = () => {
    // TODO: Reset settings to original values
    setIsEditMode(false);
  };

  const tabs = [
    { icon: Building2, label: "General" },
    { icon: CreditCard, label: "Payments" },
    { icon: Shield, label: "Security" },
    { icon: Users, label: "User Management" },
    { icon: Bell, label: "Notifications" },
  ];

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
          {!isEditMode ? (
            <button
              onClick={() => setIsEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0c0b45] text-white rounded-lg hover:bg-[#0c0b45]/90 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Settings</span>
            </button>
          ) : (
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
                    {isEditMode ? (
                      <input
                        type="text"
                        value={settings.platformName}
                        onChange={(e) =>
                          handleInputChange("platformName", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0c0b45] focus:border-[#0c0b45]"
                      />
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 rounded-lg">
                        {settings.platformName}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission Rate (%)
                    </label>
                    {isEditMode ? (
                      <input
                        type="number"
                        value={settings.commissionRate}
                        onChange={(e) =>
                          handleInputChange("commissionRate", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0c0b45] focus:border-[#0c0b45]"
                      />
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 rounded-lg">
                        {settings.commissionRate}%
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Withdrawal Amount
                    </label>
                    {isEditMode ? (
                      <input
                        type="number"
                        value={settings.minimumWithdrawal}
                        onChange={(e) =>
                          handleInputChange("minimumWithdrawal", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0c0b45] focus:border-[#0c0b45]"
                      />
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 rounded-lg">
                        ${settings.minimumWithdrawal}
                      </div>
                    )}
                  </div>
                  <div className="col-span-full">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.maintenanceMode}
                        onChange={() => handleSettingChange("maintenanceMode")}
                        disabled={!isEditMode}
                        className="w-4 h-4 text-[#0c0b45] rounded border-gray-300 focus:ring-[#0c0b45]"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Maintenance Mode
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Payment Settings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform Currency
                    </label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={settings.platformCurrency}
                        onChange={(e) =>
                          handleInputChange("platformCurrency", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0c0b45] focus:border-[#0c0b45]"
                      />
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 rounded-lg">
                        {settings.platformCurrency}
                      </div>
                    )}
                  </div>
                  <div className="col-span-full">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Payment Methods
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800">PayPal</h4>
                          <p className="text-sm text-gray-600">
                            Enable PayPal payments
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                            disabled={!isEditMode}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0c0b45]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0c0b45]"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800">Stripe</h4>
                          <p className="text-sm text-gray-600">
                            Enable Stripe payments
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                            disabled={!isEditMode}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0c0b45]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0c0b45]"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Security Settings
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.allowNewRegistrations}
                        onChange={() =>
                          handleSettingChange("allowNewRegistrations")
                        }
                        disabled={!isEditMode}
                        className="w-4 h-4 text-[#0c0b45] rounded border-gray-300 focus:ring-[#0c0b45]"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Allow New User Registrations
                      </span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum File Upload Size (MB)
                    </label>
                    {isEditMode ? (
                      <input
                        type="number"
                        value={settings.maxFileSize}
                        onChange={(e) =>
                          handleInputChange("maxFileSize", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0c0b45] focus:border-[#0c0b45]"
                      />
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 rounded-lg">
                        {settings.maxFileSize} MB
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.autoApproveSellers}
                        onChange={() =>
                          handleSettingChange("autoApproveSellers")
                        }
                        disabled={!isEditMode}
                        className="w-4 h-4 text-[#0c0b45] rounded border-gray-300 focus:ring-[#0c0b45]"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Auto-approve New Sellers
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* User Management */}
            {activeTab === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  User Management
                </h2>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    User Roles
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">Sellers</h4>
                        <p className="text-sm text-gray-600">
                          Manage seller permissions and requirements
                        </p>
                      </div>
                      <button
                        className={`px-4 py-2 text-sm font-medium text-[#0c0b45] bg-[#0c0b45]/10 rounded-lg hover:bg-[#0c0b45]/20 transition-colors ${
                          !isEditMode ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={!isEditMode}
                      >
                        Configure
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">Buyers</h4>
                        <p className="text-sm text-gray-600">
                          Manage buyer permissions and requirements
                        </p>
                      </div>
                      <button
                        className={`px-4 py-2 text-sm font-medium text-[#0c0b45] bg-[#0c0b45]/10 rounded-lg hover:bg-[#0c0b45]/20 transition-colors ${
                          !isEditMode ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={!isEditMode}
                      >
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Notification Settings
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={() =>
                          handleSettingChange("emailNotifications")
                        }
                        disabled={!isEditMode}
                        className="w-4 h-4 text-[#0c0b45] rounded border-gray-300 focus:ring-[#0c0b45]"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Enable Email Notifications
                      </span>
                    </label>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Notification Types
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            New User Registration
                          </h4>
                          <p className="text-sm text-gray-600">
                            Receive notifications when new users register
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                            disabled={!isEditMode}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0c0b45]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0c0b45]"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            New Order
                          </h4>
                          <p className="text-sm text-gray-600">
                            Receive notifications for new orders
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                            disabled={!isEditMode}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0c0b45]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0c0b45]"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Withdrawal Requests
                          </h4>
                          <p className="text-sm text-gray-600">
                            Receive notifications for withdrawal requests
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                            disabled={!isEditMode}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0c0b45]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0c0b45]"></div>
                        </label>
                      </div>
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
