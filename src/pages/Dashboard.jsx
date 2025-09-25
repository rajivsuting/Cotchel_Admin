import React, { useState } from "react";
import {
  Bell,
  Search,
  User,
  ShoppingBag,
  TrendingUp,
  Box,
  Users,
  ArrowUp,
  ArrowDown,
  CreditCard,
  Package,
  Truck,
  CheckCircle,
  Menu,
  Star,
  AlertTriangle,
  Shirt,
  Watch,
  Footprints,
  CircuitBoard,
  Cpu,
  Monitor,
  BarChart3,
} from "lucide-react";
import useDashboard from "../hooks/useDashboard";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { dashboardData, loading, error } = useDashboard();
  const { admin } = useAuth();
  const navigate = useNavigate();

  console.log("Current admin state:", admin); // Debug log

  // Theme color - dark navy (#0c0b45)
  const themeColor = "#0c0b45";
  const themeLighter = "#1c1a7a";
  const themeLight = "#e8e8f0";

  const handleViewProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0c0b45]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Error Loading Dashboard</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const { stats, orderStatus, recentOrders, topProducts } = dashboardData;

  // Order status counts for visualization
  const totalOrders = orderStatus.reduce(
    (sum, status) => sum + status.count,
    0
  );

  // Calculate total sales from top products
  const totalTopProductsSales = topProducts.reduce(
    (sum, product) => sum + product.sold,
    0
  );

  // Get the display name for the welcome message
  const displayName = admin?.fullName || admin?.name || "Admin";

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header
        style={{ backgroundColor: themeColor }}
        className="text-white shadow-lg sticky top-0 z-30"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <span className="ml-2 text-xs bg-white text-indigo-900 px-2 py-1 rounded-full font-semibold">
                ADMIN
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-white/10 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Welcome Banner */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="md:flex">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Welcome back, {displayName}!
              </h2>
              <p className="mt-2 text-gray-600">
                Here's what's happening with your platform today.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="flex flex-col h-full">
                <div
                  style={{ backgroundColor: themeColor }}
                  className="px-6 py-3"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-white text-sm font-medium">
                      {stat.title}
                    </p>
                    {getStatIcon(stat.title)}
                  </div>
                </div>
                <div className="px-6 py-4">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </h3>
                  {stat.change && (
                    <div className="mt-2 flex items-center">
                      <span
                        className={`text-sm font-medium flex items-center ${
                          stat.positive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {stat.positive ? (
                          <ArrowUp size={14} />
                        ) : (
                          <ArrowDown size={14} />
                        )}
                        <span className="ml-1">{stat.change}</span>
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        vs last week
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Order Status */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span
                style={{ backgroundColor: themeLight }}
                className="p-1 rounded-md mr-2"
              >
                <ShoppingBag size={18} style={{ color: themeColor }} />
              </span>
              Order Status
            </h3>
            <div className="space-y-4">
              {orderStatus.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {item.status}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {item.count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${item.color}`}
                      style={{ width: `${(item.count / totalOrders) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Total Orders: {totalOrders}
              </p>
              <button
                onClick={() => navigate("/all-orders")}
                style={{ color: themeColor }}
                className="mt-3 hover:underline text-sm font-medium"
              >
                View Details →
              </button>
            </div>
          </div>

          {/* Popular Categories */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span
                style={{ backgroundColor: themeLight }}
                className="p-1 rounded-md mr-2"
              >
                <TrendingUp size={18} style={{ color: themeColor }} />
              </span>
              Popular Categories
            </h3>
            <div className="space-y-4">
              {dashboardData?.categoryStats?.length > 0 ? (
                dashboardData.categoryStats.map((category, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-3 p-3 ${
                      index === 0
                        ? "bg-blue-50"
                        : index === 1
                        ? "bg-purple-50"
                        : "bg-green-50"
                    } rounded-lg`}
                  >
                    <div className="flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full ${
                          index === 0
                            ? "bg-blue-100"
                            : index === 1
                            ? "bg-purple-100"
                            : "bg-green-100"
                        } flex items-center justify-center`}
                      >
                        {index === 0 ? (
                          <Monitor size={16} className="text-blue-600" />
                        ) : index === 1 ? (
                          <Cpu size={16} className="text-purple-600" />
                        ) : (
                          <CircuitBoard size={16} className="text-green-600" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-800">
                          {category.name}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Sales</p>
                          <p className="text-lg font-semibold text-gray-800">
                            {category.totalSales}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Orders</p>
                          <p className="text-lg font-semibold text-gray-800">
                            {category.orderCount}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No category data available
                </div>
              )}
            </div>
            <button
              onClick={() => navigate("/categories")}
              style={{ color: themeColor }}
              className="mt-4 text-sm font-medium hover:underline"
            >
              View all categories →
            </button>
          </div>

          {/* Top Selling Categories */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span
                style={{ backgroundColor: themeLight }}
                className="p-1 rounded-md mr-2"
              >
                <BarChart3 size={18} style={{ color: themeColor }} />
              </span>
              Top Selling Products
            </h3>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <CategoryItem
                  key={index}
                  name={product.name}
                  percentage={
                    totalTopProductsSales > 0
                      ? (product.sold / totalTopProductsSales) * 100
                      : 0
                  }
                  color={`bg-${themeColor}`}
                  themeColor={themeColor}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div
            style={{ borderBottomColor: themeLight }}
            className="p-6 border-b"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <span
                  style={{ backgroundColor: themeLight }}
                  className="p-1 rounded-md mr-2"
                >
                  <ShoppingBag size={18} style={{ color: themeColor }} />
                </span>
                Recent Orders
              </h3>
              <span
                style={{ backgroundColor: themeLight, color: themeColor }}
                className="text-xs font-semibold px-2 py-1 rounded-full"
              >
                {recentOrders.length} new orders
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: themeLight }}>
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: themeColor }}
                  >
                    Order
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: themeColor }}
                  >
                    Product
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: themeColor }}
                  >
                    Customer
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: themeColor }}
                  >
                    Date
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: themeColor }}
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: themeColor }}
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                      style={{ color: themeColor }}
                    >
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={order.image}
                          alt={order.product}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                        <span className="ml-2 text-sm text-gray-800">
                          {order.product}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full
                        ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "Shipped"
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {order.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => navigate("/all-orders")}
              style={{ color: themeColor }}
              className="text-sm font-medium hover:underline"
            >
              View all orders →
            </button>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div
            style={{ borderBottomColor: themeLight }}
            className="p-6 border-b"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <span
                  style={{ backgroundColor: themeLight }}
                  className="p-1 rounded-md mr-2"
                >
                  <Box size={18} style={{ color: themeColor }} />
                </span>
                Top Selling Products
              </h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: themeLight }}>
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: themeColor }}
                  >
                    Product
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: themeColor }}
                  >
                    Sold
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: themeColor }}
                  >
                    Revenue
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: themeColor }}
                  >
                    Stock
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: themeColor }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topProducts.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-800">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {product.sold} units
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {product.revenue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full
                        ${
                          product.stock > 40
                            ? "bg-green-100 text-green-800"
                            : product.stock > 20
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleViewProduct(product.id)}
                        style={{ color: themeColor }}
                        className="hover:underline font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => navigate("/all-products")}
              style={{ color: themeColor }}
              className="text-sm font-medium hover:underline"
            >
              View all products →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper function to get stat icon
function getStatIcon(title) {
  switch (title) {
    case "Total Sales":
      return <CreditCard size={20} className="text-white" />;
    case "Total Customers":
      return <Users size={20} className="text-white" />;
    case "Total Orders":
      return <ShoppingBag size={20} className="text-white" />;
    case "Total Products":
      return <Package size={20} className="text-white" />;
    default:
      return null;
  }
}

// Component for fulfillment status cards
const FulfillmentCard = ({ title, count, icon, color }) => {
  return (
    <div className="rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className={`inline-flex p-3 rounded-lg ${color}`}>{icon}</div>
      <h4 className="mt-3 text-gray-800 font-medium">{title}</h4>
      <p className="text-2xl font-bold text-gray-800 mt-1">{count}</p>
    </div>
  );
};

// Component for category items
const CategoryItem = ({ name, percentage, color, themeColor }) => {
  // Ensure percentage is a valid number and not infinity
  const safePercentage = isFinite(percentage)
    ? Math.min(Math.round(percentage), 100)
    : 0;

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{name}</span>
        <span className="text-sm font-medium text-gray-700">
          {safePercentage}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full`}
          style={{
            width: `${safePercentage}%`,
            backgroundColor: themeColor || color,
          }}
        ></div>
      </div>
    </div>
  );
};

export default Dashboard;
