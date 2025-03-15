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
} from "lucide-react";

const Dashboard = () => {
  // Sample data for stats
  const stats = [
    {
      title: "Total Sales",
      value: "₹24,780",
      change: "+12.5%",
      positive: true,
      icon: <CreditCard size={20} className="text-white" />,
    },
    {
      title: "New Customers",
      value: "573",
      change: "+8.2%",
      positive: true,
      icon: <Users size={20} className="text-white" />,
    },
    {
      title: "Total Orders",
      value: "1,258",
      change: "+14.6%",
      positive: true,
      icon: <ShoppingBag size={20} className="text-white" />,
    },
    {
      title: "Product Visits",
      value: "9,254",
      change: "+22.1%",
      positive: true,
      icon: <TrendingUp size={20} className="text-white" />,
    },
  ];

  // Sample data for recent orders
  const recentOrders = [
    {
      id: "#ORD-7352",
      customer: "Priya Sharma",
      date: "Mar 8, 2025",
      status: "Delivered",
      amount: "₹1,250",
      product: "Premium Sneakers",
      image:
        "https://cotchel-images.s3.ap-south-1.amazonaws.com/products/2c10f45b-f376-4104-a8a7-0caa38a746c6_phone.jpeg",
    },
    {
      id: "#ORD-7351",
      customer: "Rahul Patel",
      date: "Mar 7, 2025",
      status: "Processing",
      amount: "₹2,459",
      product: "Wireless Headphones",
      image:
        "https://cotchel-images.s3.ap-south-1.amazonaws.com/products/2c10f45b-f376-4104-a8a7-0caa38a746c6_phone.jpeg",
    },
    {
      id: "#ORD-7350",
      customer: "Ananya Singh",
      date: "Mar 7, 2025",
      status: "Shipped",
      amount: "₹895",
      product: "Designer Watch",
      image:
        "https://cotchel-images.s3.ap-south-1.amazonaws.com/products/2c10f45b-f376-4104-a8a7-0caa38a746c6_phone.jpeg",
    },
    {
      id: "#ORD-7349",
      customer: "Vikram Malhotra",
      date: "Mar 6, 2025",
      status: "Pending",
      amount: "₹3,522",
      product: "Smartphone",
      image:
        "https://cotchel-images.s3.ap-south-1.amazonaws.com/products/2c10f45b-f376-4104-a8a7-0caa38a746c6_phone.jpeg",
    },
  ];

  // Sample data for top selling products
  const topProducts = [
    {
      name: "Premium Wireless Earbuds",
      sold: 245,
      revenue: "₹73,500",
      stock: 54,
      image:
        "https://cotchel-images.s3.ap-south-1.amazonaws.com/products/2c10f45b-f376-4104-a8a7-0caa38a746c6_phone.jpeg",
    },
    {
      name: 'Ultra HD Smart TV (55")',
      sold: 132,
      revenue: "₹396,000",
      stock: 23,
      image:
        "https://cotchel-images.s3.ap-south-1.amazonaws.com/products/2c10f45b-f376-4104-a8a7-0caa38a746c6_phone.jpeg",
    },
    {
      name: "Designer Leather Handbag",
      sold: 189,
      revenue: "₹94,500",
      stock: 42,
      image:
        "https://cotchel-images.s3.ap-south-1.amazonaws.com/products/2c10f45b-f376-4104-a8a7-0caa38a746c6_phone.jpeg",
    },
    {
      name: "Professional Camera Kit",
      sold: 87,
      revenue: "₹348,000",
      stock: 15,
      image:
        "https://cotchel-images.s3.ap-south-1.amazonaws.com/products/2c10f45b-f376-4104-a8a7-0caa38a746c6_phone.jpeg",
    },
  ];

  // Order status counts for visualization
  const orderStatus = [
    { status: "Pending", count: 24, color: "bg-yellow-500" },
    { status: "Processing", count: 38, color: "bg-blue-500" },
    { status: "Shipped", count: 53, color: "bg-indigo-500" },
    { status: "Delivered", count: 187, color: "bg-green-500" },
    { status: "Cancelled", count: 12, color: "bg-red-500" },
  ];

  // Theme color - dark navy (#0c0b45)
  const themeColor = "#0c0b45";
  const themeLighter = "#1c1a7a";
  const themeLight = "#e8e8f0";

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
              {/* <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search products, orders, customers..."
                  className="bg-white/20 text-white placeholder-white/70 border border-white/30 rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <Search
                  size={18}
                  className="absolute left-3 top-2.5 text-white/70"
                />
              </div> */}

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
                Welcome back, Admin!
              </h2>
              <p className="mt-2 text-gray-600">
                Here's what's happening with your platform today.
              </p>
              {/* <button
                style={{ backgroundColor: themeColor }}
                className="mt-4 hover:bg-opacity-90 text-white px-4 py-2 rounded-lg shadow-md transition duration-200"
              >
                View Reports
              </button> */}
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
                    {stat.icon}
                  </div>
                </div>
                <div className="px-6 py-4">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </h3>
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
                      style={{ width: `${(item.count / 314) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">Total Orders: 314</p>
              <button
                style={{ color: themeColor }}
                className="mt-3 hover:underline text-sm font-medium"
              >
                View Details →
              </button>
            </div>
          </div>

          {/* Fulfillment Status */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span
                style={{ backgroundColor: themeLight }}
                className="p-1 rounded-md mr-2"
              >
                <Truck size={18} style={{ color: themeColor }} />
              </span>
              Fulfillment Status
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FulfillmentCard
                title="Ready to Ship"
                count="18"
                icon={<Package size={24} className="text-amber-500" />}
                color="bg-amber-100 text-amber-800"
              />
              <FulfillmentCard
                title="In Transit"
                count="32"
                icon={<Truck size={24} className="text-blue-500" />}
                color="bg-blue-100 text-blue-800"
              />
              <FulfillmentCard
                title="Delivered Today"
                count="24"
                icon={<CheckCircle size={24} className="text-green-500" />}
                color="bg-green-100 text-green-800"
              />
              <FulfillmentCard
                title="Returns"
                count="7"
                icon={<Box size={24} className="text-red-500" />}
                color="bg-red-100 text-red-800"
              />
            </div>
            <button
              style={{ backgroundColor: themeColor }}
              className="mt-6 w-full py-2 text-white rounded-lg text-sm font-medium transition duration-200 hover:bg-opacity-90"
            >
              Process Orders
            </button>
          </div>

          {/* Top Selling Categories */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span
                style={{ backgroundColor: themeLight }}
                className="p-1 rounded-md mr-2"
              >
                <Chart size={18} style={{ color: themeColor }} />
              </span>
              Top Selling Categories
            </h3>
            <div className="space-y-4">
              <CategoryItem
                name="Microprocessors"
                percentage={38}
                color={`bg-${themeColor}`}
                themeColor={themeColor}
              />
              <CategoryItem
                name="Chip"
                percentage={25}
                color={`bg-${themeLighter}`}
                themeColor={themeLighter}
              />
              <CategoryItem
                name="Graphic Card"
                percentage={18}
                color="bg-blue-500"
              />
              <CategoryItem
                name="Transistor"
                percentage={12}
                color="bg-pink-500"
              />
              <CategoryItem name="Others" percentage={7} color="bg-gray-500" />
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
                24 new orders today
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
              <select
                style={{ borderColor: themeLight, color: themeColor }}
                className="text-sm border rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2"
              >
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
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
                        style={{ color: themeColor }}
                        className="hover:underline font-medium"
                      >
                        View
                      </button>
                      <span className="mx-2 text-gray-300">|</span>
                      <button
                        style={{ color: themeColor }}
                        className="hover:underline font-medium"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
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
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{name}</span>
        <span className="text-sm font-medium text-gray-700">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full`}
          style={{
            width: `${percentage}%`,
            backgroundColor: themeColor || color,
          }}
        ></div>
      </div>
    </div>
  );
};

// Custom chart icon
const Chart = ({ size, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="8" width="4" height="12" rx="1" />
      <rect x="10" y="4" width="4" height="16" rx="1" />
      <rect x="17" y="12" width="4" height="8" rx="1" />
    </svg>
  );
};

export default Dashboard;
