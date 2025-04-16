import React, { useState, useEffect } from "react";
import {
  Home,
  ShoppingBag,
  Package,
  Users,
  BarChart2,
  Settings,
  HelpCircle,
  ChevronDown,
  LogOut,
  Menu,
  Truck,
  DollarSign,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import useSocket from "../hooks/useSocket"; // Import the Socket.IO hook
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState(() => {
    const saved = localStorage.getItem("sidebarExpanded");
    console.log("Loaded from localStorage:", saved);
    return saved
      ? JSON.parse(saved)
      : { products: false, orders: false, customers: false };
  });

  // Use Socket.IO hook for admin notifications
  const { notifications } = useSocket(true); // isAdmin = true
  const unreadCount = notifications.filter((notif) => !notif.read).length; // Count unread notifications
  const { logout, admin } = useAuth();

  useEffect(() => {
    console.log("Saving to localStorage:", expanded);
    localStorage.setItem("sidebarExpanded", JSON.stringify(expanded));
  }, [expanded]);

  const toggleExpand = (section) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
      console.error("Logout error:", error);
    }
  };

  const activeClassName = "bg-[#1d1c5e] text-white";
  const inactiveClassName = "text-gray-300 hover:bg-[#1d1c5e] hover:text-white";

  return (
    <div className="flex h-screen">
      <div
        className={`bg-[#0c0b45] flex flex-col transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#1d1c5e]">
          {!collapsed && (
            <div className="text-3xl ml-4 font-bold text-white">Cotchel</div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-[#1d1c5e] text-gray-300"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto scrollbar-hidden py-2">
          <nav className="px-2">
            {/* Dashboard */}
            <div className="mb-1 group">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md transition-colors ${
                    isActive ? activeClassName : inactiveClassName
                  }`
                }
              >
                <Home size={20} className="min-w-5" />
                {!collapsed && <span className="ml-3">Dashboard</span>}
                {collapsed && (
                  <div className="absolute left-16 hidden group-hover:block bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                    Dashboard
                  </div>
                )}
              </NavLink>
            </div>

            {/* Products Section */}
            <div className="mb-1 group">
              <button
                onClick={() => toggleExpand("products")}
                className={`w-full flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-[#1d1c5e] rounded-md transition-colors ${
                  expanded.products ? "bg-[#1d1c5e]" : ""
                }`}
              >
                <div className="flex items-center">
                  <Package size={20} className="text-gray-300 min-w-5" />
                  {!collapsed && <span className="ml-3">Products</span>}
                </div>
                {!collapsed && (
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transform transition-transform ${
                      expanded.products ? "rotate-180" : ""
                    }`}
                  />
                )}
                {collapsed && (
                  <div className="absolute left-16 hidden group-hover:block bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                    Products
                  </div>
                )}
              </button>

              {expanded.products && !collapsed && (
                <div className="pl-9 pr-2 py-1">
                  <NavLink
                    to="/all-products"
                    className={({ isActive }) =>
                      `block py-2 px-2 text-sm rounded-md ${
                        isActive
                          ? "text-white bg-[#1d1c5e]"
                          : "text-gray-400 hover:text-white hover:bg-[#1d1c5e]"
                      }`
                    }
                  >
                    All Products
                  </NavLink>
                  <NavLink
                    to="/add-product"
                    className={({ isActive }) =>
                      `block py-2 px-2 text-sm rounded-md ${
                        isActive
                          ? "text-white bg-[#1d1c5e]"
                          : "text-gray-400 hover:text-white hover:bg-[#1d1c5e]"
                      }`
                    }
                  >
                    Add New
                  </NavLink>
                  <NavLink
                    to="/categories"
                    className={({ isActive }) =>
                      `block py-2 px-2 text-sm rounded-md ${
                        isActive
                          ? "text-white bg-[#1d1c5e]"
                          : "text-gray-400 hover:text-white hover:bg-[#1d1c5e]"
                      }`
                    }
                  >
                    Categories
                  </NavLink>
                  <NavLink
                    to="/subcategories"
                    className={({ isActive }) =>
                      `block py-2 px-2 text-sm rounded-md ${
                        isActive
                          ? "text-white bg-[#1d1c5e]"
                          : "text-gray-400 hover:text-white hover:bg-[#1d1c5e]"
                      }`
                    }
                  >
                    Sub Categories
                  </NavLink>
                </div>
              )}
            </div>

            {/* Orders Section */}
            <div className="mb-1 group">
              <button
                onClick={() => toggleExpand("orders")}
                className={`w-full flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-[#1d1c5e] rounded-md transition-colors ${
                  expanded.orders ? "bg-[#1d1c5e]" : ""
                }`}
              >
                <div className="flex items-center">
                  <ShoppingBag size={20} className="text-gray-300 min-w-5" />
                  {!collapsed && <span className="ml-3">Orders</span>}
                </div>
                {!collapsed && (
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transform transition-transform ${
                      expanded.orders ? "rotate-180" : ""
                    }`}
                  />
                )}
                {collapsed && (
                  <div className="absolute left-16 hidden group-hover:block bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                    Orders
                  </div>
                )}
              </button>

              {expanded.orders && !collapsed && (
                <div className="pl-9 pr-2 py-1">
                  <NavLink
                    to="/all-orders"
                    className={({ isActive }) =>
                      `block py-2 px-2 text-sm rounded-md ${
                        isActive
                          ? "text-white bg-[#1d1c5e]"
                          : "text-gray-400 hover:text-white hover:bg-[#1d1c5e]"
                      }`
                    }
                  >
                    All Orders
                  </NavLink>
                </div>
              )}
            </div>

            {/* Customers Section */}
            <div className="mb-1 group">
              <button
                onClick={() => toggleExpand("customers")}
                className={`w-full flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-[#1d1c5e] rounded-md transition-colors ${
                  expanded.customers ? "bg-[#1d1c5e]" : ""
                }`}
              >
                <div className="flex items-center">
                  <Users size={20} className="text-gray-300 min-w-5" />
                  {!collapsed && <span className="ml-3">Users</span>}
                </div>
                {!collapsed && (
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transform transition-transform ${
                      expanded.customers ? "rotate-180" : ""
                    }`}
                  />
                )}
                {collapsed && (
                  <div className="absolute left-16 hidden group-hover:block bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                    Users
                  </div>
                )}
              </button>

              {expanded.customers && !collapsed && (
                <div className="pl-9 pr-2 py-1">
                  <NavLink
                    to="/all-users"
                    className={({ isActive }) =>
                      `block py-2 px-2 text-sm rounded-md ${
                        isActive
                          ? "text-white bg-[#1d1c5e]"
                          : "text-gray-400 hover:text-white hover:bg-[#1d1c5e]"
                      }`
                    }
                  >
                    All Users
                  </NavLink>
                  <NavLink
                    to="/approvals"
                    className={({ isActive }) =>
                      `block py-2 px-2 text-sm rounded-md relative ${
                        isActive
                          ? "text-white bg-[#1d1c5e]"
                          : "text-gray-400 hover:text-white hover:bg-[#1d1c5e]"
                      }`
                    }
                  >
                    <span>Pending Approvals</span>
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </NavLink>
                </div>
              )}
            </div>

            {/* Analytics */}
            <div className="mb-1 group">
              <NavLink
                to="/analytics"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md transition-colors ${
                    isActive ? activeClassName : inactiveClassName
                  }`
                }
              >
                <BarChart2 size={20} className="min-w-5" />
                {!collapsed && <span className="ml-3">Analytics</span>}
                {collapsed && (
                  <div className="absolute left-16 hidden group-hover:block bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                    Analytics
                  </div>
                )}
              </NavLink>
            </div>

            {/* Payments */}
            <div className="mb-1 group">
              <NavLink
                to="/payments"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md transition-colors ${
                    isActive ? activeClassName : inactiveClassName
                  }`
                }
              >
                <DollarSign size={20} className="min-w-5" />
                {!collapsed && <span className="ml-3">Payments</span>}
                {collapsed && (
                  <div className="absolute left-16 hidden group-hover:block bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                    Payments
                  </div>
                )}
              </NavLink>
            </div>

            {/* Shipping */}
            <div className="mb-1 group">
              <NavLink
                to="/shipping"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md transition-colors ${
                    isActive ? activeClassName : inactiveClassName
                  }`
                }
              >
                <Truck size={20} className="min-w-5" />
                {!collapsed && <span className="ml-3">Shipping</span>}
                {collapsed && (
                  <div className="absolute left-16 hidden group-hover:block bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                    Shipping
                  </div>
                )}
              </NavLink>
            </div>
          </nav>
        </div>

        {/* Settings and Help */}
        <div className="mt-auto border-t border-[#1d1c5e] pt-2">
          <nav className="px-2">
            <div className="mb-1 group">
              <NavLink
                to="/setting"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md transition-colors ${
                    isActive ? activeClassName : inactiveClassName
                  }`
                }
              >
                <Settings size={20} className="min-w-5" />
                {!collapsed && <span className="ml-3">Settings</span>}
                {collapsed && (
                  <div className="absolute left-16 hidden group-hover:block bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                    Settings
                  </div>
                )}
              </NavLink>
            </div>

            <div className="mb-1 group">
              <NavLink
                to="/help-center"
                className={({ isActive }) =>
                  `flex items-center px-3 py-3 rounded-md transition-colors ${
                    isActive ? activeClassName : inactiveClassName
                  }`
                }
              >
                <HelpCircle size={20} className="min-w-5" />
                {!collapsed && <span className="ml-3">Help Center</span>}
                {collapsed && (
                  <div className="absolute left-16 hidden group-hover:block bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                    Help Center
                  </div>
                )}
              </NavLink>
            </div>
          </nav>

          {/* User info and Logout */}
          <div className="px-4 py-4 border-t border-[#1d1c5e] mt-2">
            <div className="flex items-center justify-between">
              {!collapsed && (
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium text-sm">
                    {(admin?.fullName || admin?.name)?.charAt(0) || "A"}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-white">
                      {admin?.fullName || admin?.name || "Admin"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {admin?.email || "admin@cotchel.com"}
                    </div>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="group flex items-center justify-center p-2 rounded-md transition-colors text-gray-300 hover:bg-[#1d1c5e] hover:text-white"
              >
                <LogOut size={20} />
                <div className="absolute left-16 hidden group-hover:block bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                  Logout
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
