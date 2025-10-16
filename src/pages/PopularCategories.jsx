import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  TrendingUp,
  Monitor,
  Cpu,
  CircuitBoard,
  BarChart3,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PopularCategories = () => {
  const navigate = useNavigate();
  const { api } = useAuth();

  // State management
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("totalSales");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Theme colors
  const themeColor = "#0c0b45";
  const themeLighter = "#1c1a7a";
  const themeLight = "#e8e8f0";

  // Fetch categories from server
  const fetchCategories = async (
    page = 1,
    search = "",
    sort = "totalSales",
    order = "desc"
  ) => {
    try {
      setLoading(true);
      const response = await api.get("/api/dashboard/categories", {
        params: {
          page,
          limit: itemsPerPage,
          search,
          sortBy: sort,
          sortOrder: order,
        },
      });

      if (response.data.success) {
        setCategories(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalItems);
        setCurrentPage(response.data.pagination.currentPage);
      } else {
        setError("Failed to fetch categories");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.response?.data?.message || "Error fetching categories");
    } finally {
      setLoading(false);
    }
  };

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchCategories(1, searchTerm, sortBy, sortOrder);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle sort changes
  useEffect(() => {
    setCurrentPage(1);
    fetchCategories(1, searchTerm, sortBy, sortOrder);
  }, [sortBy, sortOrder]);

  // Initial load
  useEffect(() => {
    fetchCategories();
  }, []);

  // Calculate totals from current data
  const totalSales = categories.reduce((sum, category) => {
    return sum + (category.totalSales || 0);
  }, 0);

  const totalOrders = categories.reduce((sum, category) => {
    return sum + (category.orderCount || 0);
  }, 0);

  const getCategoryIcon = (index) => {
    const icons = [Monitor, Cpu, CircuitBoard];
    const IconComponent = icons[index % icons.length];
    return <IconComponent size={20} />;
  };

  const getCategoryColor = (index) => {
    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-purple-100 text-purple-600",
      "bg-green-100 text-green-600",
      "bg-orange-100 text-orange-600",
      "bg-pink-100 text-pink-600",
      "bg-indigo-100 text-indigo-600",
    ];
    return colors[index % colors.length];
  };

  const getCategoryBgColor = (index) => {
    const colors = [
      "bg-blue-50",
      "bg-purple-50",
      "bg-green-50",
      "bg-orange-50",
      "bg-pink-50",
      "bg-indigo-50",
    ];
    return colors[index % colors.length];
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
          <p className="text-xl font-semibold mb-2">Error Loading Categories</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

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
              <button
                onClick={() => navigate("/dashboard")}
                className="mr-4 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold">Popular Categories</h1>
              <span className="ml-2 text-xs bg-white text-indigo-900 px-2 py-1 rounded-full font-semibold">
                ANALYTICS
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Categories
                </p>
                <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
              </div>
              <div
                style={{ backgroundColor: themeLight }}
                className="p-3 rounded-lg"
              >
                <BarChart3 size={24} style={{ color: themeColor }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{totalSales.toLocaleString()}
                </p>
              </div>
              <div
                style={{ backgroundColor: themeLight }}
                className="p-3 rounded-lg"
              >
                <TrendingUp size={24} style={{ color: themeColor }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalOrders}
                </p>
              </div>
              <div
                style={{ backgroundColor: themeLight }}
                className="p-3 rounded-lg"
              >
                <Monitor size={24} style={{ color: themeColor }} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="totalSales">Sort by Sales</option>
                  <option value="orderCount">Sort by Orders</option>
                  <option value="name">Sort by Name</option>
                </select>
              </div>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              All Categories Performance
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Complete breakdown of category sales and performance metrics
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Sales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sales Share
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category, index) => {
                  const globalIndex = (currentPage - 1) * itemsPerPage + index;
                  const orderPercentage =
                    totalOrders > 0
                      ? (category.orderCount / totalOrders) * 100
                      : 0;

                  return (
                    <tr
                      key={category.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`p-2 rounded-lg ${getCategoryColor(
                              globalIndex
                            )}`}
                          >
                            {getCategoryIcon(globalIndex)}
                          </div>
                          <span className="ml-3 text-sm font-semibold text-gray-900">
                            #{globalIndex + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {category.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Avg: ₹{category.avgOrderValue} per order
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ₹{category.totalSales.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {category.totalSales.toLocaleString()} total
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {category.orderCount}
                        </div>
                        <div className="text-sm text-gray-500">
                          {orderPercentage.toFixed(1)}% of total
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {category.salesPercentage.toFixed(1)}%
                        </div>
                        <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${Math.min(
                                category.salesPercentage,
                                100
                              )}%`,
                              backgroundColor: themeColor,
                            }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {globalIndex < 3 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Top Performer
                            </span>
                          ) : globalIndex < 6 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Good
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Average
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {!loading && categories.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No categories found
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Try adjusting your search terms"
                : "No category data available"}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-xl shadow-md p-6 mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems} results
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                      fetchCategories(
                        currentPage - 1,
                        searchTerm,
                        sortBy,
                        sortOrder
                      );
                    }
                  }}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          fetchCategories(
                            pageNum,
                            searchTerm,
                            sortBy,
                            sortOrder
                          );
                        }}
                        className={`inline-flex items-center px-3 py-2 border text-sm leading-4 font-medium rounded-md ${
                          currentPage === pageNum
                            ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    if (currentPage < totalPages) {
                      setCurrentPage(currentPage + 1);
                      fetchCategories(
                        currentPage + 1,
                        searchTerm,
                        sortBy,
                        sortOrder
                      );
                    }
                  }}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PopularCategories;
