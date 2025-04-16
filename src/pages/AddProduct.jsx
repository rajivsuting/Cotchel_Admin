import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Image as ImageIcon,
  FileText,
  Loader2,
  Check,
  X,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";

const colors = {
  primary: "#2563eb",
  secondary: "#4f46e5",
  error: "#dc2626",
  text: "#1f2937",
  border: "#d1d5db",
  background: "#f9fafb",
};

export const useDropdown = (items, options = {}) => {
  const { singleSelect = false } = options;
  const [input, setInput] = useState("");
  const [filteredItems, setFilteredItems] = useState(items || []);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [matchedItem, setMatchedItem] = useState(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const resetSelection = () => setSelectedItems([]);
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    if (value) {
      const filtered = items.filter(
        (item) =>
          item.name.toLowerCase().includes(value.toLowerCase()) &&
          !selectedItems.some((selected) => selected._id === item._id)
      );
      setFilteredItems(filtered);
      setMatchedItem(filtered[0] || null);
    } else {
      setFilteredItems(items.filter((item) => !selectedItems.includes(item)));
      setMatchedItem(null);
    }
  };

  const handleSelectItem = (item) => {
    if (singleSelect) setSelectedItems([item]);
    else if (!selectedItems.find((selected) => selected._id === item._id))
      setSelectedItems((prev) => [...prev, item]);
    setInput("");
    setShowDropdown(false);
    setMatchedItem(null);
    inputRef.current?.blur();
  };

  const handleRemoveItem = (itemToRemove) =>
    setSelectedItems((prev) =>
      prev.filter((item) => item._id !== itemToRemove._id)
    );

  const handleFocus = () => {
    setShowDropdown(true);
    setFilteredItems(
      items.filter(
        (item) => !selectedItems.some((selected) => selected._id === item._id)
      )
    );
  };

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target))
      setShowDropdown(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return {
    input,
    filteredItems,
    selectedItems,
    showDropdown,
    matchedItem,
    setShowDropdown,
    handleInputChange,
    handleSelectItem,
    handleRemoveItem,
    handleFocus,
    inputRef,
    dropdownRef,
    resetSelection,
  };
};

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [productTitle, setProductTitle] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [quantityAvailable, setQuantityAvailable] = useState("");
  const [highlights, setHighlights] = useState([""]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [description, setDescription] = useState("");
  const [lotSize, setLotSize] = useState("");
  const [length, setLength] = useState("");
  const [breadth, setBreadth] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [loading, setLoading] = useState(false);
  const textAreaRefs = useRef([]);
  const categoryDropdown = useDropdown(categories, { singleSelect: true });
  const subcategoryDropdown = useDropdown(subcategories, {
    singleSelect: true,
  });
  const [isDraggingFeatured, setIsDraggingFeatured] = useState(false);
  const [isDraggingImages, setIsDraggingImages] = useState(false);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [uploadLoading, setUploadLoading] = useState({
    featured: false,
    images: false,
    files: false,
  });
  const [uploadError, setUploadError] = useState({
    featured: null,
    images: null,
    files: null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "https://cotchel-server-tvye7.ondigitalocean.app/api/categories/all"
        );
        setCategories(res.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (categoryDropdown.selectedItems.length > 0) {
        try {
          const categoryId = categoryDropdown.selectedItems[0]._id;
          const res = await axios.get(
            `https://cotchel-server-tvye7.ondigitalocean.app/api/subcategories/${categoryId}`
          );
          setSubcategories(res.data.data || []);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      }
    };
    fetchSubcategories();
  }, [categoryDropdown.selectedItems]);

  const handleKeyDownKeyHighlight = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const updatedHighlights = [...highlights];
      updatedHighlights.splice(index + 1, 0, "");
      setHighlights(updatedHighlights);
      setTimeout(() => textAreaRefs.current[index + 1]?.focus(), 0);
    }
    if (
      e.key === "Backspace" &&
      highlights[index] === "" &&
      highlights.length > 1
    ) {
      e.preventDefault();
      const updatedHighlights = [...highlights];
      updatedHighlights.splice(index, 1);
      setHighlights(updatedHighlights);
      setTimeout(
        () => index > 0 && textAreaRefs.current[index - 1]?.focus(),
        0
      );
    }
  };

  const handleChangeKeyHighlight = (e, index) => {
    const updatedHighlights = [...highlights];
    updatedHighlights[index] = e.target.value;
    setHighlights(updatedHighlights);
  };

  const handleNumericInput = (setter) => (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) setter(value);
  };

  const validateFile = (file, type = "image") => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return "File size should be less than 10MB";
    }

    if (type === "image") {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        return "Only JPG, PNG and GIF files are allowed";
      }
    } else {
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];
      if (!validTypes.includes(file.type)) {
        return "Only XLS, CSV, PDF, DOC, DOCX, PPT, PPTX files are allowed";
      }
    }

    return null;
  };

  const handleFeaturedImage = async (file) => {
    if (!file) return;

    const error = validateFile(file, "image");
    if (error) {
      setUploadError((prev) => ({ ...prev, featured: error }));
      return;
    }

    setUploadLoading((prev) => ({ ...prev, featured: true }));
    setUploadError((prev) => ({ ...prev, featured: null }));

    const formData = new FormData();
    formData.append("images", file);

    try {
      const response = await axios.post(
        "https://cotchel-server-tvye7.ondigitalocean.app/api/image/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setFeaturedImage(response.data.imageUrls[0]);
      toast.success("Featured image uploaded successfully");
    } catch (error) {
      console.error("Error uploading featured image:", error);
      setUploadError((prev) => ({
        ...prev,
        featured: error.response?.data?.message || "Error uploading image",
      }));
      toast.error("Failed to upload featured image");
    } finally {
      setUploadLoading((prev) => ({ ...prev, featured: false }));
    }
  };

  const handleImageUpload = async (files) => {
    if (uploadedImages.length + files.length > 10) {
      setUploadError((prev) => ({
        ...prev,
        images: "Maximum 10 images allowed",
      }));
      return;
    }

    for (const file of files) {
      const error = validateFile(file, "image");
      if (error) {
        setUploadError((prev) => ({ ...prev, images: error }));
        return;
      }
    }

    setUploadLoading((prev) => ({ ...prev, images: true }));
    setUploadError((prev) => ({ ...prev, images: null }));

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("images", file));

    try {
      const response = await axios.post(
        "https://cotchel-server-tvye7.ondigitalocean.app/api/image/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setUploadedImages((prev) => [...prev, ...response.data.imageUrls]);
      toast.success(
        `${files.length} image${
          files.length === 1 ? "" : "s"
        } uploaded successfully`
      );
    } catch (error) {
      console.error("Error uploading images:", error);
      setUploadError((prev) => ({
        ...prev,
        images: error.response?.data?.message || "Error uploading images",
      }));
      toast.error("Failed to upload images");
    } finally {
      setUploadLoading((prev) => ({ ...prev, images: false }));
    }
  };

  const handleFilesUpload = async (files) => {
    for (const file of files) {
      const error = validateFile(file, "document");
      if (error) {
        setUploadError((prev) => ({ ...prev, files: error }));
        return;
      }
    }

    setUploadLoading((prev) => ({ ...prev, files: true }));
    setUploadError((prev) => ({ ...prev, files: null }));

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      const response = await axios.post(
        "https://cotchel-server-tvye7.ondigitalocean.app/api/image/upload-file",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setUploadedFiles((prev) => [...prev, ...response.data.fileUrls]);
      toast.success(
        `${files.length} file${
          files.length === 1 ? "" : "s"
        } uploaded successfully`
      );
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadError((prev) => ({
        ...prev,
        files: error.response?.data?.message || "Error uploading files",
      }));
      toast.error("Failed to upload files");
    } finally {
      setUploadLoading((prev) => ({ ...prev, files: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;
    setLoading(true);

    const productData = {
      title: productTitle,
      description,
      images: uploadedImages,
      category: categoryDropdown.selectedItems[0]._id,
      subCategory: subcategoryDropdown.selectedItems[0]._id,
      quantityAvailable,
      price,
      compareAtPrice,
      files: uploadedFiles,
      featuredImage,
      keyHighLights: highlights,
      model,
      brand,
      lotSize,
      length,
      breadth,
      height,
      weight,
    };

    try {
      await axios.post(
        "https://cotchel-server-tvye7.ondigitalocean.app/api/products",
        productData
      );
      toast.success("Product created successfully!");
      setProductTitle("");
      setDescription("");
      setUploadedImages([]);
      setUploadedFiles([]);
      setQuantityAvailable("");
      setPrice("");
      setCompareAtPrice("");
      setHighlights([""]);
      setBrand("");
      setModel("");
      setLotSize("");
      setLength("");
      setBreadth("");
      setHeight("");
      setWeight("");
      setFeaturedImage("");
      categoryDropdown.resetSelection();
      subcategoryDropdown.resetSelection();
    } catch (error) {
      toast.error("Failed to create product. Please try again.");
      console.error("Error creating product:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOverFeatured = (e) => {
    e.preventDefault();
    setIsDraggingFeatured(true);
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDragLeaveFeatured = (e) => {
    e.preventDefault();
    setIsDraggingFeatured(false);
  };

  const handleDragOverImages = (e) => {
    e.preventDefault();
    setIsDraggingImages(true);
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDragLeaveImages = (e) => {
    e.preventDefault();
    setIsDraggingImages(false);
  };

  const handleDragOverFiles = (e) => {
    e.preventDefault();
    setIsDraggingFiles(true);
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDragLeaveFiles = (e) => {
    e.preventDefault();
    setIsDraggingFiles(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingImages(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleImageUpload(files);
  };

  const getFileType = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    switch (ext) {
      case "xls":
      case "xlsx":
        return "Excel Spreadsheet";
      case "csv":
        return "CSV File";
      case "pdf":
        return "PDF Document";
      case "doc":
      case "docx":
        return "Word Document";
      case "ppt":
      case "pptx":
        return "PowerPoint Presentation";
      default:
        return "Document";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              Add New Product
            </h1>
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Basic Information */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Product Title"
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    error={errors.productTitle}
                    required
                    placeholder="Enter product title"
                  />
                  <DropdownInput
                    label="Category"
                    dropdown={categoryDropdown}
                    singleSelect
                    error={errors.category}
                  />
                  <DropdownInput
                    label="Subcategory"
                    dropdown={subcategoryDropdown}
                    singleSelect
                    error={errors.subcategory}
                  />
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Pricing & Inventory
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Price"
                    type="number"
                    value={price}
                    onChange={handleNumericInput(setPrice)}
                    error={errors.price}
                    required
                    placeholder="e.g., 99.99"
                  />
                  <InputField
                    label="Compare at Price"
                    type="number"
                    value={compareAtPrice}
                    onChange={handleNumericInput(setCompareAtPrice)}
                    error={errors.compareAtPrice}
                    required
                    placeholder="e.g., 129.99"
                  />
                  <InputField
                    label="Quantity Available"
                    type="number"
                    value={quantityAvailable}
                    onChange={handleNumericInput(setQuantityAvailable)}
                    error={errors.quantityAvailable}
                    required
                    placeholder="e.g., 100"
                  />
                  <InputField
                    label="Lot Size"
                    type="number"
                    value={lotSize}
                    onChange={handleNumericInput(setLotSize)}
                    error={errors.lotSize}
                    required
                    placeholder="e.g., 10"
                  />
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Product Details
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Key Highlights <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      {highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start">
                          <span className="text-blue-600 mr-3 mt-2">•</span>
                          <textarea
                            className="w-full bg-transparent resize-none border-b border-gray-300 focus:border-blue-500 focus:outline-none placeholder-gray-400 text-gray-700 py-1 transition-all duration-200"
                            ref={(el) => (textAreaRefs.current[index] = el)}
                            value={highlight}
                            onChange={(e) => handleChangeKeyHighlight(e, index)}
                            onKeyDown={(e) =>
                              handleKeyDownKeyHighlight(e, index)
                            }
                            rows={1}
                            placeholder={
                              index === highlights.length - 1
                                ? "Add a highlight"
                                : ""
                            }
                            aria-label={`Highlight ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                    {errors.highlights && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.highlights}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Brand"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      error={errors.brand}
                      required
                      placeholder="e.g., Nike"
                    />
                    <InputField
                      label="Model"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      error={errors.model}
                      required
                      placeholder="e.g., Air Max"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Description{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-4 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      rows={6}
                      placeholder="Describe your product in detail..."
                      aria-label="Product Description"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.description}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Length (mm)"
                      type="number"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      error={errors.length}
                      required
                      placeholder="e.g., 200"
                    />
                    <InputField
                      label="Breadth (mm)"
                      type="number"
                      value={breadth}
                      onChange={(e) => setBreadth(e.target.value)}
                      error={errors.breadth}
                      required
                      placeholder="e.g., 150"
                    />
                    <InputField
                      label="Height (mm)"
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      error={errors.height}
                      required
                      placeholder="e.g., 100"
                    />
                    <InputField
                      label="Weight (gm)"
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      error={errors.weight}
                      required
                      placeholder="e.g., 500"
                    />
                  </div>
                </div>
              </div>

              {/* Media & Files */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Media & Files
                </h2>
                <div className="space-y-8">
                  {/* Media Upload Section */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-8">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Media Upload
                      </h3>
                      <div className="text-sm text-gray-500">
                        All images should be at least 1000x1000px
                      </div>
                    </div>

                    {/* Featured Image Upload */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-medium text-gray-700">
                          Featured Image <span className="text-red-500">*</span>
                        </label>
                        <span className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div
                          className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer min-h-[200px] ${
                            isDraggingFeatured
                              ? "border-indigo-500 bg-indigo-50"
                              : uploadError.featured
                              ? "border-red-200 bg-red-50/30"
                              : featuredImage
                              ? "border-emerald-200 bg-emerald-50/30"
                              : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30"
                          }`}
                          onDragOver={handleDragOverFeatured}
                          onDragLeave={handleDragLeaveFeatured}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDraggingFeatured(false);
                            handleFeaturedImage(e.dataTransfer.files[0]);
                          }}
                          onClick={() =>
                            document
                              .getElementById("featured-image-upload")
                              .click()
                          }
                        >
                          <input
                            id="featured-image-upload"
                            type="file"
                            className="sr-only"
                            onChange={(e) =>
                              handleFeaturedImage(e.target.files[0])
                            }
                            aria-label="Upload featured image"
                          />
                          {!featuredImage ? (
                            <>
                              <div className="mb-4 p-4 bg-indigo-50 rounded-full">
                                <ImageIcon className="w-8 h-8 text-indigo-500" />
                              </div>
                              <p className="text-sm font-medium text-gray-700">
                                Drop your featured image here
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                or click to browse files
                              </p>
                            </>
                          ) : (
                            <div className="absolute inset-4 rounded-lg overflow-hidden group">
                              <img
                                src={featuredImage}
                                alt="Featured Preview"
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFeaturedImage("");
                                  }}
                                  className="bg-white/10 backdrop-blur-sm text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/20 transition-colors duration-200"
                                >
                                  Replace Image
                                </button>
                              </div>
                            </div>
                          )}
                          {uploadLoading.featured && (
                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-4">
                          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                            <h4 className="text-sm font-medium text-amber-800 mb-2">
                              Image Guidelines
                            </h4>
                            <ul className="space-y-2 text-xs text-amber-700">
                              <li className="flex items-center">
                                <Check className="w-4 h-4 mr-2 text-amber-500" />
                                Minimum resolution: 1000x1000px
                              </li>
                              <li className="flex items-center">
                                <Check className="w-4 h-4 mr-2 text-amber-500" />
                                Use a white or transparent background
                              </li>
                              <li className="flex items-center">
                                <Check className="w-4 h-4 mr-2 text-amber-500" />
                                Keep file size under 10MB
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      {uploadError.featured && (
                        <p className="mt-2 text-sm text-red-600">
                          {uploadError.featured}
                        </p>
                      )}
                    </div>

                    {/* Product Images Upload */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-medium text-gray-700">
                          Product Images <span className="text-red-500">*</span>
                        </label>
                        <span className="text-xs text-gray-500">
                          Maximum 10 images
                        </span>
                      </div>
                      <div
                        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-200 cursor-pointer ${
                          isDraggingImages
                            ? "border-indigo-500 bg-indigo-50"
                            : uploadedImages.length > 0
                            ? "border-emerald-200 bg-emerald-50/30"
                            : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30"
                        }`}
                        onDragOver={handleDragOverImages}
                        onDragLeave={handleDragLeaveImages}
                        onDrop={handleDrop}
                        onClick={() =>
                          document.getElementById("image-upload").click()
                        }
                      >
                        <input
                          id="image-upload"
                          type="file"
                          multiple
                          className="sr-only"
                          onChange={(e) => handleImageUpload(e.target.files)}
                          aria-label="Upload product images"
                        />
                        <div className="mb-4 p-4 bg-indigo-50 rounded-full">
                          <ImageIcon className="w-8 h-8 text-indigo-500" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                          {uploadedImages.length === 0
                            ? "Drop your product images here"
                            : `${uploadedImages.length} image${
                                uploadedImages.length === 1 ? "" : "s"
                              } uploaded`}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          or click to browse files
                        </p>
                      </div>
                      {uploadedImages.length > 0 && (
                        <div className="mt-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium text-gray-700">
                                Product Images
                              </h4>
                              <span className="text-xs text-gray-500">
                                ({uploadedImages.length}/10)
                              </span>
                            </div>
                            {uploadedImages.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setUploadedImages([])}
                                className="text-xs text-red-600 hover:text-red-700 font-medium"
                              >
                                Remove All
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-4">
                            {uploadedImages.map((image, index) => (
                              <div
                                key={index}
                                className="relative aspect-square group rounded-lg overflow-hidden border border-gray-200"
                              >
                                <img
                                  src={image}
                                  alt={`Product ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <button
                                    onClick={() => {
                                      setUploadedImages((prev) =>
                                        prev.filter((_, i) => i !== index)
                                      );
                                    }}
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors duration-200"
                                    aria-label={`Remove image ${index + 1}`}
                                  >
                                    <X className="w-5 h-5 text-white" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* File Attachments Upload */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-medium text-gray-700">
                          Additional Files
                        </label>
                        <span className="text-xs text-gray-500">Optional</span>
                      </div>
                      <div
                        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-200 cursor-pointer ${
                          isDraggingFiles
                            ? "border-indigo-500 bg-indigo-50"
                            : uploadedFiles.length > 0
                            ? "border-emerald-200 bg-emerald-50/30"
                            : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30"
                        }`}
                        onDragOver={handleDragOverFiles}
                        onDragLeave={handleDragLeaveFiles}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDraggingFiles(false);
                          handleFilesUpload(e.dataTransfer.files);
                        }}
                        onClick={() =>
                          document.getElementById("file-upload").click()
                        }
                      >
                        <input
                          id="file-upload"
                          type="file"
                          multiple
                          className="sr-only"
                          onChange={(e) => handleFilesUpload(e.target.files)}
                          aria-label="Upload files"
                        />
                        <div className="mb-4 p-4 bg-indigo-50 rounded-full">
                          <FileText className="w-8 h-8 text-indigo-500" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                          {uploadedFiles.length === 0
                            ? "Drop your files here"
                            : `${uploadedFiles.length} file${
                                uploadedFiles.length === 1 ? "" : "s"
                              } uploaded`}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          XLS, CSV, PDF, DOC, DOCX, PPT, PPTX
                        </p>
                      </div>
                      {uploadedFiles.length > 0 && (
                        <div className="mt-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium text-gray-700">
                                Uploaded Files
                              </h4>
                              <span className="text-xs text-gray-500">
                                ({uploadedFiles.length} files)
                              </span>
                            </div>
                            {uploadedFiles.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setUploadedFiles([])}
                                className="text-xs text-red-600 hover:text-red-700 font-medium"
                              >
                                Remove All
                              </button>
                            )}
                          </div>
                          <div className="grid gap-3">
                            {uploadedFiles.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 group hover:border-indigo-200 hover:bg-white transition-all duration-200"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
                                    <FileText className="w-5 h-5 text-indigo-500" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-700 truncate">
                                      {file.split("/").pop()}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {getFileType(file.split("/").pop())}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setUploadedFiles((prev) =>
                                      prev.filter((_, i) => i !== index)
                                    )
                                  }
                                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors duration-200 shrink-0"
                                  aria-label={`Remove file ${index + 1}`}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading && <Loader2 className="animate-spin mr-2 h-5 w-5" />}
                  {loading ? "Submitting..." : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const Section = ({ title, children }) => (
  <section className="space-y-6 bg-white p-6 rounded-xl shadow-md border border-gray-200">
    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
    {children}
  </section>
);

const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  error,
  required,
  placeholder,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full p-4 border ${
        error ? "border-red-500" : "border-gray-200"
      } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
      placeholder={placeholder}
      aria-label={label}
      aria-invalid={!!error}
    />
    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
  </div>
);

export const DropdownInput = ({ label, dropdown, singleSelect, error }) => (
  <div ref={dropdown.dropdownRef}>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <div className="flex flex-wrap gap-2 mb-3">
        {dropdown.selectedItems.map((item) => (
          <div
            key={item._id}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1 text-sm shadow-sm"
          >
            {item.name}
            <button
              type="button"
              className="text-blue-600 hover:text-blue-900 focus:outline-none"
              onClick={() => dropdown.handleRemoveItem(item)}
              aria-label={`Remove ${item.name}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <input
        type="text"
        className={`w-full p-4 border ${
          error ? "border-red-500" : "border-gray-200"
        } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
        value={dropdown.input}
        onChange={dropdown.handleInputChange}
        onFocus={dropdown.handleFocus}
        ref={dropdown.inputRef}
        disabled={singleSelect && dropdown.selectedItems.length > 0}
        placeholder={`Select ${label.toLowerCase()}...`}
        aria-label={label}
        aria-expanded={dropdown.showDropdown}
        aria-invalid={!!error}
      />
      {dropdown.showDropdown && dropdown.filteredItems.length > 0 && (
        <ul className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {dropdown.filteredItems.map((item) => (
            <li
              key={item._id}
              className={`px-4 py-3 cursor-pointer hover:bg-blue-50 transition-all duration-150 ${
                dropdown.matchedItem?._id === item._id ? "bg-blue-50" : ""
              }`}
              onClick={() => dropdown.handleSelectItem(item)}
              role="option"
              aria-selected={dropdown.matchedItem?._id === item._id}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  </div>
);

export default AddProduct;
