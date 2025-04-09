import { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/api";
import { toast } from "react-toastify";

const socket = io("https://cotchel-server-tvye7.ondigitalocean.app", {
  withCredentials: true, // Support cookies for auth
});

const useSocket = (isAdmin = false) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch historical notifications (optional)
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications();

        // Ensure each notification has an id property (from _id)
        const formattedData = data.map((notif) => {
          const id = notif._id || notif.id;
          return {
            ...notif,
            id: id, // Use _id if available, otherwise use id
          };
        });

        setNotifications(formattedData);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    if (isAdmin) {
      loadNotifications();
    }

    if (isAdmin) {
      // Join admin room
      socket.emit("joinAdminRoom");

      // Listen for new seller registrations
      socket.on("sellerRegistered", (data) => {
        // Ensure the notification has an id property
        const id = data._id || data.id;

        const formattedData = {
          ...data,
          id: id, // Use _id if available, otherwise use id
        };

        setNotifications((prev) => [formattedData, ...prev]);
        toast.info(data.message, { autoClose: 5000 }); // Show toast
      });
    }

    // Cleanup on unmount
    return () => {
      socket.off("sellerRegistered");
    };
  }, [isAdmin]);

  const markAsRead = async (id) => {
    if (!id) {
      console.error("Cannot mark notification as read: ID is undefined");
      return;
    }

    try {
      await markNotificationAsRead(id);

      setNotifications((prev) =>
        prev.map((notif) => {
          if (notif.id === id || notif._id === id) {
            return { ...notif, read: true };
          }
          return notif;
        })
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();

      // Update all notifications to read in the state
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );

      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  return { notifications, markAsRead, markAllAsRead };
};

export default useSocket;
