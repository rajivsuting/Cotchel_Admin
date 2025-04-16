import { useState, useEffect } from "react";
import axios from "axios";

const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    orderStatus: [],
    categoryStats: [],
    recentOrders: [],
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://cotchel-server-tvye7.ondigitalocean.app/api/dashboard/stats",
          {
            withCredentials: true,
          }
        );

        // Transform the data to match the dashboard structure
        const transformedData = {
          stats: [
            {
              title: "Total Sales",
              value: `₹${(response.data.totalSales || 0).toLocaleString()}`,
              change: `${response.data.salesChange || 0}%`,
              positive: (response.data.salesChange || 0) >= 0,
            },
            {
              title: "New Customers",
              value: response.data.newCustomers || 0,
              change: `${response.data.customersChange || 0}%`,
              positive: (response.data.customersChange || 0) >= 0,
            },
            {
              title: "Total Orders",
              value: response.data.totalOrders || 0,
              change: `${response.data.ordersChange || 0}%`,
              positive: (response.data.ordersChange || 0) >= 0,
            },
            {
              title: "Total Revenue",
              value: `₹${(response.data.totalSales || 0).toLocaleString()}`,
              change: `${response.data.salesChange || 0}%`,
              positive: (response.data.salesChange || 0) >= 0,
            },
          ],
          orderStatus: [
            {
              status: "Pending",
              count: response.data.orderStatus?.Pending || 0,
              color: "bg-yellow-500",
            },
            {
              status: "Processing",
              count: response.data.orderStatus?.Processing || 0,
              color: "bg-blue-500",
            },
            {
              status: "Shipped",
              count: response.data.orderStatus?.Shipped || 0,
              color: "bg-indigo-500",
            },
            {
              status: "Delivered",
              count: response.data.orderStatus?.Delivered || 0,
              color: "bg-green-500",
            },
            {
              status: "Completed",
              count: response.data.orderStatus?.Completed || 0,
              color: "bg-green-500",
            },
            {
              status: "Cancelled",
              count: response.data.orderStatus?.Cancelled || 0,
              color: "bg-red-500",
            },
          ],
          categoryStats: (response.data.categoryStats || []).map(
            (category) => ({
              name: category.name || "Unknown Category",
              totalSales: `₹${(category.totalSales || 0).toLocaleString()}`,
              orderCount: category.orderCount || 0,
            })
          ),
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
          topProducts: (response.data.topProducts || []).map((product) => ({
            name: product.title || "Unknown Product",
            image: product.featuredImage || "",
            sold: product.soldCount || 0,
            revenue: `₹${(product.revenue || 0).toLocaleString()}`,
            stock: product.quantityAvailable || 0,
          })),
        };

        setDashboardData(transformedData);
        setError(null);
      } catch (err) {
        setError(
          err.response?.data?.message || "Error fetching dashboard data"
        );
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { dashboardData, loading, error };
};

export default useDashboard;
