import React from "react";
import { markNotificationAsRead } from "../services/api";

const NotificationList = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.read
  );

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
        {hasUnreadNotifications && (
          <button
            onClick={onMarkAllAsRead}
            className="text-sm text-blue-600 hover:underline"
          >
            Mark All as Read
          </button>
        )}
      </div>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No new notifications.</p>
      ) : (
        <ul className="space-y-4 max-h-64 overflow-y-auto">
          {notifications.map((notification) => (
            <li
              key={notification.id || notification._id}
              className={`flex items-center justify-between p-4 rounded-md ${
                notification.read ? "bg-gray-100" : "bg-blue-50"
              }`}
            >
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(notification.timestamp).toLocaleString()}
                </p>
              </div>
              {!notification.read && (
                <button
                  onClick={() =>
                    onMarkAsRead(notification.id || notification._id)
                  }
                  className="text-sm text-blue-600 hover:underline"
                >
                  Mark as Read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;
