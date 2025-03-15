import React, { useState } from "react";
import {
  User,
  ShoppingBag,
  CreditCard,
  MapPin,
  Bell,
  Lock,
  Heart,
  LogOut,
  Settings,
  ChevronRight,
  Moon,
  Mail,
  Phone,
  Edit,
} from "lucide-react";

const Setting = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  // Navigation items for the sidebar
  const navItems = [
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "payment", label: "Payment Methods", icon: <CreditCard size={18} /> },
    { id: "addresses", label: "Addresses", icon: <MapPin size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    { id: "privacy", label: "Privacy & Security", icon: <Lock size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[#0c0b45]">Settings</h1>
          {/* <button className="flex items-center text-[#0c0b45] hover:underline">
            <Settings size={16} className="mr-1" /> Settings
          </button> */}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow-sm">
            <nav className="py-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={`w-full flex items-center px-4 py-3 text-left ${
                    activeTab === item.id
                      ? "bg-[#0c0b45]/10 border-l-4 border-[#0c0b45] text-[#0c0b45] font-medium"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                  {activeTab === item.id && (
                    <ChevronRight className="ml-auto" size={16} />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-grow bg-white rounded-lg shadow-sm p-6">
            {activeTab === "profile" && (
              <div>
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-20 h-20 rounded-full bg-[#1e1d6e] flex items-center justify-center text-white text-xl font-bold mr-6">
                      RS
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Rajiv Suting</h2>
                      <p className="text-gray-500">Admin</p>
                    </div>
                  </div>
                  <button
                    className="text-[#0c0b45] hover:underline flex items-center"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit size={16} className="mr-1" />
                    {isEditing ? "Cancel" : "Edit"}
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium text-[#0c0b45] mb-4 flex items-center">
                    <User className="mr-2" size={18} /> Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0c0b45]/50"
                          defaultValue="Rajiv"
                        />
                      ) : (
                        <div className="p-2 border border-gray-100 rounded bg-gray-50 text-gray-700">
                          Rajiv
                        </div>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0c0b45]/50"
                          defaultValue="Suting"
                        />
                      ) : (
                        <div className="p-2 border border-gray-100 rounded bg-gray-50 text-gray-700">
                          Suting
                        </div>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      {isEditing ? (
                        <div className="flex items-center relative">
                          <Mail
                            size={16}
                            className="text-gray-400 absolute left-2"
                          />
                          <input
                            type="email"
                            className="w-full p-2 pl-8 border border-gray-300 rounded bg-gray-50 cursor-not-allowed"
                            defaultValue="rajivsuting@gmail.com"
                            disabled={true}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="flex-grow p-2 border border-gray-100 rounded bg-gray-50 text-gray-700 flex items-center">
                            <Mail size={16} className="text-gray-400 mr-2" />
                            rajivsuting@gmail.com
                          </div>
                          <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-xl">
                            verified
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <div className="flex items-center relative">
                          <Phone
                            size={16}
                            className="text-gray-400 absolute left-2"
                          />
                          <input
                            type="tel"
                            className="w-full p-2 pl-8 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0c0b45]/50"
                            defaultValue="+91 6003684532"
                          />
                        </div>
                      ) : (
                        <div className="p-2 border border-gray-100 rounded bg-gray-50 text-gray-700 flex items-center">
                          <Phone size={16} className="text-gray-400 mr-2" />
                          +91 6003684532
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3 mt-8">
                    <button
                      className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button className="px-4 py-2 bg-[#0c0b45] text-white rounded hover:bg-[#1e1d6e]">
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab !== "profile" && (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="text-6xl text-[#0c0b45]/20 mb-4">
                  {navItems.find((item) => item.id === activeTab)?.icon}
                </div>
                <h3 className="text-xl font-medium mb-2">
                  {navItems.find((item) => item.id === activeTab)?.label}
                </h3>
                <p className="text-gray-500 mb-4 text-center">
                  This section is under development. Coming soon!
                </p>
                <button className="px-4 py-2 bg-[#0c0b45] text-white rounded hover:bg-[#1e1d6e]">
                  Back to Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
