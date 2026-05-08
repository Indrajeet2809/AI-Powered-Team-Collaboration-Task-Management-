import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="h-20 bg-white border-b fixed left-72 right-0 top-0 flex items-center justify-between px-8 z-10">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-sm text-slate-500">Manage your teams, projects and tasks</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl">
          <Search size={18} className="text-slate-500" />
          <input
            placeholder="Search..."
            className="bg-transparent outline-none text-sm"
          />
        </div>

        <button className="relative p-3 bg-slate-100 rounded-xl">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
          I
        </div>
      </div>
    </header>
  );
}