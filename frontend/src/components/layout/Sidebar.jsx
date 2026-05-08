import { LayoutDashboard, Building2, Users, FolderKanban, Bell } from "lucide-react";

export default function Sidebar() {
  const menu = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Organizations", icon: Building2 },
    { label: "Teams", icon: Users },
    { label: "Projects", icon: FolderKanban },
    { label: "Notifications", icon: Bell },
  ];

  return (
    <aside className="w-72 min-h-screen bg-slate-950 text-white fixed left-0 top-0 p-6">
      <h1 className="text-2xl font-bold mb-10">CollabAI</h1>

      <nav className="space-y-3">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 cursor-pointer"
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}