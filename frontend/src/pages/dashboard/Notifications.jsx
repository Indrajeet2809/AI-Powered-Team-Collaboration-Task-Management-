import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../api/axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const res = await API.get("/notifications");
    setNotifications(res.data.notifications || []);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    await API.patch(`/notifications/${notificationId}/read`);
    fetchNotifications();
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-slate-500 mt-1">
          View task assignments and platform updates.
        </p>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-6">
        {notifications.length === 0 ? (
          <p className="text-slate-500">No notifications found.</p>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`border rounded-xl p-5 flex items-center justify-between ${
                  notification.isRead ? "bg-white" : "bg-slate-50"
                }`}
              >
                <div>
                  <h2 className="font-bold">{notification.title}</h2>

                  <p className="text-slate-500 mt-1">
                    {notification.message}
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    Type: {notification.type}
                  </p>
                </div>

                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}