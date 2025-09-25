import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  Edit,
  Package,
} from "lucide-react";

const CategoryDetails = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubcategoriesOpen, setIsSubcategoriesOpen] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `https://starfish-app-6q6ot.ondigitalocean.app/api/categories/get/${id}`
        );
        setCategory(response.data.data.category);
        setProductCount(response.data.data.productCount);
        // console.log(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch category details. Please try again later.");
        setLoading(false);
        console.error(err);
      }
    };
    fetchCategory();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Category not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-6">
          <Link
            to="/categories"
            className="flex items-center hover:text-[#0c0b45] transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Categories
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">{category.name}</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              {category.icon ? (
                <img
                  src={category.icon}
                  alt={category.name}
                  className="h-20 w-20 rounded-lg object-cover mr-6 shadow-md"
                />
              ) : (
                <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center mr-6 shadow-md">
                  <span className="text-gray-600 text-3xl font-semibold">
                    {category.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  {category.name}
                </h1>
                <p className="text-sm text-gray-500 mt-1">ID: {category._id}</p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#0c0b45] text-white">
                    <Package size={16} className="mr-2" />
                    {productCount} Products
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#0c0b45] text-white">
                    <Layers size={16} className="mr-2" />
                    {category.subCategories.length} Subcategories
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
            <div className="flex items-center">
              <Calendar size={18} className="mr-3 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Created</p>
                <p className="text-sm text-gray-600">
                  {formatDate(category.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar size={18} className="mr-3 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Last Updated
                </p>
                <p className="text-sm text-gray-600">
                  {formatDate(category.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subcategories Section */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          <div
            className="p-6 flex justify-between items-center border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setIsSubcategoriesOpen(!isSubcategoriesOpen)}
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Subcategories ({category.subCategories.length})
            </h2>
            {isSubcategoriesOpen ? (
              <ChevronUp size={20} className="text-gray-500" />
            ) : (
              <ChevronDown size={20} className="text-gray-500" />
            )}
          </div>
          {isSubcategoriesOpen && (
            <div className="overflow-x-auto">
              {category.subCategories.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product Count
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {category.subCategories.map((sub) => (
                      <tr
                        key={sub._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <Link
                            to={`/subcategories/${sub._id}`}
                            className="text-primary hover:text-blue-800 hover:underline"
                          >
                            {sub.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {sub._id}{" "}
                          {/* Note: This shows ID instead of product count */}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(sub.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(sub.updatedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <Layers size={40} className="mx-auto text-gray-400 mb-4" />
                  <h3 classNameName="text-lg font-medium text-gray-900">
                    No Subcategories
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    This category has no subcategories yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetails;
