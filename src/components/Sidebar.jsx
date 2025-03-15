import React, { useState } from "react";
import {
  Home,
  ShoppingBag,
  Package,
  Users,
  BarChart2,
  Settings,
  Tag,
  HelpCircle,
  ChevronDown,
  LogOut,
  Menu,
  Grid,
  Truck,
  DollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState({
    products: false,
    orders: false,
    customers: false,
  });

  const toggleExpand = (section) => {
    setExpanded({
      ...expanded,
      [section]: !expanded[section],
    });
  };

  return (
    <div className="flex h-screen ">
      {/* Sidebar */}
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
              <Link
                to="/"
                className="flex items-center px-3 py-2 text-gray-300 hover:bg-[#1d1c5e] rounded-md transition-colors"
              >
                <Home size={20} className="text-gray-300 min-w-5" />
                {!collapsed && <span className="ml-3">Dashboard</span>}
                {collapsed && (
                  <div className="absolute left-16 hidden group-hover:block bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                    Dashboard
                  </div>
                )}
              </Link>
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
                  <Link
                    to="/all-products"
                    className="block py-2 px-2 text-sm text-gray-400 hover:text-white hover:bg-[#1d1c5e] rounded-md"
                  >
                    All Products
                  </Link>
                  <Link
                    to="/add-product"
                    className="block py-2 px-2 text-sm text-gray-400 hover:text-white hover:bg-[#1d1c5e] rounded-md"
                  >
                    Add New
                  </Link>
                  <Link className="block py-2 px-2 text-sm text-gray-400 hover:text-white hover:bg-[#1d1c5e] rounded-md">
                    Categories
                  </Link>
                  <Link className="block py-2 px-2 text-sm text-gray-400 hover:text-white hover:bg-[#1d1c5e] rounded-md">
                    Inventory
                  </Link>
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
                <div className="flex items-center">
                  {!collapsed && (
                    <>
                      {/* <span className="inline-flex items-center justify-center h-5 min-w-5 px-1 text-xs font-medium bg-red-500 text-white rounded-full mr-2">
                        8
                      </span> */}
                      <ChevronDown
                        size={16}
                        className={`text-gray-400 transform transition-transform ${
                          expanded.orders ? "rotate-180" : ""
                        }`}
                      />
                    </>
                  )}
                  {collapsed && (
                    <span className="absolute top-0 right-1 inline-flex items-center justify-center h-4 w-4 text-xs font-medium bg-red-500 text-white rounded-full">
                      8
                    </span>
                  )}
                </div>
                {collapsed && (
                  <div className="absolute left-16 hidden group-hover:block bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                    Orders
                  </div>
                )}
              </button>

              {expanded.orders && !collapsed && (
                <div className="pl-9 pr-2 py-1">
                  <Link className="block py-2 px-2 text-sm text-gray-400 hover:text-white hover:bg-[#1d1c5e] rounded-md">
                    All Orders
                  </Link>
                  <Link className="block py-2 px-2 text-sm text-gray-400 hover:text-white hover:bg-[#1d1c5e] rounded-md">
                    Pending
                  </Link>
                  <Link className="block py-2 px-2 text-sm text-gray-400 hover:text-white hover:bg-[#1d1c5e] rounded-md">
                    Processing
                  </Link>
                  <Link className="block py-2 px-2 text-sm text-gray-400 hover:text-white hover:bg-[#1d1c5e] rounded-md">
                    Completed
                  </Link>
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
                  {!collapsed && <span className="ml-3">Customers</span>}
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
                    Customers
                  </div>
                )}
              </button>

              {expanded.customers && !collapsed && (
                <div className="pl-9 pr-2 py-1">
                  <Link className="block py-2 px-2 text-sm text-gray-400 hover:text-white hover:bg-[#1d1c5e] rounded-md">
                    All Customers
                  </Link>
                  <Link className="block py-2 px-2 text-sm text-gray-400 hover:text-white hover:bg-[#1d1c5e] rounded-md">
                    Segments
                  </Link>
                  <Link className="block py-2 px-2 text-sm text-gray-400 hover:text-white hover:bg-[#1d1c5e] rounded-md">
                    Reviews
                  </Link>
                </div>
              )}
            </div>

            {/* Marketing */}
            {/* <div className="mb-1 group">
              <Link className="flex items-center px-3 py-2 text-gray-300 hover:bg-[#1d1c5e] rounded-md transition-colors">
                <Tag size={20} className="text-gray-300 min-w-5" />
                {!collapsed && <span className="ml-3">Marketing</span>}
                {collapsed && (
                  <div className="absolute left-16 hidden group-hover:block bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                    Marketing
                  </div>
                )}
              </Link>
            </div> */}

            {/* Analytics */}
            <div className="mb-1 group">
              <Link
                to="/analytics"
                className="flex items-center px-3 py-2 text-gray-300 hover:bg-[#1d1c5e] rounded-md transition-colors"
              >
                <BarChart2 size={20} className="text-gray-300 min-w-5" />
                {!collapsed && <span className="ml-3">Analytics</span>}
                {collapsed && (
                  <div className="absolute left-16 hidden group-hover:block bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                    Analytics
                  </div>
                )}
              </Link>
            </div>

            {/* Payments */}
            <div className="mb-1 group">
              <Link className="flex items-center px-3 py-2 text-gray-300 hover:bg-[#1d1c5e] rounded-md transition-colors">
                <DollarSign size={20} className="text-gray-300 min-w-5" />
                {!collapsed && <span className="ml-3">Payments</span>}
                {collapsed && (
                  <div className="absolute left-16 hidden group-hover:block bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                    Payments
                  </div>
                )}
              </Link>
            </div>

            {/* Shipping */}
            <div className="mb-1 group">
              <Link className="flex items-center px-3 py-2 text-gray-300 hover:bg-[#1d1c5e] rounded-md transition-colors">
                <Truck size={20} className="text-gray-300 min-w-5" />
                {!collapsed && <span className="ml-3">Shipping</span>}
                {collapsed && (
                  <div className="absolute left-16 hidden group-hover:block bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                    Shipping
                  </div>
                )}
              </Link>
            </div>

            {/* Apps */}
            {/* <div className="mb-1 group">
              <Link className="flex items-center px-3 py-2 text-gray-300 hover:bg-[#1d1c5e] rounded-md transition-colors">
                <Grid size={20} className="text-gray-300 min-w-5" />
                {!collapsed && <span className="ml-3">Apps</span>}
                {collapsed && (
                  <div className="absolute left-16 hidden group-hover:block bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                    Apps
                  </div>
                )}
              </Link>
            </div> */}
          </nav>
        </div>

        {/* Settings and Help */}
        <div className="mt-auto border-t border-[#1d1c5e] pt-2">
          <nav className="px-2">
            <div className="mb-1 group">
              <Link
                to="/setting"
                className="flex items-center px-3 py-2 text-gray-300 hover:bg-[#1d1c5e] rounded-md transition-colors"
              >
                <Settings size={20} className="text-gray-300 min-w-5" />
                {!collapsed && <span className="ml-3">Settings</span>}
                {collapsed && (
                  <div className="absolute left-16 hidden group-hover:block bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                    Settings
                  </div>
                )}
              </Link>
            </div>

            <div className="mb-1 group">
              <Link
                to="/help-center"
                className="flex items-center px-3 py-3 text-gray-300 hover:bg-[#1d1c5e] rounded-md transition-colors"
              >
                <HelpCircle size={20} className="text-gray-300 min-w-5" />
                {!collapsed && <span className="ml-3">Help Center</span>}
                {collapsed && (
                  <div className="absolute left-16 hidden group-hover:block bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                    Help Center
                  </div>
                )}
              </Link>
            </div>
          </nav>

          {/* User info */}
          {!collapsed && (
            <div className="px-4 py-4 border-t border-[#1d1c5e] mt-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium text-sm">
                  SU
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-white">
                    Store User
                  </div>
                  <div className="text-xs text-gray-400">admin@store.com</div>
                </div>
                <div className="ml-auto">
                  <button className="text-gray-400 hover:text-white">
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {collapsed && (
            <div className="py-4 flex justify-center border-t border-[#1d1c5e] mt-2 group">
              <button className="text-gray-400 hover:text-white">
                <LogOut size={20} />
                <div className="absolute left-16 hidden group-hover:block bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                  Logout
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
