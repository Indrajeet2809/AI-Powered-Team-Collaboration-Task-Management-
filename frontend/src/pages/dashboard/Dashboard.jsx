import { useEffect, useState } from "react";
import {
  Activity,
  Building2,
  FolderKanban,
  ListTodo,
  Users,
} from "lucide-react";
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

  const stats = [
    {
      title: "Organizations",
      value: organizations.length,
      icon: Building2,
    },
    {
      title: "Teams",
      value: totalTeams,
      icon: Users,
    },
    {
      title: "Projects",
      value: totalProjects,
      icon: FolderKanban,
    },
    {
      title: "Notifications",
      value: notifications.length,
      icon: ListTodo,
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {user?.name || "User"} 👋
        </h1>
        <p className="text-slate-500 mt-2">
          Here is your team collaboration overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm">
                    {item.title}
                  </p>
                  <h2 className="text-3xl font-bold mt-2">
                    {item.value}
                  </h2>
                </div>

                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity size={20} />
            <h2 className="text-xl font-bold">Recent Activities</h2>
          </div>

          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-slate-500">
                No recent activities found.
              </p>
            ) : (
              activities.slice(0, 5).map((activity) => (
                <p
                  key={activity.id}
                  className="text-slate-600"
                >
                  {activity.description}
                </p>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-xl font-bold mb-5">Notifications</h2>

          <div className="space-y-4">
            {notifications.length === 0 ? (
              <p className="text-slate-500">
                No notifications found.
              </p>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 rounded-xl bg-slate-50 border"
                >
                  <h3 className="font-semibold">
                    {notification.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {notification.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}