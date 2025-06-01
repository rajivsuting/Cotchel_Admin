import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  User,
  Paperclip,
  Send,
  X,
  Download,
  Home,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const InquiryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [isSending, setIsSending] = useState(false);

  const fetchInquiryDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://cotchel-server-tvye7.ondigitalocean.app/api/inquiries/${id}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setInquiry(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching inquiry details:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch inquiry details"
      );
      navigate("/help-center");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiryDetails();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      const response = await axios.patch(
        `https://cotchel-server-tvye7.ondigitalocean.app/api/inquiries/${id}/status`,
        { status: newStatus },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Status updated successfully");
        fetchInquiryDetails();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleSendResponse = async () => {
    if (!responseMessage.trim() || !emailSubject.trim()) {
      toast.error("Please enter both subject and message");
      return;
    }

    try {
      setIsSending(true);
      const response = await axios.post(
        `https://cotchel-server-tvye7.ondigitalocean.app/api/inquiries/${id}/response`,
        {
          message: responseMessage,
          subject: emailSubject,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Response sent successfully via email");
        setShowResponseModal(false);
        setResponseMessage("");
        setEmailSubject("");
        fetchInquiryDetails();
      }
    } catch (error) {
      console.error("Error sending response:", error);
      toast.error(error.response?.data?.message || "Failed to send response");
    } finally {
      setIsSending(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-yellow-100 text-yellow-800";
      case "In_Progress":
        return "bg-blue-100 text-blue-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "Closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderAttachment = (url) => {
    const fileType = url.split(".").pop().toLowerCase();
    const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(fileType);
    const isPDF = fileType === "pdf";

    if (isImage) {
      return (
        <div className="relative group">
          <img
            src={url}
            alt="Attachment"
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              onClick={() => window.open(url, "_blank")}
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
            >
              <Download className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      );
    }

    if (isPDF) {
      return (
        <div className="relative group">
          <iframe
            src={url}
            className="w-full h-48 rounded-lg"
            title="PDF Preview"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              onClick={() => window.open(url, "_blank")}
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
            >
              <Download className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div className="flex items-center gap-3">
          <Paperclip className="w-5 h-5 text-[#0c0b45]" />
          <span className="text-gray-700 font-medium">File Attachment</span>
        </div>
        <button
          onClick={() => window.open(url, "_blank")}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Download className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0c0b45]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link
            to="/"
            className="flex items-center hover:text-[#0c0b45] transition-colors"
          >
            <Home size={16} className="mr-1" />
            Home
          </Link>
          <ChevronRight size={16} className="text-gray-400" />
          <Link
            to="/help-center"
            className="hover:text-[#0c0b45] transition-colors"
          >
            Help Center
          </Link>
          <ChevronRight size={16} className="text-gray-400" />
          <span className="text-[#0c0b45] font-medium">Inquiry Details</span>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/help-center")}
          className="flex items-center gap-2 text-gray-600 hover:text-[#0c0b45] transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Back to Inquiries
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* User Information */}
          <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-xl mb-8">
            <div className="w-16 h-16 rounded-full bg-[#0c0b45] flex items-center justify-center text-white text-2xl font-semibold shadow-lg">
              {inquiry?.user.fullName.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-xl">
                {inquiry?.user.fullName}
              </h3>
              <p className="text-gray-600">{inquiry?.user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    inquiry?.status
                  )}`}
                >
                  {inquiry?.status.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>

          {/* Inquiry Details */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-gray-800 text-xl mb-3">
              {inquiry?.subject}
            </h4>
            <p className="text-gray-600 text-base leading-relaxed">
              {inquiry?.message}
            </p>
          </div>

          {/* Attachments */}
          {inquiry?.attachments && inquiry.attachments.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-gray-800 text-lg mb-4">
                Attachments
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inquiry.attachments.map((url, index) => (
                  <div key={index}>{renderAttachment(url)}</div>
                ))}
              </div>
            </div>
          )}

          {/* History */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-gray-800 text-lg mb-4">
              History
            </h4>
            <div className="space-y-3">
              {inquiry?.history?.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg"
                >
                  <Clock className="w-5 h-5 text-[#0c0b45]" />
                  <span className="font-medium">
                    {new Date(event.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span>{event.message}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status Update */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-gray-800 text-lg mb-4">
              Update Status
            </h4>
            <div className="flex gap-3">
              {["Open", "In_Progress", "Resolved", "Closed"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleUpdateStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    inquiry?.status === status
                      ? "bg-[#0c0b45] text-white"
                      : "border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {status.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowResponseModal(true)}
              className="px-6 py-2.5 bg-[#0c0b45] text-white rounded-lg hover:bg-[#0c0b45]/90 transition-colors font-medium flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Respond
            </button>
          </div>
        </div>
      </div>

      {/* Response Modal */}
      {showResponseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full transform transition-all duration-300">
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <h2 className="text-2xl font-bold text-gray-800">
                  Send Email Response
                </h2>
                <button
                  onClick={() => setShowResponseModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Original Inquiry: {inquiry?.subject}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    To: {inquiry?.user.fullName} ({inquiry?.user.email})
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Subject
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0c0b45] focus:border-[#0c0b45] text-gray-700 placeholder-gray-400"
                    placeholder="Enter email subject..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Response Message
                  </label>
                  <textarea
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0c0b45] focus:border-[#0c0b45] text-gray-700 placeholder-gray-400 resize-none"
                    placeholder="Type your response here..."
                  />
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={() => setShowResponseModal(false)}
                    className="px-6 py-2.5 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendResponse}
                    disabled={
                      isSending ||
                      !responseMessage.trim() ||
                      !emailSubject.trim()
                    }
                    className={`px-6 py-2.5 bg-[#0c0b45] text-white rounded-lg transition-colors font-medium flex items-center gap-2 ${
                      isSending ||
                      !responseMessage.trim() ||
                      !emailSubject.trim()
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-[#0c0b45]/90"
                    }`}
                  >
                    {isSending ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    {isSending ? "Sending..." : "Send Email"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryDetails;
