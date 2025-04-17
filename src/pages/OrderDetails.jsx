import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import {
  ArrowLeft,
  Package2,
  IndianRupee,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  MapPin,
  Phone,
  User,
  Calendar,
  CreditCard,
} from "lucide-react";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
  "Payment Failed": "bg-red-100 text-red-800",
  "Payment Pending": "bg-yellow-100 text-yellow-800",
  Shipped: "bg-blue-100 text-blue-800",
};

const paymentStatusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Paid: "bg-green-100 text-green-800",
  Failed: "bg-red-100 text-red-800",
};

const StatusIcon = ({ status }) => {
  switch (status) {
    case "Completed":
      return <CheckCircle className="w-4 h-4" />;
    case "Cancelled":
    case "Payment Failed":
      return <XCircle className="w-4 h-4" />;
    case "Pending":
    case "Payment Pending":
      return <Clock className="w-4 h-4" />;
    case "Shipped":
      return <Truck className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `https://cotchel-server-tvye7.ondigitalocean.app/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOrder(response.data.order);
        console.log(response.data.order);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch order details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

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

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-gray-500">Order not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Orders
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Order Details and Products */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Order #{order.orderId}
                  </h1>
                  <div className="flex items-center gap-2 mt-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(order.createdAt), "PPp")}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                      statusColors[order.status]
                    }`}
                  >
                    <StatusIcon status={order.status} />
                    {order.status}
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      paymentStatusColors[order.paymentStatus]
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mr-1" />
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold mb-4">Products</h2>
                <div className="space-y-4">
                  {order.products.map((product) => (
                    <div
                      key={product.productId}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={product.featuredImage}
                        alt={product.name}
                        className="w-20 h-20 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {product.name}
                        </h3>
                        <p className="text-gray-500">
                          Quantity: {product.quantity}
                        </p>
                        <div className="flex items-center mt-2 text-gray-900">
                          <IndianRupee className="w-4 h-4" />
                          {product.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <div className="flex items-center">
                    <IndianRupee className="w-4 h-4" />
                    {order.totalPrice.toFixed(2)}
                  </div>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-medium text-gray-900">
                    <span>Total</span>
                    <div className="flex items-center">
                      <IndianRupee className="w-4 h-4" />
                      {order.totalPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Customer and Seller Information */}
          <div className="lg:col-span-5 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">
                Customer Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.buyer.name}
                    </p>
                    <p className="text-gray-500">{order.buyer.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Shipping Address
                    </p>
                    <p className="text-gray-500">
                      {order.address?.street}
                      <br />
                      {order.address?.city}, {order.address?.state}
                      <br />
                      {order.address?.pincode}
                      <br />
                      {order.address?.country}
                    </p>
                  </div>
                </div>
                {order.address?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-500">{order.address.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Seller Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Seller Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.seller.name}
                    </p>
                    <p className="text-gray-500">{order.seller.businessName}</p>
                    <p className="text-gray-500">{order.seller.email}</p>
                  </div>
                </div>
                {order.seller.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Business Address
                      </p>
                      <p className="text-gray-500">
                        {order.seller.address.addressLine1}
                        {order.seller.address.addressLine2 && (
                          <>
                            <br />
                            {order.seller.address.addressLine2}
                          </>
                        )}
                        <br />
                        {order.seller.address.city},{" "}
                        {order.seller.address.state}
                        <br />
                        {order.seller.address.postalCode}
                        <br />
                        {order.seller.address.country}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
