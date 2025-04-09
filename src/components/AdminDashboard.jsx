import React from "react";
import useSocket from "../hooks/useSocket";
import NotificationItem from "./NotificationItem";

const AdminDashboard = () => {
  const { notifications, markAsRead, markAllAsRead } = useSocket(true); // isAdmin = true
  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.read
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Admin Dashboard
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Notifications
            </h2>
            {hasUnreadNotifications && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:underline"
              >
                Mark All as Read
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="text-gray-500">No notifications yet.</p>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id || notification._id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
