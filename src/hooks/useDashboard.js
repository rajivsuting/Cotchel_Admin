import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const useDashboard = () => {
  const { api } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    orderStatus: [],
    categoryStats: [],
    recentOrders: [],
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/dashboard/stats");

      // Detailed debugging of raw data
      console.log("Raw API Response Data:", {
        totalSales: response.data.totalSales,
        salesChange: response.data.salesChange,
        lastWeekSales: response.data.lastWeekSales,
        newCustomers: response.data.newCustomers,
        lastWeekCustomers: response.data.lastWeekCustomers,
        customersChange: response.data.customersChange,
        totalOrders: response.data.totalOrders,
        lastWeekOrders: response.data.lastWeekOrders,
        ordersChange: response.data.ordersChange,
        totalRevenue: response.data.totalRevenue,
        lastWeekRevenue: response.data.lastWeekRevenue,
        revenueChange: response.data.revenueChange,
      });

      // Helper function to calculate percentage change
      const calculatePercentageChange = (current, previous) => {
        if (!previous || previous === 0) return 0;
        return ((current - previous) / previous) * 100;
      };

      // Helper function to normalize percentage changes
      const normalizePercentage = (value) => {
        if (!value || isNaN(value)) return 0;
        // Cap at 999%
        return Math.min(Math.max(value, -999), 999);
      };

      // Helper function to format currency
      const formatCurrency = (value) => {
        if (!value || isNaN(value)) return "₹0";
        return `₹${Number(value).toLocaleString()}`;
      };

      // Validate and recalculate changes if needed
      const validatedData = {
        totalSales: Number(response.data.totalSales) || 0,
        salesChange: response.data.lastWeekSales
          ? calculatePercentageChange(
              response.data.totalSales,
              response.data.lastWeekSales
            )
          : response.data.salesChange || 0,
        newCustomers: Number(response.data.newCustomers) || 0,
        customersChange: response.data.lastWeekCustomers
          ? calculatePercentageChange(
              response.data.newCustomers,
              response.data.lastWeekCustomers
            )
          : response.data.customersChange || 0,
        totalOrders: Number(response.data.totalOrders) || 0,
        ordersChange: response.data.lastWeekOrders
          ? calculatePercentageChange(
              response.data.totalOrders,
              response.data.lastWeekOrders
            )
          : response.data.ordersChange || 0,
        totalRevenue:
          Number(response.data.totalRevenue || response.data.totalSales) || 0,
        revenueChange: response.data.lastWeekRevenue
          ? calculatePercentageChange(
              response.data.totalRevenue || response.data.totalSales,
              response.data.lastWeekRevenue
            )
          : response.data.revenueChange || response.data.salesChange || 0,
      };

      console.log("Validated and recalculated data:", validatedData);

      // Transform the data to match the dashboard structure
      const transformedData = {
        stats: [
          {
            title: "Total Sales",
            value: formatCurrency(response.data.totalSales || 0),
            change: null, // No comparison data
            positive: null,
          },
          {
            title: "Total Customers",
            value: response.data.totalCustomers || 0,
            change: null, // No comparison data
            positive: null,
          },
          {
            title: "Total Orders",
            value: response.data.totalOrders || 0,
            change: null, // No comparison data
            positive: null,
          },
          {
            title: "Total Products",
            value: response.data.totalProducts || 0,
            change: null, // No comparison data
            positive: null,
          },
        ],
        orderStatus: [
          {
            status: "Payment Pending",
            count: response.data.orderStatus?.["Payment Pending"] || 0,
            color: "bg-amber-500",
          },
          {
            status: "Confirmed",
            count: response.data.orderStatus?.Confirmed || 0,
            color: "bg-blue-500",
          },
          {
            status: "Processing",
            count: response.data.orderStatus?.Processing || 0,
            color: "bg-indigo-500",
          },
          {
            status: "Shipped",
            count: response.data.orderStatus?.Shipped || 0,
            color: "bg-purple-500",
          },
          {
            status: "Delivered",
            count: response.data.orderStatus?.Delivered || 0,
            color: "bg-green-500",
          },
          {
            status: "Completed",
            count: response.data.orderStatus?.Completed || 0,
            color: "bg-green-600",
          },
          {
            status: "Cancelled",
            count: response.data.orderStatus?.Cancelled || 0,
            color: "bg-red-500",
          },
        ],
        categoryStats: (response.data.categoryStats || []).map((category) => ({
          name: category.name || "Unknown Category",
          totalSales: `₹${(category.totalSales || 0).toLocaleString()}`,
          orderCount: category.orderCount || 0,
        })),
        recentOrders: (response.data.recentOrders || []).map((order) => ({
          id: order._id || "Unknown",
          product: order.products?.[0]?.product?.title || "Unknown Product",
          image: order.products?.[0]?.product?.featuredImage || "",
          customer: order.buyer?.fullName || "Unknown Customer",
          date: order.createdAt
            ? new Date(order.createdAt).toLocaleDateString()
            : "Unknown Date",
          status: order.status || "Unknown",
          amount: `₹${(order.totalPrice || 0).toLocaleString()}`,
        })),
        topProducts: (response.data.topProducts || []).map((product) => {
          console.log("Product data:", product); // Debug log
          return {
            id: product._id || product.id || "",
            name: product.title || "Unknown Product",
            image: product.featuredImage || "",
            sold: product.soldCount || 0,
            revenue: `₹${(product.revenue || 0).toLocaleString()}`,
            stock: product.quantityAvailable || 0,
          };
        }),
      };

      setDashboardData(transformedData);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching dashboard data");
      console.error("Dashboard data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [api]);

  return { dashboardData, loading, error };
};

export default useDashboard;
