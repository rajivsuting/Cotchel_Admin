import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Swal from "sweetalert2";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  ArrowUpDown,
} from "lucide-react";

const SkeletonRow = () => (
  <tr className="animate-pulse opacity-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-md bg-gray-200 mr-3"></div>
        <div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          <div className="h-3 w-20 bg-gray-200 rounded mt-2"></div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 w-24 bg-gray-200 rounded"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 w-28 bg-gray-200 rounded"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 w-16 bg-gray-200 rounded"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 w-12 bg-gray-200 rounded"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 w-20 bg-gray-200 rounded"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right">
      <div className="flex justify-end space-x-2">
        <div className="h-5 w-5 bg-gray-200 rounded"></div>
        <div className="h-5 w-5 bg-gray-200 rounded"></div>
      </div>
    </td>
  </tr>
);

const ProductRow = memo(({ product, onDelete, onEdit }) => {
  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <tr
      className="hover:bg-gray-50 transition-opacity duration-200 cursor-pointer"
      style={{ opacity: 0, animation: "fadeIn 0.3s forwards" }}
      onClick={handleRowClick}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <img
            src={product.image || "/placeholder-image.jpg"}
            alt={product.name}
            className="h-10 w-10 rounded-md object-cover mr-3"
          />
          <div>
            <div className="text-sm font-medium text-gray-900">
              {product.name}
            </div>
            <div className="text-xs text-gray-500">
              SKU: {product?.sku || "N/A"}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {product.category}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {product.seller}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        ₹{product.price.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {product.stock}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            product.status === "Active"
              ? "bg-green-100 text-green-800"
              : product.status === "Low Stock"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {product.status}
        </span>
      </td>
      <td
        className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end items-center space-x-2">
          <button
            onClick={() => onEdit(product.id)}
            className="p-1 rounded-md text-gray-500 hover:text-[#0c0b45] hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label={`Edit ${product.name}`}
          >
            <Edit size={18} />
          </button>
          <button
            className="p-1 rounded-md text-gray-500 hover:text-red-600 hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => onDelete(product.id)}
            aria-label={`Delete ${product.name}`}
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

const AllProducts = () => {
  const navigate = useNavigate();
  const { api } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [limit] = useState(6);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [availableCategories, setAvailableCategories] = useState([]);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      // Find category ID by name
      const selectedCategory = availableCategories.find(
        (cat) => cat.name === categoryFilter
      );

      const params = {
        page: currentPage,
        limit,
        ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
        ...(selectedCategory && { category: selectedCategory._id }),
        ...(statusFilter && { status: statusFilter }),
        ...(sortBy && { sortBy }),
        ...(order && { order }),
      };

      console.log(params);

      const response = await api.get("/api/products", {
        params,
      });

      const mappedProducts = response.data.products.map((product) => ({
        id: product._id,
        name: product.title,
        category: product.category?.name || "Uncategorized",
        price: product.price,
        stock: product.quantityAvailable,
        sku: product.sku,
        seller: product.user?.fullName || "Unknown",
        status:
          product.quantityAvailable > 50
            ? "Active"
            : product.quantityAvailable > 0
            ? "Low Stock"
            : "Out of Stock",
        image: product.featuredImage,
      }));

      setProducts(mappedProducts);
      setTotalPages(response.data.totalPages);
      setTotalProducts(response.data.totalProducts);
      setError(null);
    } catch (err) {
      setError("Failed to fetch products. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    debouncedSearchTerm,
    categoryFilter,
    statusFilter,
    sortBy,
    order,
    limit,
    api,
    availableCategories,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDeleteProduct = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this product?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        customClass: {
          popup: "w-72 p-4 bg-gray-100 rounded-lg shadow-lg",
          icon: "w-12 h-12",
          title: "text-lg font-bold text-gray-800",
          htmlContainer: "text-sm text-gray-600",
          actions: "flex justify-center gap-5",
          confirmButton: "bg-[#0c0b45] text-white py-2 px-4 rounded-lg",
          cancelButton:
            "bg-gray-200 text-[#0c0b45] py-2 px-4 rounded-lg hover:bg-gray-300",
        },
        buttonsStyling: false,
      });

      if (result.isConfirmed) {
        await api.delete(`/api/products/delete/${id}`);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== id)
        );

        Swal.fire({
          title: "Deleted!",
          text: "The product has been deleted successfully.",
          icon: "success",
          timer: 2000,
          customClass: {
            popup: "w-72 p-4 bg-gray-100 rounded-lg shadow-lg",
            title: "text-lg font-bold text-gray-800",
            htmlContainer: "text-sm text-gray-600",
          },
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete the product. Please try again.",
        icon: "error",
        customClass: {
          popup: "w-72 p-4 bg-gray-100 rounded-lg shadow-lg",
          title: "text-lg font-bold text-gray-800",
          htmlContainer: "text-sm text-gray-600",
        },
      });
    }
  };

  const handleEditProduct = (id) => {
    navigate(`/products/edit/${id}`);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === "desc" ? "asc" : "desc");
    } else {
      setSortBy(field);
      setOrder("desc");
    }
    setCurrentPage(1);
  };

  // Fetch available categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/categories/all");
        setAvailableCategories(response.data.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, [api]);

  const categories = useMemo(
    () => ["", ...availableCategories.map((cat) => cat.name)],
    [availableCategories]
  );
  const statuses = useMemo(
    () => ["", "Active", "Low Stock", "Out of Stock"],
    []
  );

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
            <h1 className="text-2xl font-bold text-gray-800">Products</h1>
            <p className="text-gray-600">Manage your product inventory</p>
          </div>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center transition-colors cursor-pointer"
              aria-label="Export products"
            >
              <Download size={16} className="mr-2" />
              Export
            </button>
            <button
              onClick={() => navigate("/products/add")}
              className="flex items-center px-4 py-2 bg-[#0c0b45] text-white rounded-lg hover:bg-[#14136a] transition-colors cursor-pointer"
              aria-label="Add new product"
            >
              <Plus size={16} className="mr-2" />
              Add Product
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2 relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c0b45]/30 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search products"
                />
                <Search
                  size={16}
                  className="absolute left-3 top-2.5 text-gray-400"
                />
              </div>
              <div className="relative">
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c0b45]/30 appearance-none transition-all cursor-pointer"
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Filter by category"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category || "All Categories"}
                    </option>
                  ))}
                </select>
                <Filter
                  size={16}
                  className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
                />
              </div>
              <div className="relative">
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c0b45]/30 appearance-none transition-all cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Filter by status"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status || "All Statuses"}
                    </option>
                  ))}
                </select>
                <Filter
                  size={16}
                  className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
                />
              </div>
              <div>
                <button
                  onClick={() => handleSort("price")}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
                  aria-label="Sort by price"
                >
                  <ArrowUpDown size={16} className="mr-2" />
                  <span>Sort by Price</span>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seller
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("price")}
                    role="button"
                    tabIndex={0}
                    aria-label="Sort by price"
                    onKeyPress={(e) => e.key === "Enter" && handleSort("price")}
                  >
                    Price
                    <ArrowUpDown size={14} className="inline ml-1" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading
                  ? Array.from({ length: limit }).map((_, index) => (
                      <SkeletonRow key={index} />
                    ))
                  : products.map((product) => (
                      <ProductRow
                        key={product.id}
                        product={product}
                        onDelete={handleDeleteProduct}
                        onEdit={handleEditProduct}
                      />
                    ))}
              </tbody>
            </table>
          </div>

          {!loading && products.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7Z"
                    stroke="#9CA3AF"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.5 4.5V6.5C14.5 7.6 15.4 8.5 16.5 8.5H18.5"
                    stroke="#9CA3AF"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 13H12"
                    stroke="#9CA3AF"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 17H16"
                    stroke="#9CA3AF"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No products found
              </h3>
              <p className="mt-1 text-gray-500">
                Try adjusting your search or filter to find what you're looking
                for.
              </p>
              <button
                onClick={() => navigate("/products/add")}
                className="mt-4 px-4 py-2 bg-[#0c0b45] text-white rounded-lg hover:bg-[#14136a] transition-colors cursor-pointer"
                aria-label="Add new product"
              >
                Add Product
              </button>
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * limit, totalProducts)}
                </span>{" "}
                of <span className="font-medium">{totalProducts}</span> products
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
                  tabIndex={0}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
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
                      tabIndex={0}
                      onKeyPress={(e) =>
                        e.key === "Enter" && setCurrentPage(page)
                      }
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages || loading}
                  className={`p-2 rounded-md transition-colors cursor-pointer ${
                    currentPage === totalPages || loading
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  aria-label="Next page"
                  tabIndex={0}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
