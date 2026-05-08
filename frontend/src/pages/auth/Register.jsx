import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Create Account
        </h1>

        <p className="text-slate-500 mt-2">
          Register to start using CollabAI
        </p>

        {error && (
          <p className="mt-4 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
            {error}
          </p>
        )}

        <form
          onSubmit={handleRegister}
          className="mt-6 space-y-4"
        >
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
          />

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
            Register
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-5">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-slate-900 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}