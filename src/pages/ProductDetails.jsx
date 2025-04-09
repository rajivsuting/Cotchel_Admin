import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Loader2,
  Download,
  ToggleLeft,
  ToggleRight,
  Save,
  X,
  Copy,
  Star,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { format, formatDistanceToNow } from "date-fns"; // For human-readable dates

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [editableProduct, setEditableProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const themeColor = "#283e89"; // Your theme color

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://cotchel-server-tvye7.ondigitalocean.app/api/products/get/${id}`,
          { params: { populate: "category,subCategory,user,reviews" } }
        );

        const data = response.data.product;
        const productData = {
          id: data._id,
          title: data.title,
          description: data.description,
          images: data.images || [],
          featuredImage: data.featuredImage,
          category: data.category?.name || "Uncategorized",
          subCategory: data.subCategory?.name || "Uncategorized",
          quantityAvailable: data.quantityAvailable,
          price: data.price,
          compareAtPrice: data.compareAtPrice || "",
          keyHighLights: data.keyHighLights || [],
          brand: data.brand || "N/A",
          model: data.model || "N/A",
          seller: data.user?.fullName || "Unknown",
          isActive: data.isActive,
          ratings: data.ratings || 0,
          reviewsCount: data.reviewsCount || 0,
          reviews: data.reviews || [],
          lotSize: data.lotSize || "N/A",
          dimensions: {
            length: data.length || 0,
            breadth: data.breadth || 0,
            height: data.height || 0,
            weight: data.weight || 0,
          },
          sku: data.sku,
          fileAttachments: data.fileAttachments || [],
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
        setProduct(productData);
        setEditableProduct(productData);
        setError(null);
      } catch (err) {
        setError("Failed to load product details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(
          `https://cotchel-server-tvye7.ondigitalocean.app/api/products/${id}`
        );
        setSuccess("Product deleted successfully.");
        setTimeout(() => navigate("/products"), 1500);
      } catch (err) {
        setError("Failed to delete product.");
        console.error(err);
      }
    }
  };

  const handleToggleStatus = async () => {
    try {
      const response = await axios.patch(
        `https://cotchel-server-tvye7.ondigitalocean.app/api/products/${id}`,
        { isActive: !product.isActive }
      );
      setProduct((prev) => ({
        ...prev,
        isActive: response.data.product.isActive,
      }));
      setEditableProduct((prev) => ({
        ...prev,
        isActive: response.data.product.isActive,
      }));
      setSuccess(
        `Product ${
          response.data.product.isActive ? "activated" : "deactivated"
        } successfully.`
      );
    } catch (err) {
      setError("Failed to update status.");
      console.error(err);
    }
  };

  const handleFieldUpdate = async (field) => {
    try {
      const updateData = { [field]: editableProduct[field] };
      await axios.patch(
        `https://cotchel-server-tvye7.ondigitalocean.app/api/products/${id}`,
        updateData
      );
      setProduct((prev) => ({ ...prev, [field]: editableProduct[field] }));
      setEditingField(null);
      setSuccess(
        `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } updated successfully.`
      );
    } catch (err) {
      setError(`Failed to update ${field}.`);
      console.error(err);
    }
  };

  const handleDuplicate = async () => {
    try {
      const { id, createdAt, updatedAt, reviews, ...duplicateData } = product;
      duplicateData.sku = `${duplicateData.sku}-COPY-${Date.now()
        .toString()
        .slice(-4)}`;
      duplicateData.title = `${duplicateData.title} (Copy)`;
      const response = await axios.post(
        `https://cotchel-server-tvye7.ondigitalocean.app/api/products`,
        duplicateData
      );
      setSuccess("Product duplicated successfully.");
      setTimeout(
        () => navigate(`/products/edit/${response.data.product._id}`),
        1500
      );
    } catch (err) {
      setError("Failed to duplicate product.");
      console.error(err);
    }
  };

  const handleDeleteImage = async (index) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        const updatedImages = [...product.images];
        updatedImages.splice(index, 1);
        await axios.patch(
          `https://cotchel-server-tvye7.ondigitalocean.app/api/products/${id}`,
          { images: updatedImages }
        );
        setProduct((prev) => ({ ...prev, images: updatedImages }));
        setEditableProduct((prev) => ({ ...prev, images: updatedImages }));
        setSuccess("Image deleted successfully.");
        if (selectedImage >= updatedImages.length)
          setSelectedImage(updatedImages.length - 1);
      } catch (err) {
        setError("Failed to delete image.");
        console.error(err);
      }
    }
  };

  // Function to format dates human-readably
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays < 7) {
      return formatDistanceToNow(date, { addSuffix: true }); // e.g., "2 days ago"
    } else {
      return format(date, "d MMMM yyyy"); // e.g., "7 March 2025"
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Skeleton Header */}
          <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center space-x-4">
              <Skeleton circle width={40} height={40} />
              <div>
                <Skeleton width={200} height={24} />
                <Skeleton width={100} height={16} />
              </div>
            </div>
            <div className="flex space-x-3">
              <Skeleton width={100} height={36} />
              <Skeleton width={100} height={36} />
              <Skeleton width={100} height={36} />
            </div>
          </div>

          {/* Skeleton Content */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Skeleton Images */}
              <div className="space-y-4">
                <Skeleton width={100} height={24} />
                <Skeleton height={256} />
                <div className="flex space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} width={80} height={80} />
                  ))}
                </div>
              </div>

              {/* Skeleton Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[...Array(10)].map((_, i) => (
                    <div key={i}>
                      <Skeleton width={80} height={16} />
                      <Skeleton width={120} height={20} />
                    </div>
                  ))}
                </div>
                <div>
                  <Skeleton width={120} height={16} />
                  <Skeleton width={200} height={20} />
                </div>
              </div>
            </div>

            {/* Skeleton Additional Sections */}
            <div className="mt-8 space-y-8 border-t border-gray-200 pt-8">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <Skeleton width={150} height={24} />
                  <Skeleton count={3} height={20} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center border border-gray-200">
          <p className="text-red-600 mb-4 font-medium">
            {error || "Product not found"}
          </p>
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const allImages = [product.featuredImage, ...product.images];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Notifications */}
        {(success || error) && (
          <div
            className={`mb-6 p-4 rounded-lg shadow-sm flex justify-between items-center ${
              success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
            }`}
          >
            <span>{success || error}</span>
            <button
              onClick={() => (success ? setSuccess(null) : setError(null))}
              className="text-current opacity-75 hover:opacity-100"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/products")}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1
                className="text-2xl font-semibold"
                style={{ color: themeColor }}
              >
                {product.title}
              </h1>
              <p className="text-sm text-gray-500">SKU: {product.sku}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleToggleStatus}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors duration-200 ${
                product.isActive
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {product.isActive ? (
                <ToggleRight size={18} className="mr-2" />
              ) : (
                <ToggleLeft size={18} className="mr-2" />
              )}
              {product.isActive ? "Deactivate" : "Activate"}
            </button>

            <button
              onClick={() => navigate(`/products/edit/${id}`)}
              className="flex items-center px-4 py-2 text-white rounded-md hover:bg-blue-900 text-sm font-medium shadow-sm transition-colors duration-200"
              style={{ backgroundColor: themeColor }}
            >
              <Edit size={18} className="mr-2" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium shadow-sm transition-colors duration-200"
            >
              <Trash2 size={18} className="mr-2" />
              Delete
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Images */}
            <div className="space-y-4">
              <h2
                className="text-lg font-semibold"
                style={{ color: themeColor }}
              >
                Images
              </h2>
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-md border border-gray-200 shadow-sm">
                  <img
                    src={allImages[selectedImage]}
                    alt={product.title}
                    className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {allImages.map((img, index) => (
                    <div key={index} className="relative flex-shrink-0">
                      <img
                        src={img}
                        alt={`${product.title} ${index + 1}`}
                        className={`w-20 h-20 object-cover rounded-md border cursor-pointer transition-all duration-200 ${
                          selectedImage === index
                            ? `border-2 shadow-md`
                            : "border-gray-200 hover:shadow-md"
                        }`}
                        style={{
                          borderColor:
                            selectedImage === index ? themeColor : undefined,
                        }}
                        onClick={() => setSelectedImage(index)}
                      />
                      {/* {index !== 0 && (
                        <button
                          onClick={() => handleDeleteImage(index - 1)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                          title="Delete this image"
                        >
                          <X size={12} />
                        </button>
                      )} */}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Price
                  </label>
                  {editingField === "price" ? (
                    <div className="flex items-center space-x-2 mt-1">
                      <input
                        type="number"
                        value={editableProduct.price}
                        onChange={(e) =>
                          setEditableProduct((prev) => ({
                            ...prev,
                            price: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                        style={{ focusRingColor: themeColor }}
                        min="0"
                        step="0.01"
                      />
                      <button
                        onClick={() => handleFieldUpdate("price")}
                        className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="p-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors duration-200"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <p
                      className="mt-1 text-gray-900 font-semibold cursor-pointer hover:text-[themeColor] transition-colors duration-200"
                      style={{ "--themeColor": themeColor }}
                      onClick={() => setEditingField("price")}
                    >
                      ${product.price.toFixed(2)}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Compare At Price
                  </label>
                  {editingField === "compareAtPrice" ? (
                    <div className="flex items-center space-x-2 mt-1">
                      <input
                        type="number"
                        value={editableProduct.compareAtPrice}
                        onChange={(e) =>
                          setEditableProduct((prev) => ({
                            ...prev,
                            compareAtPrice: parseFloat(e.target.value) || "",
                          }))
                        }
                        className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                        style={{ focusRingColor: themeColor }}
                        min="0"
                        step="0.01"
                      />
                      <button
                        onClick={() => handleFieldUpdate("compareAtPrice")}
                        className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="p-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors duration-200"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <p
                      className="mt-1 text-gray-900 font-semibold cursor-pointer hover:text-[themeColor] transition-colors duration-200"
                      style={{ "--themeColor": themeColor }}
                      onClick={() => setEditingField("compareAtPrice")}
                    >
                      {product.compareAtPrice
                        ? `$${product.compareAtPrice.toFixed(2)}`
                        : "N/A"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Stock
                  </label>
                  {editingField === "quantityAvailable" ? (
                    <div className="flex items-center space-x-2 mt-1">
                      <input
                        type="number"
                        value={editableProduct.quantityAvailable}
                        onChange={(e) =>
                          setEditableProduct((prev) => ({
                            ...prev,
                            quantityAvailable: parseInt(e.target.value) || 0,
                          }))
                        }
                        className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                        style={{ focusRingColor: themeColor }}
                        min="0"
                      />
                      <button
                        onClick={() => handleFieldUpdate("quantityAvailable")}
                        className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="p-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors duration-200"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <p
                      className={`mt-1 font-semibold cursor-pointer hover:text-[themeColor] transition-colors duration-200 ${
                        product.quantityAvailable > 50
                          ? "text-green-600"
                          : product.quantityAvailable > 0
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                      style={{ "--themeColor": themeColor }}
                      onClick={() => setEditingField("quantityAvailable")}
                    >
                      {product.quantityAvailable} units
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Ratings
                  </label>
                  <p className="mt-1 text-gray-600">
                    {product.ratings.toFixed(1)} ({product.reviewsCount}{" "}
                    reviews)
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <p className="mt-1 text-gray-600">{product.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Subcategory
                  </label>
                  <p className="mt-1 text-gray-600">{product.subCategory}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Brand
                  </label>
                  <p className="mt-1 text-gray-600">{product.brand}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Model
                  </label>
                  <p className="mt-1 text-gray-600">{product.model}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Seller
                  </label>
                  <p className="mt-1 text-gray-600">{product.seller}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Lot Size
                  </label>
                  <p className="mt-1 text-gray-600">{product.lotSize}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Dimensions & Weight
                </label>
                <p className="mt-1 text-gray-600">
                  {product.dimensions.length} x {product.dimensions.breadth} x{" "}
                  {product.dimensions.height} cm, {product.dimensions.weight} kg
                </p>
              </div>
            </div>
          </div>

          {/* Additional Sections */}
          <div className="mt-8 space-y-8 border-t border-gray-200 pt-8">
            {product.description && (
              <div>
                <h2
                  className="text-lg font-semibold"
                  style={{ color: themeColor }}
                >
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {product.keyHighLights.length > 0 && (
              <div>
                <h2
                  className="text-lg font-semibold"
                  style={{ color: themeColor }}
                >
                  Key Highlights
                </h2>
                <ul className="space-y-2">
                  {product.keyHighLights.map((highlight, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <span
                        className="w-2 h-2 rounded-full mr-3"
                        style={{ backgroundColor: themeColor }}
                      ></span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.fileAttachments.length > 0 && (
              <div>
                <h2
                  className="text-lg font-semibold"
                  style={{ color: themeColor }}
                >
                  Attachments
                </h2>
                <div className="space-y-3">
                  {product.fileAttachments.map((file, index) => (
                    <a
                      key={index}
                      href={file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-200"
                      style={{ color: themeColor }}
                    >
                      <span className="flex items-center">
                        <Download size={18} className="mr-2" />
                        {file.split("/").pop()}
                      </span>
                      <span className="text-sm text-gray-500">Download</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {product.reviews.length > 0 && (
              <div>
                <h2
                  className="text-lg font-semibold"
                  style={{ color: themeColor }}
                >
                  Reviews
                </h2>
                <div className="space-y-4">
                  {product.reviews.map((review) => (
                    <div
                      key={review._id}
                      className="p-4 bg-gray-50 rounded-md border border-gray-200 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < review.rating
                                  ? "text-[#28a746] fill-current"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      <p className="mt-1 text-sm text-gray-600">
                        — {review.user.fullName}
                      </p>
                    </div>
                  ))}
                  {product.reviewsCount > product.reviews.length && (
                    <p className="text-sm text-gray-500 italic">
                      Showing {product.reviews.length} of {product.reviewsCount}{" "}
                      reviews.
                    </p>
                  )}
                </div>
              </div>
            )}

            <div>
              <h2
                className="text-lg font-semibold"
                style={{ color: themeColor }}
              >
                Metadata
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Product ID
                  </label>
                  <p className="mt-1 text-gray-600">{product.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Created
                  </label>
                  <p className="mt-1 text-gray-600">
                    {formatDate(product.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Last Updated
                  </label>
                  <p className="mt-1 text-gray-600">
                    {formatDate(product.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
