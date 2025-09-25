import React, { useState, useEffect } from "react";
import {
  Search,
  MessageSquare,
  Filter,
  Clock,
  User,
  ChevronRight,
  Home,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const HelpCenter = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [inquiries, setInquiries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetching, setIsFetching] = useState(true);

  const filters = [
    { value: "all", label: "All Inquiries" },
    { value: "Open", label: "Open" },
    { value: "In_Progress", label: "In Progress" },
    { value: "Resolved", label: "Resolved" },
    { value: "Closed", label: "Closed" },
  ];

  const fetchInquiries = async () => {
    try {
      setIsFetching(true);
      const response = await axios.get(
        `https://starfish-app-6q6ot.ondigitalocean.app/api/inquiries?page=${currentPage}&limit=10&status=${
          selectedFilter !== "all" ? selectedFilter : ""
        }`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setInquiries(response.data.data.inquiries);
        setTotalPages(response.data.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast.error(error.response?.data?.message || "Failed to fetch inquiries");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [currentPage, selectedFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-yellow-100 text-yellow-800";
      case "In_Progress":
        return "bg-blue-100 text-blue-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "Closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inquiry.user?.fullName &&
        inquiry.user.fullName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  const handleViewDetails = (inquiry) => {
    navigate(`/help-center/${inquiry._id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link
            to="/"
            className="flex items-center hover:text-[#0c0b45] transition-colors"
          >
            <Home size={16} className="mr-1" />
            Home
          </Link>
          <ChevronRight size={16} className="text-gray-400" />
          <span className="text-[#0c0b45] font-medium">Help Center</span>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Inquiries Management
              </h1>
              <p className="text-gray-600 text-lg">
                Handle and respond to user inquiries efficiently
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg">
                <MessageSquare className="w-5 h-5 text-[#0c0b45]" />
                <div>
                  <span className="text-sm text-gray-600">Total Inquiries</span>
                  <p className="text-xl font-semibold text-gray-800">
                    {inquiries.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search inquiries by subject, message, or user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0c0b45] focus:border-[#0c0b45] text-gray-700 placeholder-gray-400"
              />
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-6 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0c0b45] focus:border-[#0c0b45] text-gray-700 bg-white cursor-pointer"
            >
              {filters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>

          {/* Inquiries List */}
          <div className="space-y-4">
            {isFetching ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0c0b45]"></div>
              </div>
            ) : filteredInquiries.length > 0 ? (
              filteredInquiries.map((inquiry) => (
                <div
                  key={inquiry._id}
                  className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-all duration-200 bg-white"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#0c0b45] flex items-center justify-center text-white text-xl font-semibold shadow-lg">
                        {inquiry.user?.fullName
                          ? inquiry.user.fullName.charAt(0).toUpperCase()
                          : "?"}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {inquiry.user?.fullName || "Unknown User"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {inquiry.user?.email || "No email provided"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
                          inquiry.status
                        )}`}
                      >
                        {inquiry.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-800 text-lg mb-2">
                      {inquiry.subject}
                    </h4>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {inquiry.message}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#0c0b45]" />
                        <span>
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#0c0b45]" />
                        <span className="capitalize">
                          {inquiry.inquiryType}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleViewDetails(inquiry)}
                        className="px-4 py-2 text-[#0c0b45] border-2 border-[#0c0b45] rounded-lg hover:bg-[#0c0b45] hover:text-white transition-all duration-200 font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No inquiries found</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`p-2 border border-gray-200 rounded-lg transition-colors ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      currentPage === index + 1
                        ? "bg-[#0c0b45] text-white"
                        : "border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`p-2 border border-gray-200 rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
