import { LayoutDashboard, Building2, Users, FolderKanban, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { ListTodo } from "lucide-react";

export default function Sidebar() {
const menu = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Organizations", icon: Building2, path: "/organizations" },
  { label: "Teams", icon: Users, path: "/teams" },
  { label: "Projects", icon: FolderKanban, path: "/projects" },
  { label: "Notifications", icon: Bell, path: "/notifications" },
  { label: "Tasks", icon: ListTodo, path: "/tasks" },
];

  return (
    <aside className="w-72 min-h-screen bg-slate-950 text-white fixed left-0 top-0 p-6">
      <h1 className="text-2xl font-bold mb-10">CollabAI</h1>

      <nav className="space-y-3">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
           <Link
              to={item.path}
              key={item.label}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 cursor-pointer"
             >
             <Icon size={20} />
             <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}