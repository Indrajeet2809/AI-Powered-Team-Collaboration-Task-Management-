import { useEffect, useState } from "react";
import {
  Activity,
  Bell,
  Building2,
  FolderKanban,
  ListTodo,
  Users,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";

export default function Dashboard() {
  const { user } = useAuth();

  const [organizations, setOrganizations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activities, setActivities] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const orgRes = await API.get("/organizations/my");
      const notiRes = await API.get("/notifications");

      const orgs = orgRes.data.organizations || [];

      setOrganizations(orgs);
      setNotifications(notiRes.data.notifications || []);

      if (orgs.length > 0) {
        const activityRes = await API.get(
          `/activities/organization/${orgs[0].id}`
        );
        setActivities(activityRes.data.activities || []);
      }
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalTeams = organizations.reduce(
    (total, org) => total + (org.teams?.length || 0),
    0
  );

  const totalProjects = organizations.reduce(
    (total, org) => total + (org.projects?.length || 0),
    0
  );

  const totalTasks = organizations.reduce((total, org) => {
    const projectTasks =
      org.projects?.reduce(
        (sum, project) => sum + (project.tasks?.length || 0),
        0
      ) || 0;

    return total + projectTasks;
  }, 0);

  const unreadNotifications = notifications.filter((n) => !n.isRead).length;

  const stats = [
    {
      title: "Organizations",
      value: organizations.length,
      icon: Building2,
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      title: "Teams",
      value: totalTeams,
      icon: Users,
      gradient: "from-violet-500 to-purple-600",
    },
    {
      title: "Projects",
      value: totalProjects,
      icon: FolderKanban,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "Tasks",
      value: totalTasks,
      icon: ListTodo,
      gradient: "from-orange-500 to-amber-600",
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">
        <h1 className="text-4xl font-black">
          Welcome back, {user?.name || "User"} 👋
        </h1>

        <p className="mt-3 max-w-2xl text-blue-100">
          Track your organizations, teams, projects, tasks and collaboration
          activities from one powerful workspace.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/tasks"
            className="rounded-2xl bg-white px-5 py-3 font-bold text-blue-700 shadow hover:bg-blue-50"
          >
            View Tasks
          </Link>

          <Link
            to="/projects"
            className="rounded-2xl bg-white/15 px-5 py-3 font-bold text-white ring-1 ring-white/30 hover:bg-white/20"
          >
            View Projects
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg backdrop-blur"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    {item.title}
                  </p>
                  <h2 className="mt-2 text-4xl font-black text-slate-900">
                    {item.value}
                  </h2>
                </div>

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg`}
                >
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg backdrop-blur">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Activity size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Recent Activities
                </h2>
                <p className="text-sm text-slate-500">
                  Latest workspace actions
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-4 text-slate-500">
                No recent activities found.
              </p>
            ) : (
              activities.slice(0, 6).map((activity) => (
                <div
                  key={activity.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <p className="font-medium text-slate-700">
                    {activity.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg backdrop-blur">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Bell size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Notifications
                </h2>
                <p className="text-sm text-slate-500">
                  {unreadNotifications} unread
                </p>
              </div>
            </div>

            <Link
              to="/notifications"
              className="text-sm font-bold text-blue-600"
            >
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {notifications.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-4 text-slate-500">
                No notifications found.
              </p>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-2xl border p-4 ${
                    notification.isRead
                      ? "border-slate-100 bg-slate-50"
                      : "border-blue-100 bg-blue-50"
                  }`}
                >
                  <h3 className="font-bold text-slate-900">
                    {notification.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {notification.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Link
          to="/organizations"
          className="group rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg backdrop-blur hover:-translate-y-1 transition"
        >
          <h3 className="text-lg font-black text-slate-900">
            Manage Organizations
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Add members and manage workspaces.
          </p>
          <ArrowRight className="mt-5 text-blue-600 group-hover:translate-x-1 transition" />
        </Link>

        <Link
          to="/projects"
          className="group rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg backdrop-blur hover:-translate-y-1 transition"
        >
          <h3 className="text-lg font-black text-slate-900">
            Manage Projects
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Create and track active projects.
          </p>
          <ArrowRight className="mt-5 text-blue-600 group-hover:translate-x-1 transition" />
        </Link>

        <Link
          to="/tasks"
          className="group rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg backdrop-blur hover:-translate-y-1 transition"
        >
          <h3 className="text-lg font-black text-slate-900">
            Open Kanban Board
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Track tasks across workflow stages.
          </p>
          <ArrowRight className="mt-5 text-blue-600 group-hover:translate-x-1 transition" />
        </Link>
      </div>
    </DashboardLayout>
  );
}