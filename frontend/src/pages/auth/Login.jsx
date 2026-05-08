import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";




export default function Login() {

  const { fetchMe } = useAuth();

  const navigate = useNavigate();

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
      setError(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome Back
        </h1>
        <p className="text-slate-500 mt-2">
          Login to CollabAI dashboard
        </p>

        {error && (
          <p className="mt-4 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
          />

          <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800">
            Login
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-5">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-slate-900 font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}