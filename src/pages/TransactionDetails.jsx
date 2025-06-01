import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import {
  ArrowLeft,
  Package,
  User,
  Store,
  CreditCard,
  Calendar,
  AlertCircle,
} from "lucide-react";

const TransactionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://cotchel-server-tvye7.ondigitalocean.app/api/admin/transactions/${id}`
        );
        setTransaction(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-gray-600">Transaction not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Transactions
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Transaction Details
          </h1>
          <p className="text-gray-600">
            View detailed information about this transaction
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Transaction Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction Status Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Transaction Status
                </h2>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                    transaction.status
                  )}`}
                >
                  {transaction.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Transaction ID</p>
                  <p className="font-medium">{transaction.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {format(
                      new Date(transaction.createdAt),
                      "dd MMM yyyy HH:mm"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium">{transaction.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium">
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Details Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Order Details
              </h2>
              <div className="space-y-4">
                {transaction.order?.products?.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={product.featuredImage || product.images?.[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-500">
                        Quantity: {product.quantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        Price: {formatCurrency(product.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(product.totalPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - User Info */}
          <div className="space-y-6">
            {/* Buyer Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <User size={20} className="text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-800">Buyer</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{transaction.buyer?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{transaction.buyer?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{transaction.buyer?.phone}</p>
                </div>
              </div>
            </div>

            {/* Seller Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Store size={20} className="text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-800">Seller</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Business Name</p>
                  <p className="font-medium">
                    {transaction.seller?.businessName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{transaction.seller?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{transaction.seller?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{transaction.seller?.phone}</p>
                </div>
                {transaction.seller?.address && (
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">
                      {[
                        transaction.seller.address.addressLine1,
                        transaction.seller.address.addressLine2,
                        transaction.seller.address.city,
                        transaction.seller.address.state,
                        transaction.seller.address.postalCode,
                        transaction.seller.address.country,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Details Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <CreditCard size={20} className="text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Payment Details
                </h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Platform Fee</p>
                  <p className="font-medium">
                    {formatCurrency(transaction.platformFee)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Seller Amount</p>
                  <p className="font-medium">
                    {formatCurrency(transaction.sellerAmount)}
                  </p>
                </div>
                {transaction.paymentDetails && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Bank</p>
                      <p className="font-medium">
                        {transaction.paymentDetails.bank}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Card Type</p>
                      <p className="font-medium">
                        {transaction.paymentDetails.cardType}
                      </p>
                    </div>
                    {transaction.paymentDetails.last4 && (
                      <div>
                        <p className="text-sm text-gray-500">Last 4 Digits</p>
                        <p className="font-medium">
                          **** {transaction.paymentDetails.last4}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
