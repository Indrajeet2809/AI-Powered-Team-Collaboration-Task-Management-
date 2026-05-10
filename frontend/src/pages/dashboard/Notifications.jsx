import { useEffect, useState } from "react";
import { Bell, CheckCircle2, Inbox, MailOpen } from "lucide-react";
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

  const unreadCount = notifications.filter((item) => !item.isRead).length;
  const readCount = notifications.length - unreadCount;

  return (
    <DashboardLayout>
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
            <Bell size={28} />
          </div>

          <div>
            <h1 className="text-4xl font-black">Notifications</h1>
            <p className="mt-2 text-blue-100">
              Track task assignments, project updates and workspace alerts.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-white/90 p-6 shadow-lg border border-white/70">
          <p className="text-sm font-semibold text-slate-500">
            Total Notifications
          </p>
          <h2 className="mt-2 text-4xl font-black text-slate-900">
            {notifications.length}
          </h2>
        </div>

        <div className="rounded-3xl bg-white/90 p-6 shadow-lg border border-white/70">
          <p className="text-sm font-semibold text-slate-500">
            Unread
          </p>
          <h2 className="mt-2 text-4xl font-black text-blue-600">
            {unreadCount}
          </h2>
        </div>

        <div className="rounded-3xl bg-white/90 p-6 shadow-lg border border-white/70">
          <p className="text-sm font-semibold text-slate-500">
            Read
          </p>
          <h2 className="mt-2 text-4xl font-black text-emerald-600">
            {readCount}
          </h2>
        </div>
      </div>

      <div className="rounded-3xl bg-white/90 p-6 shadow-lg border border-white/70">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Notification Center
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Latest updates from your workspace.
            </p>
          </div>

          <div className="rounded-2xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600">
            {unreadCount} unread
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
              <Inbox size={32} />
            </div>

            <h3 className="mt-5 text-xl font-black text-slate-900">
              No notifications yet
            </h3>

            <p className="mt-2 max-w-md text-slate-500">
              When someone assigns you a task or updates your workspace,
              notifications will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex flex-col gap-4 rounded-3xl border p-5 transition md:flex-row md:items-center md:justify-between ${
                  notification.isRead
                    ? "border-slate-100 bg-slate-50"
                    : "border-blue-100 bg-blue-50"
                }`}
              >
                <div className="flex gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                      notification.isRead
                        ? "bg-slate-200 text-slate-600"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {notification.isRead ? (
                      <MailOpen size={22} />
                    ) : (
                      <Bell size={22} />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-slate-900">
                        {notification.title}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          notification.isRead
                            ? "bg-slate-200 text-slate-600"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {notification.isRead ? "READ" : "UNREAD"}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      {notification.message}
                    </p>

                    <p className="mt-3 text-xs font-semibold text-slate-400">
                      Type: {notification.type}
                    </p>
                  </div>
                </div>

                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 transition"
                  >
                    <CheckCircle2 size={18} />
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