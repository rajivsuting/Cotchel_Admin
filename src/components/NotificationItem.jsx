import React from "react";

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const { id, message, timestamp, read } = notification;

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg shadow-md ${
        read ? "bg-gray-100" : "bg-blue-50"
      }`}
    >
      <div>
        <p className="text-sm font-medium text-gray-800">{message}</p>
        <p className="text-xs text-gray-500">
          {new Date(timestamp).toLocaleString()}
        </p>
      </div>
      {!read && (
        <button
          onClick={() => onMarkAsRead(id)}
          className="text-sm text-blue-600 hover:underline"
        >
          Mark as Read
        </button>
      )}
    </div>
  );
};

export default NotificationItem;
