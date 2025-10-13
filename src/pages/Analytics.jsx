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
import axios from "axios";

const API_BASE_URL = "https://starfish-app-6q6ot.ondigitalocean.app/api";

// Static data moved outside component to prevent recreation on re-renders
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
  activePeriod,
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
      <ArrowUpRight
        className={`w-4 h-4 ${
          percentage >= 0 ? "text-green-500" : "text-red-500"
        }`}
      />
      <span
        className={`text-sm font-medium ml-1 ${
          percentage >= 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        {percentage >= 0 ? "+" : ""}
        {percentage.toFixed(1)}%
      </span>
      <span className="text-sm text-gray-500 ml-2">
        from last{" "}
        {activePeriod === "week"
          ? "week"
          : activePeriod === "month"
          ? "month"
          : "year"}
      </span>
    </div>
  </div>
);

const Analytics = () => {
  const [activePeriod, setActivePeriod] = useState("month");
  const [revenueData, setRevenueData] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [realTimeStats, setRealTimeStats] = useState({
    activeUsers: 0,
    activeProducts: 0,
    openTickets: 0,
  });
  const [summaryStats, setSummaryStats] = useState({
    totalRevenue: { value: 0, percentage: 0 },
    activeSellers: { value: 0, percentage: 0 },
    activeBuyers: { value: 0, percentage: 0 },
  });
  const [topSellers, setTopSellers] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all dashboard data at once
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both dashboard and stats data in parallel
        const [dashboardResponse, statsResponse] = await Promise.all([
          axios.get(
            `${API_BASE_URL}/analytics/dashboard?period=${activePeriod}`
          ),
          axios.get(`${API_BASE_URL}/analytics/real-time-stats`),
        ]);

        const {
          revenueData,
          userGrowthData,
          summaryStats,
          topSellers,
          recentActivities,
        } = dashboardResponse.data;

        setRevenueData(revenueData || []);
        setUserGrowthData(userGrowthData || []);
        setSummaryStats(
          summaryStats || {
            totalRevenue: { value: 0, percentage: 0 },
            activeSellers: { value: 0, percentage: 0 },
            activeBuyers: { value: 0, percentage: 0 },
          }
        );
        setTopSellers(topSellers || []);
        setRecentActivities(recentActivities || []);
        setRealTimeStats(statsResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [activePeriod]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0c0b45] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">
            Error loading dashboard
          </div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#0c0b45] text-white rounded-md hover:bg-[#0c0b45]/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
              onClick={() => window.location.reload()}
              className="p-1 rounded-full text-gray-400 hover:text-gray-500"
              aria-label="Refresh"
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
              <p className="text-sm text-gray-500">Active Products</p>
              <p className="text-xl font-semibold">
                {realTimeStats.activeProducts}
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Open Inquiries</p>
              <p className="text-xl font-semibold">
                {realTimeStats.openTickets}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            title="Total Revenue"
            value={`₹${summaryStats.totalRevenue.value.toLocaleString()}`}
            icon={DollarSign}
            color={{ bg: "bg-green-100", text: "text-green-600" }}
            percentage={summaryStats.totalRevenue.percentage}
            activePeriod={activePeriod}
          />
          <SummaryCard
            title="Active Sellers"
            value={summaryStats.activeSellers.value.toLocaleString()}
            icon={Users}
            color={{ bg: "bg-purple-100", text: "text-purple-600" }}
            percentage={summaryStats.activeSellers.percentage}
            activePeriod={activePeriod}
          />
          <SummaryCard
            title="Active Buyers"
            value={summaryStats.activeBuyers.value.toLocaleString()}
            icon={User}
            color={{ bg: "bg-yellow-100", text: "text-yellow-600" }}
            percentage={summaryStats.activeBuyers.percentage}
            activePeriod={activePeriod}
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
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `₹${value.toLocaleString()}`}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `₹${value.toLocaleString()}`,
                      "Revenue",
                    ]}
                  />
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
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      const label = name === "buyers" ? "Buyers" : "Sellers";
                      return [value.toLocaleString(), label];
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="buyers"
                    name="buyers"
                    stroke="#6366F1"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sellers"
                    name="sellers"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
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
          {/* <div className="bg-white rounded-lg shadow p-6">
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
                    <span className="text-sm">{activity.user}</span>
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
          </div> */}

          {/* Top Sellers */}
          {/* <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Top Performing Sellers
              </h3>
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
                    ₹{seller.revenue || "0"}
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>

        {/* Data Export */}
        {/* <div className="bg-white rounded-lg shadow p-6 mb-8">
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
        </div> */}
      </main>
    </div>
  );
};

export default Analytics;
