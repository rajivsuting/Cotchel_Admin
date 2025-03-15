import React, { useState, useEffect } from "react";
import {
  AreaChart,
  LineChart,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  Line,
  Bar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Bell,
  Settings,
  User,
  ChevronDown,
  ShoppingCart,
  Users,
  DollarSign,
  Filter,
  Calendar,
  ArrowUpRight,
  ShoppingBag,
  Clock,
  AlertCircle,
  Download,
  Zap,
  Package,
  CreditCard,
} from "lucide-react";

// Static data moved outside component to prevent recreation on re-renders
const revenueData = [
  { name: "Jan", value: 12000 },
  { name: "Feb", value: 19000 },
  { name: "Mar", value: 15000 },
  { name: "Apr", value: 21000 },
  { name: "May", value: 26000 },
  { name: "Jun", value: 25000 },
  { name: "Jul", value: 30000 },
  { name: "Aug", value: 15000 },
  { name: "Sep", value: 21000 },
  { name: "Oct", value: 26000 },
  { name: "Nov", value: 25000 },
  { name: "Dec", value: 30000 },
];

const topSellers = [
  {
    id: 1,
    name: "Tech Galaxy",
    sales: 156,
    revenue: "$32,450",
    growth: 12.4,
  },
  {
    id: 2,
    name: "Fashion Forward",
    sales: 132,
    revenue: "$28,900",
    growth: 8.7,
  },
  {
    id: 3,
    name: "Home Essentials",
    sales: 97,
    revenue: "$19,600",
    growth: 15.2,
  },
  {
    id: 4,
    name: "Beauty Box",
    sales: 89,
    revenue: "$15,750",
    growth: -2.1,
  },
  {
    id: 5,
    name: "Gadget Hub",
    sales: 76,
    revenue: "$14,980",
    growth: 5.8,
  },
];

const userGrowthData = [
  { name: "Jan", buyers: 1200, sellers: 150 },
  { name: "Feb", buyers: 1350, sellers: 180 },
  { name: "Mar", buyers: 1500, sellers: 220 },
  { name: "Apr", buyers: 1750, sellers: 250 },
  { name: "May", buyers: 2100, sellers: 2320 },
  { name: "Jun", buyers: 2400, sellers: 350 },
  { name: "Jul", buyers: 2800, sellers: 390 },
  { name: "Aug", buyers: 1500, sellers: 220 },
  { name: "Sep", buyers: 1750, sellers: 250 },
  { name: "Oct", buyers: 2100, sellers: 320 },
  { name: "Nov", buyers: 2400, sellers: 350 },
  { name: "Dec", buyers: 2800, sellers: 390 },
];

const periodOptions = [
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "year", label: "Year" },
];
const platformHealth = [
  { status: "Operational", value: 99.9 },
  { status: "Downtime", value: 0.1 },
];

const recentActivities = [
  {
    id: 1,
    type: "order",
    user: "John Doe",
    amount: "$249",
    timestamp: "2m ago",
  },
  {
    id: 2,
    type: "refund",
    user: "Jane Smith",
    amount: "$99",
    timestamp: "15m ago",
  },
  { id: 3, type: "registration", user: "New Seller", timestamp: "30m ago" },
  {
    id: 4,
    type: "withdrawal",
    user: "Fashion Store",
    amount: "$2,500",
    timestamp: "1h ago",
  },
];

const COLORS = ["#0c0b45", "#6366F1", "#10B981", "#F59E0B"];

const SummaryCard = ({
  title,
  value,
  icon: Icon,
  color,
  percentage,
  onClick,
}) => (
  <div
    className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
    onClick={onClick}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="mt-1 text-2xl font-semibold text-gray-900">{value}</h3>
      </div>
      <div className={`p-2 ${color.bg} rounded-md`}>
        <Icon className={`w-6 h-6 ${color.text}`} />
      </div>
    </div>
    <div className="mt-4 flex items-center">
      <ArrowUpRight className="w-4 h-4 text-green-500" />
      <span className="text-sm font-medium text-green-500 ml-1">
        {percentage}%
      </span>
      <span className="text-sm text-gray-500 ml-2">from last month</span>
    </div>
  </div>
);
// const SummaryCard = ({ title, value, icon: Icon, color, percentage }) => (
//   <div className="bg-white rounded-lg shadow p-6">

//   </div>
// );

const Analytics = () => {
  const [activePeriod, setActivePeriod] = useState("month");
  const [realTimeStats, setRealTimeStats] = useState({
    activeUsers: 142,
    pendingOrders: 23,
    openTickets: 5,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeStats((prev) => ({
        activeUsers: Math.floor(Math.random() * 200) + 50,
        pendingOrders: Math.floor(Math.random() * 30),
        openTickets: Math.floor(Math.random() * 10),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <nav className="px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <div className="flex items-center">
            <ShoppingBag
              className="w-8 h-8 text-[#0c0b45]"
              aria-hidden="true"
            />
            <h1 className="ml-2 text-xl font-bold text-gray-900">Analytics</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="p-1 rounded-full text-gray-400 hover:text-gray-500"
              aria-label="Notifications"
            >
              <Bell className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h2>
          <div className="flex flex-wrap gap-2">
            {periodOptions.map((option) => (
              <button
                key={option.id}
                className={`px-4 py-2 text-sm font-medium cursor-pointer rounded-md transition-colors ${
                  activePeriod === option.id
                    ? "bg-[#0c0b45] text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setActivePeriod(option.id)}
              >
                {option.label}
              </button>
            ))}
            {/* <button className="flex items-center px-4 py-2 text-sm font-medium bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
              Custom
              <ChevronDown className="ml-2 w-4 h-4" aria-hidden="true" />
            </button> */}
          </div>
        </div>

        {/* Real-Time Status Bar */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <Zap className="w-6 h-6 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-xl font-semibold">
                {realTimeStats.activeUsers}
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <Package className="w-6 h-6 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-xl font-semibold">
                {realTimeStats.pendingOrders}
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Open Tickets</p>
              <p className="text-xl font-semibold">
                {realTimeStats.openTickets}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title="Total Revenue"
            value="$148,950"
            icon={DollarSign}
            color={{ bg: "bg-green-100", text: "text-green-600" }}
            percentage={12.5}
          />
          <SummaryCard
            title="Total Transactions"
            value="2,450"
            icon={ShoppingCart}
            color={{ bg: "bg-blue-100", text: "text-blue-600" }}
            percentage={8.2}
          />
          <SummaryCard
            title="Active Sellers"
            value="390"
            icon={Users}
            color={{ bg: "bg-purple-100", text: "text-purple-600" }}
            percentage={11.4}
          />
          <SummaryCard
            title="Active Buyers"
            value="2,800"
            icon={User}
            color={{ bg: "bg-yellow-100", text: "text-yellow-600" }}
            percentage={16.8}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Revenue Overview
              </h3>
              <button className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors">
                <Filter className="w-4 h-4 mr-1" aria-hidden="true" />
                Filter
              </button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#6366F1"
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Growth Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">User Growth</h3>
              <button className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors">
                <Filter className="w-4 h-4 mr-1" aria-hidden="true" />
                Filter
              </button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="buyers"
                    stroke="#6366F1"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="sellers"
                    stroke="#10B981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-4 flex-wrap">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-indigo-600 mr-2" />
                <span className="text-sm text-gray-600">Buyers</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                <span className="text-sm text-gray-600">Sellers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Recent Activities
              </h3>
              <button className="text-sm text-[#0c0b45] hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded"
                >
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-sm">{activity.type}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {activity.amount && (
                      <span className="mr-2">{activity.amount}</span>
                    )}
                    {activity.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Sellers */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Top Performing Sellers
              </h3>
              <button className="text-sm text-[#0c0b45] hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {topSellers.map((seller) => (
                <div
                  key={seller.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[#0c0b45]/10 flex items-center justify-center mr-3">
                      <User className="w-4 h-4 text-[#0c0b45]" />
                    </div>
                    <span className="text-sm">{seller.name}</span>
                  </div>
                  <div className="text-sm font-medium text-[#0c0b45]">
                    {seller.revenue}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-sm text-gray-500 mb-1">Avg. Order Value</p>
            <p className="text-xl font-semibold">$89.50</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-sm text-gray-500 mb-1">Conversion Rate</p>
            <p className="text-xl font-semibold">3.2%</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-sm text-gray-500 mb-1">Return Rate</p>
            <p className="text-xl font-semibold">1.8%</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-sm text-gray-500 mb-1">Inventory Turnover</p>
            <p className="text-xl font-semibold">4.2x</p>
          </div>
        </div>

        {/* Data Export */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Data Export</h3>
              <p className="text-sm text-gray-500">
                Export analytics data for further analysis
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center px-4 py-2 bg-[#0c0b45] text-white rounded-md hover:bg-[#0c0b45]/90">
                <Download className="w-4 h-4 mr-2" />
                CSV
              </button>
              <button className="flex items-center px-4 py-2 bg-[#0c0b45] text-white rounded-md hover:bg-[#0c0b45]/90">
                <Download className="w-4 h-4 mr-2" />
                PDF
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
