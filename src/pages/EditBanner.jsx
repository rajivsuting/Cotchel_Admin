import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Upload, X, AlertCircle, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE_URL = "https://cotchel-server-tvye7.ondigitalocean.app/api";
const IMAGE_UPLOAD_URL =
  "https://cotchel-server-tvye7.ondigitalocean.app/api/image/upload";

const EditBanner = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    redirectUrl: "",
    position: 0,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Fetch banner data
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/banners/${id}`);
        const banner = response.data.data;
        setFormData({
          title: banner.title || "",
          imageUrl: banner.imageUrl || "",
          redirectUrl: banner.redirectUrl || "",
          position: banner.position || 0,
        });
        if (banner.imageUrl) {
          setPreview(banner.imageUrl);
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch banner";
        setError(errorMessage);
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setInitialLoad(false);
      }
    };

    fetchBanner();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("images", file);

      const response = await axios.post(IMAGE_UPLOAD_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (
        response.data &&
        response.data.imageUrls &&
        response.data.imageUrls.length > 0
      ) {
        return response.data.imageUrls[0];
      }
      throw new Error("No URL received from server");
    } catch (err) {
      console.error("Upload Error:", err);
      throw new Error(err.response?.data?.message || "Failed to upload image");
    }
  };

  const handleImageChange = async (file) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }

      setUploading(true);
      setError(null);

      try {
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload to server
        const imageUrl = await uploadImage(file);
        setFormData((prev) => ({ ...prev, imageUrl }));
      } catch (err) {
        setError(err.message || "Failed to upload image");
        setPreview(null);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  }, []);

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.put(`${API_BASE_URL}/banners/${id}`, formData);
      toast.success("Banner updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/hero-banners");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update banner";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error("Update Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0c0b45]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link
            to="/hero-banners"
            className="flex items-center hover:text-[#0c0b45] transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Hero Banners
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Edit Hero Banner
          </h1>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title and Position on the same line */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c0b45] focus:border-transparent"
                  placeholder="Enter hero banner title"
                />
              </div>
              <div>
                <label
                  htmlFor="position"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Position
                </label>
                <input
                  type="number"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c0b45] focus:border-transparent"
                  placeholder="Enter hero banner position"
                />
              </div>
            </div>

            {/* Redirect URL */}
            <div>
              <label
                htmlFor="redirectUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Redirect URL
              </label>
              <input
                type="url"
                id="redirectUrl"
                name="redirectUrl"
                value={formData.redirectUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c0b45] focus:border-transparent"
                placeholder="Enter redirect URL"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero Banner Image
              </label>
              <div
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${
                  isDragging
                    ? "border-[#0c0b45] bg-[#0c0b45]/5"
                    : "border-gray-300"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="space-y-1 text-center">
                  {preview ? (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="mx-auto h-32 w-auto object-contain"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-0 right-0 -mt-2 -mr-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="image"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-[#0c0b45] hover:text-[#14136a] focus-within:outline-none"
                        >
                          <span>
                            {uploading ? "Uploading..." : "Upload a file"}
                          </span>
                          <input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageChange(e.target.files[0])
                            }
                            className="sr-only"
                            disabled={uploading}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-[#0c0b45]" />
                  Hero Banner Guidelines
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Recommended size: 1920x400 pixels</li>
                  <li>Maximum file size: 5MB</li>
                  <li>Supported formats: PNG, JPG, GIF</li>
                  <li>For best results, use high-quality images</li>
                  <li>Keep text minimal and readable</li>
                  <li>Ensure the image is not blurry or pixelated</li>
                </ul>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-[#0c0b45] text-white rounded-lg hover:bg-[#14136a] transition-colors ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Updating..." : "Update Hero Banner"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBanner;
