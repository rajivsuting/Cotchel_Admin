import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://cotchel-server-tvye7.ondigitalocean.app/api/categories/all"
        );
        setCategories(response.data.data);
      } catch (err) {
        setError("Failed to fetch categories. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((category) => category._id !== id));
  };

  const filteredCategories = categories.filter((category) => {
    return category.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const indexOfLastCategory = currentPage * itemsPerPage;
  const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  // Add handlers for search
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-gray-600">Loading categories...</p>
      </div>
    );
  }

  if (error) {
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
            <button className="flex items-center px-4 py-2 bg-[#0c0b45] text-white rounded-lg hover:bg-[#14136a] transition-colors">
              <Plus size={16} className="mr-2" />
              Add Category
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search categories..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c0b45]/30"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <Search
                  size={16}
                  className="absolute left-3 top-2.5 text-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products Count
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
                {currentCategories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {category.image && (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="h-10 w-10 rounded-md object-cover mr-3"
                          />
                        )}
                        {!category.image && (
                          <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center mr-3">
                            <span className="text-gray-500 text-sm font-medium">
                              {category.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {category.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {category._id?.substring(0, 8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.description || "No description"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {category.productsCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-2">
                        <button className="p-1 cursor-pointer rounded-md text-gray-500 hover:text-[#0c0b45] hover:bg-gray-100">
                          <Eye size={18} />
                        </button>
                        <button className="p-1 cursor-pointer rounded-md text-gray-500 hover:text-[#0c0b45] hover:bg-gray-100">
                          <Edit size={18} />
                        </button>
                        <button
                          className="p-1 cursor-pointer rounded-md text-gray-500 hover:text-red-600 hover:bg-gray-100"
                          onClick={() => handleDeleteCategory(category._id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCategories.length === 0 && (
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
              <p className="mt-1 text-gray-500">
                Try adjusting your search or add a new category.
              </p>
              <button className="mt-4 px-4 py-2 bg-[#0c0b45] text-white rounded-lg hover:bg-[#14136a] transition-colors">
                Add Category
              </button>
            </div>
          )}

          {filteredCategories.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium">{indexOfFirstCategory + 1}</span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastCategory, filteredCategories.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium">{filteredCategories.length}</span>{" "}
                categories
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-md ${
                        currentPage === page
                          ? "bg-[#0c0b45] text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
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
