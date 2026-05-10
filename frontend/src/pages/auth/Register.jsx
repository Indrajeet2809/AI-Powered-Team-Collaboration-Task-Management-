import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, ShieldCheck, Bell, ListTodo } from "lucide-react";
import API from "../../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setError("");
      await API.post("/auth/register", form);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center px-6">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20">
        <div className="hidden lg:flex flex-col justify-between p-10 text-white">
          <div>
            <div className="h-14 w-14 rounded-2xl bg-white text-indigo-600 flex items-center justify-center font-black text-2xl">
              C
            </div>

            <h1 className="text-4xl font-black mt-8">
              Start Your Workspace
            </h1>

            <p className="text-blue-100 mt-4 text-lg leading-relaxed">
              Create your account and build an organization workspace where
              managers can add members, assign tasks and track progress.
            </p>

            <div className="grid grid-cols-1 gap-4 mt-8">
              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl">
                <ShieldCheck />
                <span>Secure JWT and role-based access</span>
              </div>

              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl">
                <ListTodo />
                <span>Kanban workflow for assigned tasks</span>
              </div>

              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl">
                <Bell />
                <span>Realtime notifications for team updates</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-blue-100">
            <CheckCircle size={18} />
            <span>Designed for modern SaaS team collaboration</span>
          </div>
        </div>

        <div className="bg-white p-8 md:p-12">
          <h2 className="text-3xl font-black text-slate-900">
            Create Account
          </h2>

          <p className="text-slate-500 mt-2">
            Register to start using CollabAI.
          </p>

          {error && (
            <p className="mt-5 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </p>
          )}

          <form onSubmit={handleRegister} className="mt-8 space-y-5">
            <input
              name="name"
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
            />

            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
            />

            <button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 rounded-2xl font-bold hover:opacity-95 transition shadow-lg">
              Register
            </button>
          </form>

          <p className="text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 font-bold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}