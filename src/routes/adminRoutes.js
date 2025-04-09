import express from "express";
import { isAuthenticated, isAdmin } from "../middleware/auth.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

const router = express.Router();

// Get dashboard data
router.get("/dashboard", isAuthenticated, isAdmin, async (req, res) => {
  try {
    // Get date range for comparison (last 7 days)
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get total sales and compare with last week
    const currentWeekSales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: lastWeek },
          status: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const lastWeekSales = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(lastWeek.getTime() - 7 * 24 * 60 * 60 * 1000),
            $lt: lastWeek,
          },
          status: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalSales = currentWeekSales[0]?.total || 0;
    const lastWeekTotal = lastWeekSales[0]?.total || 0;
    const salesChange = lastWeekTotal
      ? ((totalSales - lastWeekTotal) / lastWeekTotal) * 100
      : 0;

    // Get new customers count and compare with last week
    const currentWeekCustomers = await User.countDocuments({
      createdAt: { $gte: lastWeek },
      role: "buyer",
    });

    const lastWeekCustomers = await User.countDocuments({
      createdAt: {
        $gte: new Date(lastWeek.getTime() - 7 * 24 * 60 * 60 * 1000),
        $lt: lastWeek,
      },
      role: "buyer",
    });

    const customersChange = lastWeekCustomers
      ? ((currentWeekCustomers - lastWeekCustomers) / lastWeekCustomers) * 100
      : 0;

    // Get total orders and compare with last week
    const currentWeekOrders = await Order.countDocuments({
      createdAt: { $gte: lastWeek },
    });

    const lastWeekOrders = await Order.countDocuments({
      createdAt: {
        $gte: new Date(lastWeek.getTime() - 7 * 24 * 60 * 60 * 1000),
        $lt: lastWeek,
      },
    });

    const ordersChange = lastWeekOrders
      ? ((currentWeekOrders - lastWeekOrders) / lastWeekOrders) * 100
      : 0;

    // Get product visits (this would need to be tracked in your analytics system)
    const productVisits = 0; // Placeholder
    const visitsChange = 0; // Placeholder

    // Get order status counts
    const orderStatus = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const orderStatusMap = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    orderStatus.forEach((status) => {
      orderStatusMap[status._id] = status.count;
    });

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("products.product")
      .populate("buyer", "fullName");

    // Get top selling products
    const topProducts = await Product.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "products.product",
          as: "orders",
        },
      },
      {
        $project: {
          title: 1,
          featuredImage: 1,
          quantityAvailable: 1,
          soldCount: { $size: "$orders" },
          revenue: {
            $sum: {
              $map: {
                input: "$orders",
                as: "order",
                in: "$$order.totalPrice",
              },
            },
          },
        },
      },
      {
        $sort: { soldCount: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    res.json({
      totalSales,
      salesChange: Math.round(salesChange),
      newCustomers: currentWeekCustomers,
      customersChange: Math.round(customersChange),
      totalOrders: currentWeekOrders,
      ordersChange: Math.round(ordersChange),
      productVisits,
      visitsChange: Math.round(visitsChange),
      orderStatus: orderStatusMap,
      recentOrders,
      topProducts,
    });
  } catch (error) {
    console.error("Dashboard data error:", error);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
});

export default router;
