import React, { useState, useEffect, useCallback, memo, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Image as ImageIcon,
  Home,
} from "lucide-react";

const API_BASE_URL = "https://cotchel-server-tvye7.ondigitalocean.app/api";

// Optimized debounce hook with cleanup
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
};

// Memoized search input component
const SearchInput = memo(({ value, onChange, placeholder }) => (
  <div className="relative">
    <Search
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      size={20}
    />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c0b45] focus:border-transparent"
    />
  </div>
));

const BannerRow = memo(({ banner, onDelete }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/edit-promotional-banner/${banner._id}`);
  };

  return (
    <tr
      className="hover:bg-gray-50 transition-opacity duration-200 cursor-pointer"
      style={{ opacity: 0, animation: "fadeIn 0.3s forwards" }}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-16 w-32 rounded-md bg-gray-200 flex items-center justify-center mr-3 overflow-hidden">
            {banner.imageUrl ? (
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageIcon className="h-8 w-8 text-gray-400" />
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {banner.title}
            </div>
            <div className="text-xs text-gray-500">
              ID: {banner._id?.substring(0, 8)}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {banner.position}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {new Date(banner.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end items-center space-x-2">
          <button
            className="p-1 rounded-md text-gray-500 hover:text-[#0c0b45] hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={handleEdit}
            aria-label={`Edit ${banner.title}`}
          >
            <Edit size={18} />
          </button>
          <button
            className="p-1 rounded-md text-gray-500 hover:text-red-600 hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => onDelete(banner._id)}
            aria-label={`Delete ${banner.title}`}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
});

// Add fade-in animation
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

const PromotionalBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBanners, setTotalBanners] = useState(0);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const navigate = useNavigate();
  const abortControllerRef = useRef(null);

  // Use the custom debounce hook
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchBanners = useCallback(async () => {
    try {
      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_BASE_URL}/promotional-banners`, {
        params: {
          page: currentPage,
          limit,
          search: debouncedSearchTerm?.trim() || "",
        },
        signal: abortControllerRef.current.signal,
      });

      const { data, pagination } = response.data;
      setBanners(data);
      setTotalPages(pagination.totalPages);
      setTotalBanners(pagination.total);
    } catch (err) {
      if (err.name === "CanceledError") {
        return; // Ignore canceled requests
      }
      setError(
        err.response?.data?.message || "Failed to fetch promotional banners"
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, debouncedSearchTerm]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchBanners();

    // Cleanup function to cancel any ongoing requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchBanners]);

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this promotional banner?")
    ) {
      try {
        await axios.delete(`${API_BASE_URL}/promotional-banners/${id}`);
        toast.success("Promotional banner deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        fetchBanners();
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to delete promotional banner";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.error("Delete Error:", err);
      }
    }
  };

  const handleSort = () => {
    setOrder(order === "asc" ? "desc" : "asc");
  };

  const handleAddBanner = () => {
    navigate("/add-promotional-banner");
  };

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
  }, []);

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Promotional Banners
            </h1>
            <p className="text-gray-600">
              Manage your website promotional banners
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAddBanner}
              className="flex items-center px-4 py-2 bg-[#0c0b45] text-white rounded-lg hover:bg-[#14136a] transition-colors cursor-pointer"
              aria-label="Add new promotional banner"
            >
              <Plus size={16} className="mr-2" />
              Add Promotional Banner
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <SearchInput
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search promotional banners..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Banners Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promotional Banner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={handleSort}
                    role="button"
                    tabIndex={0}
                    aria-label="Sort by date"
                    onKeyPress={(e) => e.key === "Enter" && handleSort()}
                  >
                    Created At
                    <ArrowUpDown size={14} className="inline ml-1" />
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading
                  ? Array.from({ length: limit }).map((_, index) => (
                      <tr key={index} className="animate-pulse">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-16 w-24 bg-gray-200 rounded-md mr-3"></div>
                            <div>
                              <div className="h-4 w-32 bg-gray-200 rounded"></div>
                              <div className="h-3 w-20 bg-gray-200 rounded mt-2"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end space-x-2">
                            <div className="h-5 w-5 bg-gray-200 rounded"></div>
                            <div className="h-5 w-5 bg-gray-200 rounded"></div>
                          </div>
                        </td>
                      </tr>
                    ))
                  : (banners || []).map((banner) => (
                      <BannerRow
                        key={banner._id}
                        banner={banner}
                        onDelete={handleDelete}
                      />
                    ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {totalBanners > 0 ? (currentPage - 1) * limit + 1 : 0}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * limit, totalBanners || 0)}
                </span>{" "}
                of <span className="font-medium">{totalBanners || 0}</span>{" "}
                promotional banners
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1 || loading}
                  className={`p-2 rounded-md transition-colors cursor-pointer ${
                    currentPage === 1 || loading
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from(
                  { length: Math.max(1, totalPages || 1) },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    disabled={loading}
                    className={`w-8 h-8 rounded-md transition-colors cursor-pointer ${
                      currentPage === page
                        ? "bg-[#0c0b45] text-white"
                        : loading
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    aria-label={`Page ${page}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages || 1)
                    )
                  }
                  disabled={currentPage === totalPages || loading}
                  className={`p-2 rounded-md transition-colors cursor-pointer ${
                    currentPage === totalPages || loading
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  aria-label="Next page"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanners;
