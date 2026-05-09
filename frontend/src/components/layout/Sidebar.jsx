import {
  LayoutDashboard,
  Building2,
  Users,
  FolderKanban,
  Bell,
  ListTodo,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Organizations", icon: Building2, path: "/organizations" },
    { label: "Teams", icon: Users, path: "/teams" },
    { label: "Projects", icon: FolderKanban, path: "/projects" },
    { label: "Tasks", icon: ListTodo, path: "/tasks" },
    { label: "Notifications", icon: Bell, path: "/notifications" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-slate-950 text-white px-6 py-7">
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
            C
          </div>

          <div>
            <h1 className="text-2xl font-bold">CollabAI</h1>
            <p className="text-sm text-slate-400">
              SaaS Workspace
            </p>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
                active
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span className="font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}