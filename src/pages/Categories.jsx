import React, { useState, useEffect, useCallback, memo } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom"; // Import Link for navigation
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpDown,
  X,
} from "lucide-react";

const CategoryRow = memo(({ category, onDelete }) => (
  <tr
    className="hover:bg-gray-50 transition-opacity duration-200 cursor-pointer"
    style={{ opacity: 0, animation: "fadeIn 0.3s forwards" }}
  >
    <td className="px-6 py-4 whitespace-nowrap">
      <Link to={`/categories/${category._id}`} className="flex items-center">
        <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center mr-3">
          {category.icon ? (
            <img
              src={category.icon}
              alt={category.name}
              className="h-10 w-10 rounded-md object-cover"
            />
          ) : (
            <span className="text-gray-500 text-sm font-medium">
              {category.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">
            {category.name}
          </div>
          <div className="text-xs text-gray-500">
            ID: {category._id?.substring(0, 8)}
          </div>
        </div>
      </Link>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
      <Link to={`/categories/${category._id}`}>
        {category.subCategories?.length || 0}
      </Link>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div className="flex justify-end items-center space-x-2">
        <button
          className="p-1 rounded-md text-gray-500 hover:text-[#0c0b45] hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label={`Edit ${category.name}`}
        >
          <Edit size={18} />
        </button>
        <button
          className="p-1 rounded-md text-gray-500 hover:text-red-600 hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={() => onDelete(category._id)}
          aria-label={`Delete ${category.name}`}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </td>
  </tr>
));

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

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const [limit] = useState(6);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("asc");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState(null);
  const [addingCategory, setAddingCategory] = useState(false);
  const [addError, setAddError] = useState(null);
  const [addSuccess, setAddSuccess] = useState(false);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit,
        ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
        ...(sortBy && { sortBy }),
        ...(order && { order }),
      };

      const response = await axios.get(
        "https://cotchel-server-tvye7.ondigitalocean.app/api/categories/all",
        { params }
      );

      const { data, pagination } = response.data;
      setCategories(data || []);
      setTotalCategories(pagination?.totalCategories || 0);
      setTotalPages(pagination?.totalPages || 1);
      setError(null);
    } catch (err) {
      setError("Failed to fetch categories. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, sortBy, order, limit]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setAddingCategory(true);
    setAddError(null);

    try {
      const formData = new FormData();
      formData.append("name", newCategoryName);
      if (newCategoryIcon) {
        formData.append("icon", newCategoryIcon);
      }

      const response = await axios.post(
        "https://cotchel-server-tvye7.ondigitalocean.app/api/categories/create",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setCategories((prev) => [...prev, response.data.data]);
      setNewCategoryName("");
      setNewCategoryIcon(null);
      setShowAddForm(false);
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 3000);
      fetchCategories();
    } catch (err) {
      setAddError(
        err.response?.data?.message ||
          "Failed to add category. Please try again."
      );
      console.error(err);
    } finally {
      setAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(
        `https://cotchel-server-tvye7.ondigitalocean.app/api/categories/${id}`
      );
      setCategories((prev) => prev.filter((category) => category._id !== id));
      fetchCategories();
    } catch (err) {
      setError("Failed to delete category. Please try again.");
      console.error(err);
    }
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

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCategoryIcon(file);
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
            <p className="text-gray-600">Manage your product categories</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setAddError(null);
              }}
              className={`flex items-center px-4 py-2 ${
                showAddForm
                  ? "bg-gray-100 text-gray-700 border border-gray-300"
                  : "bg-[#0c0b45] text-white"
              } rounded-lg hover:${
                showAddForm ? "bg-gray-200" : "bg-[#14136a]"
              } transition-colors cursor-pointer`}
              aria-label={
                showAddForm ? "Cancel add category" : "Add new category"
              }
            >
              {showAddForm ? (
                <>
                  <X size={16} className="mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus size={16} className="mr-2" />
                  Add Category
                </>
              )}
            </button>
          </div>
        </div>

        {addSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <Plus size={20} className="mr-2" />
            <p>Category added successfully!</p>
          </div>
        )}

        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-100 pb-2">
              Add New Category
            </h2>
            {addError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
                <Trash2 size={20} className="mr-2 flex-shrink-0 mt-0.5" />
                <p>{addError}</p>
              </div>
            )}
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label
                  htmlFor="categoryName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category Name
                </label>
                <input
                  id="categoryName"
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c0b45]/30 transition-all"
                  placeholder="Enter category name"
                  required
                  aria-label="Category name"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Category name must be unique and will be displayed to
                  customers.
                </p>
              </div>
              <div>
                <label
                  htmlFor="categoryIcon"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category Icon
                </label>
                <input
                  id="categoryIcon"
                  type="file"
                  accept="image/*"
                  onChange={handleIconChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c0b45]/30 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#0c0b45] file:text-white hover:file:bg-[#14136a]"
                  aria-label="Upload category icon"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Recommended dimensions: 40x40 pixels (PNG, JPG, or SVG).
                </p>
                {newCategoryIcon && (
                  <p className="mt-1 text-xs text-gray-600">
                    Selected: {newCategoryIcon.name}
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setNewCategoryName("");
                    setNewCategoryIcon(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors cursor-pointer"
                  aria-label="Clear form"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={addingCategory || !newCategoryName.trim()}
                  className={`px-4 py-2 text-sm font-medium text-white bg-[#0c0b45] rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#0c0b45] focus:ring-offset-2 transition-colors cursor-pointer ${
                    addingCategory || !newCategoryName.trim()
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                  aria-label="Create category"
                >
                  {addingCategory ? "Creating..." : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search categories..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c0b45]/30 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search categories"
                />
                <Search
                  size={16}
                  className="absolute left-3 top-2.5 text-gray-400"
                />
              </div>
              <div className="relative">
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c0b45]/30 appearance-none transition-all cursor-pointer"
                  aria-label="Filter categories"
                >
                  <option value="">All Categories</option>
                </select>
                <Filter
                  size={16}
                  className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
                />
              </div>
              <div>
                <button
                  onClick={() => handleSort("name")}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
                  aria-label="Sort by name"
                >
                  <ArrowUpDown size={16} className="mr-2" />
                  <span>Sort by Name</span>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subcategories
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Skeleton
                              circle
                              width={40}
                              height={40}
                              className="mr-3"
                            />
                            <div>
                              <Skeleton width={120} height={16} />
                              <Skeleton
                                width={80}
                                height={12}
                                className="mt-2"
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton width={60} height={16} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Skeleton width={60} height={20} />
                        </td>
                      </tr>
                    ))
                  : categories.map((category) => (
                      <CategoryRow
                        key={category._id}
                        category={category}
                        onDelete={handleDeleteCategory}
                      />
                    ))}
              </tbody>
            </table>
          </div>

          {!loading && categories.length === 0 && (
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
                No categories found
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Try adjusting your search or add a new category.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 px-4 py-2 bg-[#0c0b45] text-white rounded-lg hover:bg-[#14136a] transition-colors flex items-center mx-auto cursor-pointer"
                aria-label="Add new category"
              >
                <Plus size={16} className="mr-2" />
                Add Category
              </button>
            </div>
          )}

          {!loading && categories.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * limit, totalCategories)}
                </span>{" "}
                of <span className="font-medium">{totalCategories}</span>{" "}
                categories
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

export default Categories;
