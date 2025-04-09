import React, { useState, useEffect } from "react";
import {
  Search,
  MessageSquare,
  Filter,
  Clock,
  User,
  Mail,
  Phone,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  X,
  Send,
  Paperclip,
  Star,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Download,
  Eye,
  Home,
} from "lucide-react";
import { Link } from "react-router-dom";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalAnimation, setModalAnimation] = useState(false);

  // Mock data - replace with actual data from your backend
  const inquiries = [
    {
      id: 1,
      user: {
        name: "John Doe",
        email: "john@example.com",
        type: "buyer",
      },
      subject: "Payment Issue",
      message:
        "I'm unable to process my payment. The system keeps showing an error message.",
      status: "pending",
      priority: "high",
      date: "2024-03-15 14:30",
      category: "payment",
      attachments: [
        { name: "error_screenshot.png", type: "image" },
        { name: "payment_details.pdf", type: "document" },
      ],
      history: [
        {
          date: "2024-03-15 14:30",
          message: "Initial inquiry submitted",
          type: "system",
        },
        {
          date: "2024-03-15 14:35",
          message: "Payment system error detected",
          type: "system",
        },
      ],
    },
    {
      id: 2,
      user: {
        name: "Sarah Smith",
        email: "sarah@example.com",
        type: "seller",
      },
      subject: "Account Verification",
      message:
        "I've submitted my verification documents but haven't received any response.",
      status: "in_progress",
      priority: "medium",
      date: "2024-03-15 13:15",
      category: "verification",
    },
    {
      id: 3,
      user: {
        name: "Mike Wilson",
        email: "mike@example.com",
        type: "buyer",
      },
      subject: "Order Dispute",
      message:
        "The delivered work is not matching the requirements. Need immediate assistance.",
      status: "resolved",
      priority: "high",
      date: "2024-03-15 12:00",
      category: "dispute",
    },
  ];

  const filters = [
    { value: "all", label: "All Inquiries" },
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.user.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === "all" || inquiry.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (inquiry) => {
    setIsLoading(true);
    setSelectedInquiry(inquiry);
    setShowDetailsModal(true);
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      setModalAnimation(true);
    }, 500);
  };

  const handleCloseModal = () => {
    setModalAnimation(false);
    setTimeout(() => {
      setShowDetailsModal(false);
      setShowResponseModal(false);
      setSelectedInquiry(null);
    }, 300);
  };

  const handleRespond = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowResponseModal(true);
    setModalAnimation(true);
  };

  const handleSendResponse = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      handleCloseModal();
      setResponseMessage("");
    }, 1000);
  };

  const handleDownloadAttachment = (attachment) => {
    // Implement file download logic
    console.log("Downloading:", attachment.name);
  };

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
          <span className="text-[#0c0b45] font-medium">Help Center</span>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Inquiries Management
              </h1>
              <p className="text-gray-600 text-lg">
                Handle and respond to user inquiries efficiently
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg">
                <MessageSquare className="w-5 h-5 text-[#0c0b45]" />
                <div>
                  <span className="text-sm text-gray-600">Total Inquiries</span>
                  <p className="text-xl font-semibold text-gray-800">
                    {inquiries.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search inquiries by subject, message, or user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0c0b45] focus:border-[#0c0b45] text-gray-700 placeholder-gray-400"
              />
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-6 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0c0b45] focus:border-[#0c0b45] text-gray-700 bg-white cursor-pointer"
            >
              {filters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>

          {/* Inquiries List */}
          <div className="space-y-4">
            {filteredInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-all duration-200 bg-white"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#0c0b45] flex items-center justify-center text-white text-xl font-semibold shadow-lg">
                      {inquiry.user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {inquiry.user.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {inquiry.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
                        inquiry.status
                      )}`}
                    >
                      {inquiry.status.replace("_", " ")}
                    </span>
                    <span
                      className={`text-sm font-medium ${getPriorityColor(
                        inquiry.priority
                      )} flex items-center gap-1`}
                    >
                      <Star className="w-4 h-4" />
                      {inquiry.priority} priority
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 text-lg mb-2">
                    {inquiry.subject}
                  </h4>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {inquiry.message}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#0c0b45]" />
                      <span>{inquiry.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#0c0b45]" />
                      <span className="capitalize">{inquiry.user.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleViewDetails(inquiry)}
                      className="px-4 py-2 text-[#0c0b45] border-2 border-[#0c0b45] rounded-lg hover:bg-[#0c0b45] hover:text-white transition-all duration-200 font-medium"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleRespond(inquiry)}
                      className="px-4 py-2 text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-200 font-medium"
                    >
                      Respond
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-2">
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button className="px-4 py-2 bg-[#0c0b45] text-white rounded-lg font-medium">
                1
              </button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                2
              </button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                3
              </button>
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <ChevronRightIcon className="w-5 h-5 text-gray-600" />
              </button>
            </nav>
          </div>
        </div>

        {/* Details Modal */}
        {showDetailsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
              className={`bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
                modalAnimation
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Inquiry Details
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0c0b45]"></div>
                  </div>
                ) : (
                  selectedInquiry && (
                    <div className="space-y-8">
                      {/* User Information */}
                      <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-xl">
                        <div className="w-16 h-16 rounded-full bg-[#0c0b45] flex items-center justify-center text-white text-2xl font-semibold shadow-lg">
                          {selectedInquiry.user.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 text-xl">
                            {selectedInquiry.user.name}
                          </h3>
                          <p className="text-gray-600">
                            {selectedInquiry.user.email}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                selectedInquiry.status
                              )}`}
                            >
                              {selectedInquiry.status.replace("_", " ")}
                            </span>
                            <span
                              className={`text-sm font-medium ${getPriorityColor(
                                selectedInquiry.priority
                              )} flex items-center gap-1`}
                            >
                              <Star className="w-4 h-4" />
                              {selectedInquiry.priority} priority
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Inquiry Details */}
                      <div className="bg-white border border-gray-100 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-800 text-xl mb-3">
                          {selectedInquiry.subject}
                        </h4>
                        <p className="text-gray-600 text-base leading-relaxed">
                          {selectedInquiry.message}
                        </p>
                      </div>

                      {/* Attachments */}
                      {selectedInquiry.attachments &&
                        selectedInquiry.attachments.length > 0 && (
                          <div className="bg-white border border-gray-100 rounded-xl p-6">
                            <h4 className="font-semibold text-gray-800 text-lg mb-4">
                              Attachments
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {selectedInquiry.attachments.map(
                                (attachment, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <Paperclip className="w-5 h-5 text-[#0c0b45]" />
                                      <span className="text-gray-700 font-medium">
                                        {attachment.name}
                                      </span>
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleDownloadAttachment(attachment)
                                      }
                                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                      <Download className="w-5 h-5 text-gray-600" />
                                    </button>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {/* History */}
                      <div className="bg-white border border-gray-100 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-800 text-lg mb-4">
                          History
                        </h4>
                        <div className="space-y-3">
                          {selectedInquiry.history?.map((event, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg"
                            >
                              <Clock className="w-5 h-5 text-[#0c0b45]" />
                              <span className="font-medium">{event.date}</span>
                              <span className="text-gray-400">•</span>
                              <span>{event.message}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={handleCloseModal}
                          className="px-6 py-2.5 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                          Close
                        </button>
                        <button
                          onClick={() => {
                            handleCloseModal();
                            handleRespond(selectedInquiry);
                          }}
                          className="px-6 py-2.5 bg-[#0c0b45] text-white rounded-lg hover:bg-[#0c0b45]/90 transition-colors font-medium flex items-center gap-2"
                        >
                          <Send className="w-5 h-5" />
                          Respond
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Response Modal */}
        {showResponseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
              className={`bg-white rounded-xl shadow-xl max-w-2xl w-full transform transition-all duration-300 ${
                modalAnimation
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Respond to Inquiry
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {selectedInquiry?.subject}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      From: {selectedInquiry?.user.name} (
                      {selectedInquiry?.user.email})
                    </p>
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

                  <div className="flex items-center gap-3">
                    <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors">
                      <Paperclip className="w-5 h-5 text-[#0c0b45]" />
                    </button>
                    <span className="text-sm text-gray-500">Attach files</span>
                  </div>

                  <div className="flex justify-end gap-4 mt-8">
                    <button
                      onClick={handleCloseModal}
                      className="px-6 py-2.5 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendResponse}
                      disabled={isLoading || !responseMessage.trim()}
                      className={`px-6 py-2.5 bg-[#0c0b45] text-white rounded-lg transition-colors font-medium flex items-center gap-2 ${
                        isLoading || !responseMessage.trim()
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-[#0c0b45]/90"
                      }`}
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                      {isLoading ? "Sending..." : "Send Response"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpCenter;
