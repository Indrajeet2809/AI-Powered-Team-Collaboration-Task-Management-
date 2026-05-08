import { Activity, Building2, FolderKanban, ListTodo, Users } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Dashboard() {


const { user } = useAuth();

const [organizations, setOrganizations] = useState([]);
const [notifications, setNotifications] = useState([]);

 const stats = [
  { title: "Organizations", value: organizations.length, icon: Building2 },
  { title: "Teams", value: 0, icon: Users },
  { title: "Projects", value: 0, icon: FolderKanban },
  { title: "Notifications", value: notifications.length, icon: ListTodo },
];

useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const orgRes = await API.get("/organizations/my");
      const notiRes = await API.get("/notifications");

      setOrganizations(orgRes.data.organizations || []);
      setNotifications(notiRes.data.notifications || []);
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  fetchDashboardData();
}, []);

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
                  <p className="text-slate-500 text-sm">{item.title}</p>
                  <h2 className="text-3xl font-bold mt-2">{item.value}</h2>
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
            <p className="text-slate-600">Indrajeet created project “School Management System”</p>
            <p className="text-slate-600">Rahul was assigned task “Build Login API”</p>
            <p className="text-slate-600">Backend Team was created</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-xl font-bold mb-5">My Tasks</h2>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border">
              <h3 className="font-semibold">Build Organization API</h3>
              <p className="text-sm text-slate-500 mt-1">Priority: HIGH • Status: COMPLETED</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border">
              <h3 className="font-semibold">Create Frontend Dashboard</h3>
              <p className="text-sm text-slate-500 mt-1">Priority: MEDIUM • Status: IN_PROGRESS</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}