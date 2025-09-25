import React, { useState, useEffect, useCallback, memo } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
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

const SubcategoryRow = memo(({ subcategory, onDelete, onEdit }) => (
  <tr
    className="hover:bg-gray-50 transition-opacity duration-200 cursor-pointer"
    style={{ opacity: 0, animation: "fadeIn 0.3s forwards" }}
  >
    <td className="px-6 py-4 whitespace-nowrap">
      <Link
        to={`/subcategories/${subcategory._id}`}
        className="flex items-center"
      >
        <div>
          <div className="text-sm font-medium text-gray-900">
            {subcategory.name}
          </div>
          <div className="text-xs text-gray-500">
            ID: {subcategory._id?.substring(0, 8)}
          </div>
        </div>
      </Link>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
      <Link to={`/categories/${subcategory.category?._id}`}>
        {subcategory.category?.name || "N/A"}
      </Link>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
      {subcategory.productCount || 0}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div className="flex justify-end items-center space-x-2">
        <button
          className="p-1 rounded-md text-gray-500 hover:text-[#0c0b45] hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={() => onEdit(subcategory._id)}
          aria-label={`Edit ${subcategory.name}`}
        >
          <Edit size={18} />
        </button>
        <button
          className="p-1 rounded-md text-gray-500 hover:text-red-600 hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={() => onDelete(subcategory._id)}
          aria-label={`Delete ${subcategory.name}`}
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

const Subcategories = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSubcategories, setTotalSubcategories] = useState(0);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("asc");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [newSubcategoryCategory, setNewSubcategoryCategory] = useState("");
  const [addingSubcategory, setAddingSubcategory] = useState(false);
  const [addError, setAddError] = useState(null);
  const [addSuccess, setAddSuccess] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [editSubcategoryName, setEditSubcategoryName] = useState("");
  const [editSubcategoryCategory, setEditSubcategoryCategory] = useState("");
  const [editError, setEditError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(false);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch categories for dropdown
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://starfish-app-6q6ot.ondigitalocean.app/api/categories/all"
      );
      setCategories(response.data.data || []);
      console.log(response.data.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }, []);

  // Fetch subcategories
  const fetchSubcategories = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit,
        ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
        ...(sortBy && { sortBy }),
        ...(order && { order }),
        ...(categoryFilter && { category: categoryFilter }),
      };

      const response = await axios.get(
        "https://starfish-app-6q6ot.ondigitalocean.app/api/subcategories/all",
        { params }
      );

      const { data, pagination } = response.data;
      setSubcategories(data || []);
      setTotalSubcategories(pagination?.totalSubcategories || 0);
      setTotalPages(pagination?.totalPages || 1);
      setError(null);
    } catch (err) {
      setError("Failed to fetch subcategories. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, sortBy, order, limit, categoryFilter]);

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, [fetchSubcategories, fetchCategories]);

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    if (!newSubcategoryName.trim() || !newSubcategoryCategory) return;

    setAddingSubcategory(true);
    setAddError(null);

    try {
      const response = await axios.post(
        "https://starfish-app-6q6ot.ondigitalocean.app/api/subcategories/create",
        {
          name: newSubcategoryName,
          category: newSubcategoryCategory,
        }
      );

      setSubcategories((prev) => [...prev, response.data.data]);
      setNewSubcategoryName("");
      setNewSubcategoryCategory("");
      setShowAddForm(false);
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 3000);
      fetchSubcategories();
    } catch (err) {
      setAddError(
        err.response?.data?.message ||
          "Failed to add subcategory. Please try again."
      );
      console.error(err);
    } finally {
      setAddingSubcategory(false);
    }
  };

  const handleDeleteSubcategory = async (id) => {
    const subcategory = subcategories.find((sub) => sub._id === id);
    const subcategoryName = subcategory ? subcategory.name : "this subcategory";

    const result = await Swal.fire({
      title: "Delete Subcategory",
      text: `Are you sure you want to delete "${subcategoryName}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      customClass: {
        popup: "w-96 p-4 bg-gray-100 rounded-lg shadow-lg",
        icon: "w-12 h-12",
        title: "text-lg font-bold text-gray-800",
        htmlContainer: "text-sm text-gray-600",
        actions: "flex justify-center gap-5",
        confirmButton:
          "bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700",
        cancelButton:
          "bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300",
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `https://starfish-app-6q6ot.ondigitalocean.app/api/subcategories/${id}`
        );
        setSubcategories((prev) => prev.filter((sub) => sub._id !== id));
        fetchSubcategories();
        Swal.fire({
          title: "Deleted!",
          text: "Subcategory has been deleted successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: "w-72 p-4 bg-gray-100 rounded-lg shadow-lg",
            icon: "w-12 h-12",
            title: "text-lg font-bold text-gray-800",
            htmlContainer: "text-sm text-gray-600",
          },
          buttonsStyling: false,
        });
      } catch (err) {
        setError("Failed to delete subcategory. Please try again.");
        console.error(err);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete subcategory. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            popup: "w-72 p-4 bg-gray-100 rounded-lg shadow-lg",
            icon: "w-12 h-12",
            title: "text-lg font-bold text-gray-800",
            htmlContainer: "text-sm text-gray-600",
            confirmButton:
              "bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700",
          },
          buttonsStyling: false,
        });
      }
    }
  };

  const handleEditSubcategory = (id) => {
    const subcategory = subcategories.find((sub) => sub._id === id);
    if (subcategory) {
      setEditingSubcategory(id);
      setEditSubcategoryName(subcategory.name);
      setEditSubcategoryCategory(
        subcategory.category?._id || subcategory.category
      );
      setEditError(null);
    }
  };

  const handleUpdateSubcategory = async (e) => {
    e.preventDefault();
    if (!editSubcategoryName.trim() || !editSubcategoryCategory) return;

    try {
      await axios.put(
        `https://starfish-app-6q6ot.ondigitalocean.app/api/subcategories/${editingSubcategory}`,
        {
          name: editSubcategoryName,
          category: editSubcategoryCategory,
        }
      );

      setSubcategories((prev) =>
        prev.map((subcategory) =>
          subcategory._id === editingSubcategory
            ? {
                ...subcategory,
                name: editSubcategoryName,
                category: categories.find(
                  (cat) => cat._id === editSubcategoryCategory
                ),
              }
            : subcategory
        )
      );

      setEditingSubcategory(null);
      setEditSubcategoryName("");
      setEditSubcategoryCategory("");
      setEditSuccess(true);
      setTimeout(() => setEditSuccess(false), 3000);
      fetchSubcategories();
    } catch (err) {
      setEditError(
        err.response?.data?.message ||
          "Failed to update subcategory. Please try again."
      );
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setEditingSubcategory(null);
    setEditSubcategoryName("");
    setEditSubcategoryCategory("");
    setEditError(null);
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
            <h1 className="text-2xl font-bold text-gray-800">Subcategories</h1>
            <p className="text-gray-600">Manage your product subcategories</p>
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
                showAddForm ? "Cancel add subcategory" : "Add new subcategory"
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
                  Add Subcategory
                </>
              )}
            </button>
          </div>
        </div>

        {addSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <Plus size={20} className="mr-2" />
            <p>Subcategory added successfully!</p>
          </div>
        )}

        {editSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <Edit size={20} className="mr-2" />
            <p>Subcategory updated successfully!</p>
          </div>
        )}

        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-100 pb-2">
              Add New Subcategory
            </h2>
            {addError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
                <Trash2 size={20} className="mr-2 flex-shrink-0 mt-0.5" />
                <p>{addError}</p>
              </div>
            )}
            <form onSubmit={handleAddSubcategory} className="space-y-4">
              <div>
                <label
                  htmlFor="subcategoryName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subcategory Name
                </label>
                <input
                  id="subcategoryName"
                  type="text"
                  value={newSubcategoryName}
                  onChange={(e) => setNewSubcategoryName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c0b45]/30 transition-all"
                  placeholder="Enter subcategory name"
                  required
                  aria-label="Subcategory name"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Subcategory name must be unique within its category.
                </p>
              </div>
              <div>
                <label
                  htmlFor="subcategoryCategory"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="subcategoryCategory"
                  value={newSubcategoryCategory}
                  onChange={(e) => setNewSubcategoryCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c0b45]/30 appearance-none transition-all cursor-pointer"
                  required
                  aria-label="Select category"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Select the parent category for this subcategory.
                </p>
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setNewSubcategoryName("");
                    setNewSubcategoryCategory("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors cursor-pointer"
                  aria-label="Clear form"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={
                    addingSubcategory ||
                    !newSubcategoryName.trim() ||
                    !newSubcategoryCategory
                  }
                  className={`px-4 py-2 text-sm font-medium text-white bg-[#0c0b45] rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#0c0b45] focus:ring-offset-2 transition-colors cursor-pointer ${
                    addingSubcategory ||
                    !newSubcategoryName.trim() ||
                    !newSubcategoryCategory
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                  aria-label="Create subcategory"
                >
                  {addingSubcategory ? "Creating..." : "Create Subcategory"}
                </button>
              </div>
            </form>
          </div>
        )}

        {editingSubcategory && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-100 pb-2">
              Edit Subcategory
            </h2>
            {editError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
                <Trash2 size={20} className="mr-2 flex-shrink-0 mt-0.5" />
                <p>{editError}</p>
              </div>
            )}
            <form onSubmit={handleUpdateSubcategory} className="space-y-4">
              <div>
                <label
                  htmlFor="editSubcategoryName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subcategory Name
                </label>
                <input
                  id="editSubcategoryName"
                  type="text"
                  value={editSubcategoryName}
                  onChange={(e) => setEditSubcategoryName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c0b45]/30 transition-all"
                  placeholder="Enter subcategory name"
                  required
                  aria-label="Subcategory name"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Subcategory name must be unique within its category.
                </p>
              </div>
              <div>
                <label
                  htmlFor="editSubcategoryCategory"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="editSubcategoryCategory"
                  value={editSubcategoryCategory}
                  onChange={(e) => setEditSubcategoryCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c0b45]/30 appearance-none transition-all cursor-pointer"
                  required
                  aria-label="Select category"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Select the parent category for this subcategory.
                </p>
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors cursor-pointer"
                  aria-label="Cancel edit"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    !editSubcategoryName.trim() || !editSubcategoryCategory
                  }
                  className={`px-4 py-2 text-sm font-medium text-white bg-[#0c0b45] rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#0c0b45] focus:ring-offset-2 transition-colors cursor-pointer ${
                    !editSubcategoryName.trim() || !editSubcategoryCategory
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                  aria-label="Update subcategory"
                >
                  Update Subcategory
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
                  placeholder="Search subcategories..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c0b45]/30 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search subcategories"
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
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
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
                    Subcategory
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
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
                          <Skeleton width={120} height={16} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton width={100} height={16} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton width={60} height={16} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Skeleton width={60} height={20} />
                        </td>
                      </tr>
                    ))
                  : subcategories.map((subcategory) => (
                      <SubcategoryRow
                        key={subcategory._id}
                        subcategory={subcategory}
                        onDelete={handleDeleteSubcategory}
                        onEdit={handleEditSubcategory}
                      />
                    ))}
              </tbody>
            </table>
          </div>

          {!loading && subcategories.length === 0 && (
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
                No subcategories found
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Try adjusting your search or add a new subcategory.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 px-4 py-2 bg-[#0c0b45] text-white rounded-lg hover:bg-[#14136a] transition-colors flex items-center mx-auto cursor-pointer"
                aria-label="Add new subcategory"
              >
                <Plus size={16} className="mr-2" />
                Add Subcategory
              </button>
            </div>
          )}

          {!loading && subcategories.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * limit, totalSubcategories)}
                </span>{" "}
                of <span className="font-medium">{totalSubcategories}</span>{" "}
                subcategories
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

export default Subcategories;
