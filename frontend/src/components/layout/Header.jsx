import { useState } from "react";
import { Bell, Search, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [search, setSearch] = useState("");

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleSearch = (e) => {
  e.preventDefault();

  const value = search.toLowerCase().trim();

  if (!value) return;

  if (value.includes("task")) {
    navigate("/tasks");
  } else if (value.includes("project")) {
    navigate("/projects");
  } else if (value.includes("team")) {
    navigate("/teams");
  } else if (value.includes("notification")) {
    navigate("/notifications");
  } else if (value.includes("organization") || value.includes("org")) {
    navigate("/organizations");
  } else {
    alert("No matching section found");
  }

  setSearch("");
};

  return (
    <header className="fixed left-72 right-0 top-0 h-20 bg-white/90 backdrop-blur border-b border-slate-200 z-10 px-8 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Workspace
        </h2>
        <p className="text-sm text-slate-500">
          Manage teams, projects and tasks
        </p>
      </div>

      <div className="flex items-center gap-4">

        <form
  onSubmit={handleSearch}
  className="hidden lg:flex items-center gap-3 bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 w-96"
>
  <Search size={18} className="text-slate-500" />

  <input
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search task, project, team..."
    className="bg-transparent outline-none w-full text-sm"
  />
</form>

        <button className="relative h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition">
          <Bell size={21} />
          <span className="absolute right-3 top-3 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="hidden md:block text-right">
          <p className="text-sm font-bold text-slate-900">
            {user?.name || "User"}
          </p>
          <p className="text-xs text-slate-500">
            {user?.email}
          </p>
        </div>

        <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <button
          onClick={handleLogout}
          className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition"
          title="Logout"
        >
          <LogOut size={21} />
        </button>
      </div>
    </header>
  );
}