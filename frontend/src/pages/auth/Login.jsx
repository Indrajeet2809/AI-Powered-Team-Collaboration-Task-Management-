import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  LayoutDashboard,
  Users,
  FolderKanban,
} from "lucide-react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { fetchMe } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setError("");
      await API.post("/auth/login", form);
      await fetchMe();
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-600 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 rounded-[32px] overflow-hidden shadow-2xl border border-white/20 bg-white/10 backdrop-blur-xl">
        <div className="hidden lg:flex flex-col justify-between p-12 text-white bg-gradient-to-br from-blue-600/80 via-indigo-600/80 to-purple-700/80">
          <div>
            <div className="h-16 w-16 rounded-3xl bg-white text-blue-600 flex items-center justify-center font-black text-3xl shadow-xl">
              C
            </div>

            <h1 className="text-5xl font-black mt-10 leading-tight">
              CollabAI Workspace
            </h1>

            <p className="text-blue-100 mt-5 text-lg leading-relaxed max-w-xl">
              A SaaS platform to manage organizations, teams, projects,
              tasks, notifications and activity logs in one place.
            </p>

            <div className="grid grid-cols-1 gap-4 mt-10">
              <div className="flex items-center gap-4 bg-white/15 border border-white/10 p-4 rounded-2xl backdrop-blur">
                <Users size={24} />
                <span className="font-semibold">
                  Role-based team collaboration
                </span>
              </div>

              <div className="flex items-center gap-4 bg-white/15 border border-white/10 p-4 rounded-2xl backdrop-blur">
                <FolderKanban size={24} />
                <span className="font-semibold">
                  Projects and Kanban task workflow
                </span>
              </div>

              <div className="flex items-center gap-4 bg-white/15 border border-white/10 p-4 rounded-2xl backdrop-blur">
                <LayoutDashboard size={24} />
                <span className="font-semibold">
                  Realtime dashboard and notifications
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-blue-100">
            <CheckCircle size={18} />
            <span>
              Built with React, Node.js, Express, Prisma and PostgreSQL
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 p-8 md:p-14">
          <div className="mb-8">
            <p className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
              Welcome to CollabAI
            </p>

            <h2 className="mt-5 text-4xl font-black text-slate-950">
              Welcome Back
            </h2>

            <p className="text-slate-500 mt-3">
              Login to manage your workspace, projects and team tasks.
            </p>
          </div>

          {error && (
            <p className="mb-5 bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-sm border border-red-100">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-white/80 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition shadow-sm"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-white/80 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition shadow-sm"
            />

            <button className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold shadow-xl hover:scale-[1.01] transition-all duration-300">
              Login
            </button>
          </form>

          <div className="mt-8 rounded-2xl bg-blue-50 border border-blue-100 p-4">
            <p className="text-sm text-slate-600">
              New here? Create your workspace account and start managing your
              team collaboration.
            </p>
          </div>

          <p className="text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-blue-600 font-bold">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}