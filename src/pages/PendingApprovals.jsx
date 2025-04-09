// src/pages/PendingApprovals.jsx
import React, { useState, useEffect } from "react";
import {
  fetchPendingSellers,
  approveSeller,
  rejectSeller,
} from "../services/api";
import SellerApprovalTable from "../components/SellerApprovalTable";

const PendingApprovals = () => {
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    const loadPendingSellers = async () => {
      try {
        const data = await fetchPendingSellers();
        setSellers(data);
      } catch (error) {
        console.error("Error fetching pending sellers:", error);
      }
    };
    loadPendingSellers();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await approveSeller(userId);
      setSellers((prev) => prev.filter((seller) => seller._id !== userId));
    } catch (error) {
      console.error("Error approving seller:", error);
    }
  };

  const handleReject = async (userId) => {
    try {
      await rejectSeller(userId);
      setSellers((prev) => prev.filter((seller) => seller._id !== userId));
    } catch (error) {
      console.error("Error rejecting seller:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Pending Approvals
        </h1>
        <SellerApprovalTable
          sellers={sellers}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </div>
  );
};

export default PendingApprovals;
