import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Save,
  Loader2,
  X,
  Upload,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [product, setProduct] = useState({
    title: "",
    description: "",
    images: [],
    featuredImage: "",
    category: "",
    categoryName: "",
    subCategory: "",
    subCategoryName: "",
    quantityAvailable: 0,
    price: 0,
    compareAtPrice: "",
    keyHighLights: [],
    brand: "",
    model: "",
    lotSize: "",
    length: 0,
    breadth: 0,
    height: 0,
    weight: 0,
    sku: "",
    fileAttachments: [],
  });

  const themeColor = "#283e89";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch product data
        const productResponse = await axios.get(
          `https://cotchel-server-tvye7.ondigitalocean.app/api/products/get/${id}`,
          { params: { populate: "category,subCategory" } }
        );

        const data = productResponse.data.product;
        // console.log("Product Data:", data);

        // Fetch categories first
        const categoriesResponse = await axios.get(
          "https://cotchel-server-tvye7.ondigitalocean.app/api/categories/all"
        );
        console.log("Categories Response:", categoriesResponse.data);

        if (
          categoriesResponse.data.data &&
          Array.isArray(categoriesResponse.data.data)
        ) {
          setCategories(categoriesResponse.data.data);

          // If product has a category, set subcategories from the category data
          if (data.category && data.category.subCategories) {
            setSubCategories(data.category.subCategories);
          }
        }

        // Set product data
        setProduct({
          title: data.title,
          description: data.description,
          images: data.images || [],
          featuredImage: data.featuredImage,
          category: data.category?._id || "",
          categoryName: data.category?.name || "",
          subCategory: data.subCategory?._id || "",
          subCategoryName: data.subCategory?.name || "",
          quantityAvailable: data.quantityAvailable,
          price: data.price,
          compareAtPrice: data.compareAtPrice || "",
          keyHighLights: data.keyHighLights || [],
          brand: data.brand || "",
          model: data.model || "",
          lotSize: data.lotSize || "",
          length: data.length || 0,
          breadth: data.breadth || 0,
          height: data.height || 0,
          weight: data.weight || 0,
          sku: data.sku,
          fileAttachments: data.fileAttachments || [],
        });

        setError(null);
      } catch (err) {
        setError("Failed to load product data.");
        console.error("Error fetching data:", err);
        setCategories([]);
        setSubCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Add useEffect to log state changes
  useEffect(() => {
    console.log("Current Product State:", product);
    console.log("Current Categories:", categories);
    console.log("Current SubCategories:", subCategories);
  }, [product, categories, subCategories]);

  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    const selectedCategory = categories.find((cat) => cat._id === categoryId);

    setProduct((prev) => ({
      ...prev,
      category: categoryId,
      categoryName: selectedCategory?.name || "",
      subCategory: "", // Reset subcategory when category changes
      subCategoryName: "",
    }));

    if (categoryId && selectedCategory) {
      try {
        const response = await axios.get(
          `https://cotchel-server-tvye7.ondigitalocean.app/api/subcategories/${categoryId}`
        );
        if (response.data && Array.isArray(response.data.subCategories)) {
          setSubCategories(response.data.subCategories);
        } else if (selectedCategory.subCategories) {
          // Use subcategories from the category data if API call fails
          setSubCategories(selectedCategory.subCategories);
        } else {
          setSubCategories([]);
        }
      } catch (err) {
        console.error("Failed to fetch subcategories:", err);
        // Fallback to category's subcategories if available
        if (selectedCategory.subCategories) {
          setSubCategories(selectedCategory.subCategories);
        } else {
          setSubCategories([]);
        }
      }
    } else {
      setSubCategories([]);
    }
  };

  const handleSubCategoryChange = (e) => {
    const subCategoryId = e.target.value;
    const selectedSubCategory = subCategories.find(
      (subCat) => subCat._id === subCategoryId
    );

    setProduct((prev) => ({
      ...prev,
      subCategory: subCategoryId,
      subCategoryName: selectedSubCategory?.name || "",
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post(
        "https://cotchel-server-tvye7.ondigitalocean.app/api/image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newImages = response.data.imageUrls;
      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    } catch (err) {
      setError("Failed to upload images.");
      console.error(err);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(
        "https://cotchel-server-tvye7.ondigitalocean.app/api/image/upload-file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newFiles = response.data.fileUrls;
      setProduct((prev) => ({
        ...prev,
        fileAttachments: [...prev.fileAttachments, ...newFiles],
      }));
    } catch (err) {
      setError("Failed to upload files.");
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put(
        `https://cotchel-server-tvye7.ondigitalocean.app/api/products/${id}`,
        product
      );
      setSuccess("Product updated successfully!");
      setTimeout(() => navigate(`/products/${id}`), 1500);
    } catch (err) {
      setError("Failed to update product.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddKeyHighlight = () => {
    setProduct((prev) => ({
      ...prev,
      keyHighLights: [...prev.keyHighLights, ""],
    }));
  };

  const handleRemoveKeyHighlight = (index) => {
    setProduct((prev) => ({
      ...prev,
      keyHighLights: prev.keyHighLights.filter((_, i) => i !== index),
    }));
  };

  const handleKeyHighlightChange = (index, value) => {
    setProduct((prev) => ({
      ...prev,
      keyHighLights: prev.keyHighLights.map((highlight, i) =>
        i === index ? value : highlight
      ),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2
          className="w-8 h-8 animate-spin"
          style={{ color: themeColor }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/products/${id}`)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <ArrowLeft size={24} />
            </button>
            <h1
              className="text-2xl font-semibold"
              style={{ color: themeColor }}
            >
              Edit Product
            </h1>
          </div>
        </div>

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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: themeColor }}
            >
              Basic Information
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={product.title}
                  onChange={(e) =>
                    setProduct((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={product.description}
                  onChange={(e) =>
                    setProduct((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category{" "}
                    {product.categoryName &&
                      `(Current: ${product.categoryName})`}
                  </label>
                  <select
                    value={product.category}
                    onChange={handleCategoryChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {Array.isArray(categories) &&
                      categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Subcategory{" "}
                    {product.subCategoryName &&
                      `(Current: ${product.subCategoryName})`}
                  </label>
                  <select
                    value={product.subCategory}
                    onChange={handleSubCategoryChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    disabled={!product.category}
                  >
                    <option value="">Select Subcategory</option>
                    {Array.isArray(subCategories) &&
                      subCategories.map((subCategory) => (
                        <option key={subCategory._id} value={subCategory._id}>
                          {subCategory.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: themeColor }}
            >
              Pricing & Inventory
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) =>
                      setProduct((prev) => ({
                        ...prev,
                        price: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="block w-full pl-7 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Compare at Price
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    value={product.compareAtPrice}
                    onChange={(e) =>
                      setProduct((prev) => ({
                        ...prev,
                        compareAtPrice: e.target.value
                          ? parseFloat(e.target.value)
                          : "",
                      }))
                    }
                    className="block w-full pl-7 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity Available
                </label>
                <input
                  type="number"
                  value={product.quantityAvailable}
                  onChange={(e) =>
                    setProduct((prev) => ({
                      ...prev,
                      quantityAvailable: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SKU
                </label>
                <input
                  type="text"
                  value={product.sku}
                  onChange={(e) =>
                    setProduct((prev) => ({ ...prev, sku: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: themeColor }}
            >
              Product Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Brand
                </label>
                <input
                  type="text"
                  value={product.brand}
                  onChange={(e) =>
                    setProduct((prev) => ({ ...prev, brand: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Model
                </label>
                <input
                  type="text"
                  value={product.model}
                  onChange={(e) =>
                    setProduct((prev) => ({ ...prev, model: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Lot Size
                </label>
                <input
                  type="text"
                  value={product.lotSize}
                  onChange={(e) =>
                    setProduct((prev) => ({ ...prev, lotSize: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dimensions & Weight
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-gray-500">
                    Length (cm)
                  </label>
                  <input
                    type="number"
                    value={product.length}
                    onChange={(e) =>
                      setProduct((prev) => ({
                        ...prev,
                        length: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">
                    Breadth (cm)
                  </label>
                  <input
                    type="number"
                    value={product.breadth}
                    onChange={(e) =>
                      setProduct((prev) => ({
                        ...prev,
                        breadth: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={product.height}
                    onChange={(e) =>
                      setProduct((prev) => ({
                        ...prev,
                        height: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={product.weight}
                    onChange={(e) =>
                      setProduct((prev) => ({
                        ...prev,
                        weight: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Key Highlights */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-lg font-semibold"
                style={{ color: themeColor }}
              >
                Key Highlights
              </h2>
              <button
                type="button"
                onClick={handleAddKeyHighlight}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-white rounded-md transition-colors duration-200"
                style={{ backgroundColor: themeColor }}
              >
                <Plus size={16} className="mr-1" />
                Add Highlight
              </button>
            </div>
            <div className="space-y-3">
              {product.keyHighLights.map((highlight, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) =>
                      handleKeyHighlightChange(index, e.target.value)
                    }
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter a key highlight"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyHighlight(index)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                  >
                    <Minus size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: themeColor }}
            >
              Images
            </h2>
            <div className="space-y-4">
              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                <div className="relative">
                  {product.featuredImage ? (
                    <div className="relative group">
                      <img
                        src={product.featuredImage}
                        alt="Featured"
                        className="w-full h-64 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setProduct((prev) => ({ ...prev, featuredImage: "" }))
                        }
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors duration-200 cursor-pointer">
                      <div className="text-center">
                        <Upload size={24} className="mx-auto text-gray-400" />
                        <span className="mt-2 block text-sm text-gray-600">
                          Upload Featured Image
                        </span>
                      </div>
                      <input
                        type="file"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const formData = new FormData();
                            formData.append("images", file);
                            try {
                              const response = await axios.post(
                                "https://cotchel-server-tvye7.ondigitalocean.app/api/image/upload",
                                formData,
                                {
                                  headers: {
                                    "Content-Type": "multipart/form-data",
                                  },
                                }
                              );
                              if (
                                response.data.imageUrls &&
                                response.data.imageUrls.length > 0
                              ) {
                                setProduct((prev) => ({
                                  ...prev,
                                  featuredImage: response.data.imageUrls[0],
                                }));
                              }
                            } catch (err) {
                              setError("Failed to upload featured image.");
                              console.error(err);
                            }
                          }
                        }}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Additional Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Images
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setProduct((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index),
                          }));
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <label className="relative flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors duration-200 cursor-pointer">
                    <div className="text-center">
                      <Upload size={24} className="mx-auto text-gray-400" />
                      <span className="mt-2 block text-sm text-gray-600">
                        Add Image
                      </span>
                    </div>
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                      multiple
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Files */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: themeColor }}
            >
              File Attachments
            </h2>
            <div className="space-y-3">
              {product.fileAttachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <span className="text-sm text-gray-600">
                    {file.split("/").pop()}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setProduct((prev) => ({
                        ...prev,
                        fileAttachments: prev.fileAttachments.filter(
                          (_, i) => i !== index
                        ),
                      }))
                    }
                    className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors duration-200 cursor-pointer">
                <div className="text-center">
                  <Upload size={24} className="mx-auto text-gray-400" />
                  <span className="mt-2 block text-sm text-gray-600">
                    Upload Files
                  </span>
                </div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  multiple
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/products/${id}`)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center px-6 py-2 text-white rounded-md transition-colors duration-200"
              style={{ backgroundColor: themeColor }}
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
