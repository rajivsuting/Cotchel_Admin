import { useState, useEffect } from "react";
import axios from "axios";

const useInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  const fetchInquiries = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page,
        ...filters,
      });

      const response = await axios.get(`/api/inquiries?${queryParams}`, {
        withCredentials: true,
      });

      setInquiries(response.data.data.inquiries);
      setPagination({
        currentPage: response.data.data.currentPage,
        totalPages: response.data.data.totalPages,
        total: response.data.data.total,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching inquiries");
    } finally {
      setLoading(false);
    }
  };

  const getInquiryById = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/inquiries/${id}`, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching inquiry details");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (id, status) => {
    try {
      setLoading(true);
      const response = await axios.patch(
        `/api/inquiries/${id}/status`,
        { status },
        { withCredentials: true }
      );
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error updating inquiry status");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addResponse = async (id, message) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `/api/inquiries/${id}/response`,
        { message },
        { withCredentials: true }
      );
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error adding response");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteInquiry = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/inquiries/${id}`, { withCredentials: true });
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting inquiry");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  return {
    inquiries,
    loading,
    error,
    pagination,
    fetchInquiries,
    getInquiryById,
    updateInquiryStatus,
    addResponse,
    deleteInquiry,
  };
};

export default useInquiries;
