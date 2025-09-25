import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Calendar,
  Package,
  ChevronDown,
  ChevronUp,
  Edit,
} from "lucide-react";

const SubcategoryDetails = () => {
  const { id } = useParams();
  const [subcategory, setSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProductsOpen, setIsProductsOpen] = useState(true);

  useEffect(() => {
    const fetchSubcategory = async () => {
      try {
        const response = await axios.get(
          `https://starfish-app-6q6ot.ondigitalocean.app/api/subcategories/get/${id}`
        );
        setSubcategory(response.data.data);
        console.log(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(
          "Failed to fetch subcategory details. Please try again later."
        );
        setLoading(false);
        console.error(err);
      }
    };
    fetchSubcategory();
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

  if (!subcategory) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Subcategory not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-6">
          <Link
            to="/subcategories"
            className="flex items-center hover:text-[#0c0b45] transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Subcategories
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">{subcategory.name}</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center mr-6 shadow-md">
                <span className="text-gray-600 text-3xl font-semibold">
                  {subcategory.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  {subcategory.name}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  ID: {subcategory._id}
                </p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#0c0b45] text-white">
                    <Package size={16} className="mr-2" />
                    {subcategory.products.length} Products
                  </span>
                  <Link
                    to={`/categories/${subcategory.category._id}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    Category: {subcategory.category.name}
                  </Link>
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
                  {formatDate(subcategory.createdAt)}
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
                  {formatDate(subcategory.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          <div
            className="p-6 flex justify-between items-center border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setIsProductsOpen(!isProductsOpen)}
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Products ({subcategory.products.length})
            </h2>
            {isProductsOpen ? (
              <ChevronUp size={20} className="text-gray-500" />
            ) : (
              <ChevronDown size={20} className="text-gray-500" />
            )}
          </div>
          {isProductsOpen && (
            <div className="overflow-x-auto">
              {subcategory.products.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subcategory.products.map((product) => (
                      <tr
                        key={product._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <Link
                            to={`/products/${product._id}`}
                            className="text-primary hover:text-blue-800 hover:underline"
                          >
                            {product.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(product.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <Package size={40} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">
                    No Products
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    This subcategory has no products yet.
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

export default SubcategoryDetails;
