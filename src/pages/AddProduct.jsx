import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useDropzone } from "react-dropzone";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: [],
    files: [],
    category: null,
    subCategory: null,
    quantityAvailable: "",
    price: "",
    compareAtPrice: "",
    keyHighLights: "",
    featuredImage: "",
    brand: "",
    model: "",
    lotSize: "",
    length: "",
    breadth: "",
    height: "",
    weight: "",
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("https://cotchel-server-tvye7.ondigitalocean.app/api/categories/all")
      .then((res) => res.json())
      .then((data) => {
        const formattedCategories = data.map((cat) => ({
          value: cat._id,
          label: cat.name,
        }));
        setCategories(formattedCategories);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    if (formData.category) {
      fetch(
        `https://cotchel-server-tvye7.ondigitalocean.app/api/subcategories/${formData.category.value}`
      )
        .then((res) => res.json())
        .then((data) => {
          const formattedSubCategories = data.map((sub) => ({
            value: sub._id,
            label: sub.name,
          }));
          setSubCategories(formattedSubCategories);
        })
        .catch((err) => console.error("Error fetching subcategories:", err));
    }
  }, [formData.category]);

  // Image dropzone
  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } =
    useDropzone({
      accept: "image/*",
      onDrop: async (acceptedFiles) => {
        setLoading(true);
        const formDataUpload = new FormData();
        acceptedFiles.forEach((file) => formDataUpload.append("images", file));

        try {
          const response = await fetch(
            "https://cotchel-server-tvye7.ondigitalocean.app/api/image/upload",
            {
              method: "POST",
              body: formDataUpload,
            }
          );
          const data = await response.json();
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...data.imageUrls],
          }));
        } catch (err) {
          console.error("Error uploading images:", err);
        } finally {
          setLoading(false);
        }
      },
    });

  // File attachments dropzone
  const { getRootProps: getFileRootProps, getInputProps: getFileInputProps } =
    useDropzone({
      accept: ".pdf,.doc,.docx",
      onDrop: async (acceptedFiles) => {
        setLoading(true);
        const formDataUpload = new FormData();
        acceptedFiles.forEach((file) => formDataUpload.append("files", file));

        try {
          const response = await fetch(
            "https://cotchel-server-tvye7.ondigitalocean.app/api/image/upload",
            {
              method: "POST",
              body: formDataUpload,
            }
          );
          const data = await response.json();
          setFormData((prev) => ({
            ...prev,
            files: [...prev.files, ...data.fileUrls],
          }));
        } catch (err) {
          console.error("Error uploading files:", err);
        } finally {
          setLoading(false);
        }
      },
    });

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      featuredImage:
        prev.featuredImage === prev.images[index] ? "" : prev.featuredImage,
    }));
  };

  const removeFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const setFeaturedImage = (url) => {
    setFormData((prev) => ({ ...prev, featuredImage: url }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        "https://cotchel-server-tvye7.ondigitalocean.app/api/products",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      console.log("Product created:", data);
    } catch (err) {
      console.error("Error creating product:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-[#0c0b45] mb-6">
          Add New Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0c0b45] mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0c0b45]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0c0b45] mb-1">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0c0b45]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0c0b45] mb-1">
                Model
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0c0b45]"
                required
              />
            </div>
          </div>

          {/* Category Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0c0b45] mb-1">
                Category
              </label>
              <Select
                options={categories}
                value={formData.category}
                onChange={(selected) =>
                  setFormData((prev) => ({ ...prev, category: selected }))
                }
                className="text-sm"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "#0c0b45",
                    "&:hover": { borderColor: "#0c0b45" },
                  }),
                  option: (base, { isFocused }) => ({
                    ...base,
                    backgroundColor: isFocused ? "#0c0b45" : "white",
                    color: isFocused ? "white" : "#0c0b45",
                  }),
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0c0b45] mb-1">
                Subcategory
              </label>
              <Select
                options={subCategories}
                value={formData.subCategory}
                onChange={(selected) =>
                  setFormData((prev) => ({ ...prev, subCategory: selected }))
                }
                isDisabled={!formData.category}
                className="text-sm"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "#0c0b45",
                    "&:hover": { borderColor: "#0c0b45" },
                  }),
                  option: (base, { isFocused }) => ({
                    ...base,
                    backgroundColor: isFocused ? "#0c0b45" : "white",
                    color: isFocused ? "white" : "#0c0b45",
                  }),
                }}
              />
            </div>
          </div>

          {/* Description and Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0c0b45] mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0c0b45]"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0c0b45] mb-1">
                Key Highlights
              </label>
              <textarea
                name="keyHighLights"
                value={formData.keyHighLights}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0c0b45]"
                rows="4"
              />
            </div>
          </div>

          {/* Image Upload with Featured Image Selection */}
          <div>
            <label className="block text-sm font-medium text-[#0c0b45] mb-1">
              Images
            </label>
            <div
              {...getImageRootProps()}
              className="border-2 border-dashed border-[#0c0b45] p-6 rounded text-center cursor-pointer hover:bg-gray-50"
            >
              <input {...getImageInputProps()} />
              <p className="text-[#0c0b45]">
                Drag & drop images here, or click to select
              </p>
            </div>
            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Product ${index}`}
                      className={`h-24 w-full object-cover rounded ${
                        formData.featuredImage === url
                          ? "border-2 border-[#0c0b45]"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      ×
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeaturedImage(url)}
                      className="absolute bottom-1 right-1 bg-[#0c0b45] text-white text-xs px-2 py-1 rounded"
                    >
                      Set Featured
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* File Attachments */}
          <div>
            <label className="block text-sm font-medium text-[#0c0b45] mb-1">
              File Attachments
            </label>
            <div
              {...getFileRootProps()}
              className="border-2 border-dashed border-[#0c0b45] p-6 rounded text-center cursor-pointer hover:bg-gray-50"
            >
              <input {...getFileInputProps()} />
              <p className="text-[#0c0b45]">
                Drag & drop files (PDF, DOC, DOCX) here, or click to select
              </p>
            </div>
            {formData.files.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.files.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-100 rounded"
                  >
                    <span className="text-[#0c0b45] truncate">
                      {url.split("/").pop()}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing and Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0c0b45] mb-1">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0c0b45]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0c0b45] mb-1">
                Compare At Price
              </label>
              <input
                type="number"
                name="compareAtPrice"
                value={formData.compareAtPrice}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0c0b45]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0c0b45] mb-1">
                Quantity
              </label>
              <input
                type="number"
                name="quantityAvailable"
                value={formData.quantityAvailable}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0c0b45]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0c0b45] mb-1">
                Lot Size
              </label>
              <input
                type="number"
                name="lotSize"
                value={formData.lotSize}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0c0b45]"
              />
            </div>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0c0b45] mb-1">
                Length
              </label>
              <input
                type="number"
                name="length"
                value={formData.length}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0c0b45]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0c0b45] mb-1">
                Breadth
              </label>
              <input
                type="number"
                name="breadth"
                value={formData.breadth}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0c0b45]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0c0b45] mb-1">
                Height
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0c0b45]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0c0b45] mb-1">
                Weight
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0c0b45]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0c0b45] text-white py-2 px-4 rounded hover:bg-opacity-90 disabled:bg-gray-400"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
