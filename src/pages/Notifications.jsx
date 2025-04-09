// src/pages/Notifications.jsx
import React from "react";
import useSocket from "../hooks/useSocket";
import NotificationList from "../components/NotificationList";

const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead } = useSocket(true); // isAdmin = true

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Notifications</h1>
        <NotificationList
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
        />
      </div>
    </div>
  );
};

export default Notifications;
