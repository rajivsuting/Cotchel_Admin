import axios from "axios";

const API_URL = "https://cotchel-server-tvye7.ondigitalocean.app/api";

export const fetchNotifications = async () => {
  const response = await axios.get(`${API_URL}/auth/notifications`, {
    withCredentials: true,
  });
  return response.data;
};

export const markNotificationAsRead = async (id) => {
  if (!id) {
    console.error(
      "Cannot mark notification as read: ID is undefined in API call"
    );
    throw new Error("Notification ID is undefined");
  }

  const response = await axios.patch(
    `${API_URL}/auth/notifications/${id}/read`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await axios.patch(
    `${API_URL}/auth/notifications/mark-all-read`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

export const fetchPendingSellers = async () => {
  const response = await axios.get(`${API_URL}/auth/pending-sellers`, {
    withCredentials: true,
  });
  return response.data.data.users;
};

export const approveSeller = async (userId) => {
  const response = await axios.patch(
    `${API_URL}/auth/approve-seller/${userId}`,
    { isVerifiedSeller: true, role: "Seller" },
    { withCredentials: true }
  );
  return response.data;
};

export const rejectSeller = async (userId) => {
  const response = await axios.patch(
    `${API_URL}/auth/reject-seller/${userId}`,
    {},
    { withCredentials: true }
  );
  return response.data;
};
