import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Image as ImageIcon,
  FileText,
  Loader2,
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

  const handleFeaturedImage = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("images", file);
    try {
      const response = await axios.post(
        "https://cotchel-server-tvye7.ondigitalocean.app/api/image/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setFeaturedImage(response.data.imageUrls[0]);
    } catch (error) {
      console.error("Error uploading featured image:", error);
    }
  };

  const handleImageUpload = async (files) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("images", file));
    try {
      const response = await axios.post(
        "https://cotchel-server-tvye7.ondigitalocean.app/api/image/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setUploadedImages((prev) => [...prev, ...response.data.imageUrls]);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const handleFilesUpload = async (files) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));
    try {
      const response = await axios.post(
        "https://cotchel-server-tvye7.ondigitalocean.app/api/image/upload-file",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setUploadedFiles((prev) => [...prev, ...response.data.fileUrls]);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!productTitle.trim())
      newErrors.productTitle = "Product title is required";
    if (!categoryDropdown.selectedItems.length)
      newErrors.category = "Category is required";
    if (!subcategoryDropdown.selectedItems.length)
      newErrors.subcategory = "Subcategory is required";
    if (!price) newErrors.price = "Price is required";
    if (!compareAtPrice)
      newErrors.compareAtPrice = "Compare at price is required";
    if (!quantityAvailable)
      newErrors.quantityAvailable = "Quantity is required";
    if (!lotSize) newErrors.lotSize = "Lot size is required";
    if (!brand.trim()) newErrors.brand = "Brand is required";
    if (!model.trim()) newErrors.model = "Model is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!highlights.some((h) => h.trim()))
      newErrors.highlights = "At least one highlight is required";
    if (!featuredImage) newErrors.featuredImage = "Featured image is required";
    if (!uploadedImages.length)
      newErrors.uploadedImages = "At least one product image is required";
    if (!length) newErrors.length = "Length is required";
    if (!breadth) newErrors.breadth = "Breadth is required";
    if (!height) newErrors.height = "Height is required";
    if (!weight) newErrors.weight = "Weight is required";

    if (compareAtPrice && parseFloat(compareAtPrice) <= parseFloat(price))
      newErrors.compareAtPrice =
        "Compare price must be greater than regular price";
    if (
      lotSize &&
      quantityAvailable &&
      parseInt(lotSize) > parseInt(quantityAvailable)
    )
      newErrors.lotSize = "Lot size cannot exceed available quantity";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
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

  const [isDragging, setIsDragging] = useState(false);
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
    e.dataTransfer.dropEffect = "copy";
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleImageUpload(files);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Add New Product
          </h1>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Product Details */}
            <Section title="Product Details">
              <InputField
                label="Product Title"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                error={errors.productTitle}
                required
                placeholder="Enter product title"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </Section>

            {/* Pricing Information */}
            <Section title="Pricing Information">
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
            </Section>

            {/* Description */}
            <Section title="Description">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Highlights <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                    {highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start">
                        <span className="text-blue-600 mr-3 mt-2">•</span>
                        <textarea
                          className="w-full bg-transparent resize-none border-b border-gray-300 focus:border-blue-500 focus:outline-none placeholder-gray-400 text-gray-700 py-1 transition-all duration-200"
                          ref={(el) => (textAreaRefs.current[index] = el)}
                          value={highlight}
                          onChange={(e) => handleChangeKeyHighlight(e, index)}
                          onKeyDown={(e) => handleKeyDownKeyHighlight(e, index)}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Description <span className="text-red-500">*</span>
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
              </div>
            </Section>

            {/* Product Dimensions */}
            <Section title="Product Dimensions">
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
            </Section>

            {/* Media */}
            <Section title="Media">
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    onChange={(e) => handleFeaturedImage(e.target.files[0])}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                    aria-label="Upload featured image"
                  />
                  {featuredImage && (
                    <div className="mt-4 relative w-40 h-40 group">
                      <img
                        src={featuredImage}
                        alt="Featured Preview"
                        className="w-full h-full object-cover rounded-lg shadow-sm"
                      />
                      <button
                        onClick={() => setFeaturedImage("")}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        aria-label="Remove featured image"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  {errors.featuredImage && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.featuredImage}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images (Max 10){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`mt-2 flex justify-center items-center rounded-lg border-2 border-dashed px-6 py-12 transition-all duration-200 ${
                      isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-white"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="text-center">
                      <ImageIcon
                        className={`mx-auto h-12 w-12 ${
                          isDragging ? "text-blue-500" : "text-gray-400"
                        }`}
                        aria-hidden="true"
                      />
                      <div className="mt-4 flex text-sm text-gray-600">
                        <label
                          htmlFor="image-upload"
                          className="relative cursor-pointer rounded-lg bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                        >
                          <span>Upload Images</span>
                          <input
                            id="image-upload"
                            type="file"
                            multiple
                            className="sr-only"
                            onChange={(e) => handleImageUpload(e.target.files)}
                            aria-label="Upload product images"
                          />
                        </label>
                        <p className="pl-2">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative w-28 h-28 group">
                        <img
                          src={image}
                          alt={`Uploaded ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg shadow-sm"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          onClick={() =>
                            setUploadedImages((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                          aria-label={`Remove image ${index + 1}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  {errors.uploadedImages && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.uploadedImages}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attach Files (Optional)
                  </label>
                  <div
                    className={`mt-2 flex justify-center items-center rounded-lg border-2 border-dashed px-6 py-12 transition-all duration-200 ${
                      isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-white"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      handleFilesUpload(e.dataTransfer.files);
                    }}
                  >
                    <div className="text-center">
                      <FileText
                        className={`mx-auto h-12 w-12 ${
                          isDragging ? "text-blue-500" : "text-gray-400"
                        }`}
                        aria-hidden="true"
                      />
                      <div className="mt-4 flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-lg bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                        >
                          <span>Upload Files</span>
                          <input
                            id="file-upload"
                            type="file"
                            multiple
                            className="sr-only"
                            onChange={(e) => handleFilesUpload(e.target.files)}
                            aria-label="Upload files"
                          />
                        </label>
                        <p className="pl-2">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        XLS, CSV, PDF, DOC, DOCX, PPT, PPTX
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-all duration-200"
                      >
                        <span className="text-sm text-gray-700 truncate max-w-md">
                          {file.split("/").pop()}
                        </span>
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700 font-medium"
                          onClick={() =>
                            setUploadedFiles((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                          aria-label={`Remove file ${index + 1}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading && <Loader2 className="animate-spin mr-2 h-5 w-5" />}
                {loading ? "Submitting..." : "Add Product"}
              </button>
            </div>
          </form>
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
