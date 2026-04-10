import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock } from "react-icons/fa";
import API from "../services/api";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!form.email.trim() || !form.password.trim()) {
      toast.dismiss();
      toast.error("All fields are required ❌");
      return;
    }

    try {
      setLoading(true);
      toast.dismiss();

      const res = await API.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      console.log("LOGIN RESPONSE:", res);

      if (!res?.data?.success || !res?.data?.data?.token) {
        throw new Error("Invalid login response");
      }
      toast.success(res.data.message || "Login Successful ✅");
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));

console.log("naivigate to dashboard");
      navigate("/dashboard");
    }
     catch (error) {
  console.log("LOGIN ERROR:", error);
  console.log("BACKEND RESPONSE:", error.response?.data);
  toast.error(error.response?.data?.message || "Login failed");
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-100 relative overflow-hidden px-4">
      <div className="absolute w-72 h-72 bg-blue-300/30 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-indigo-400/30 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-white/40"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome Back
        </h2>

        <p className="text-center text-gray-500 text-sm mb-6">
          Login to manage your expenses smartly
        </p>

        <div className="flex items-center border border-gray-300 rounded-xl px-4 mb-4 bg-white focus-within:ring-2 focus-within:ring-blue-400">
          <FaEnvelope className="text-gray-400 mr-3" />
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            className="w-full py-3 outline-none bg-transparent"
            required
          />
        </div>

        <div className="flex items-center border border-gray-300 rounded-xl px-4 mb-4 bg-white focus-within:ring-2 focus-within:ring-blue-400">
          <FaLock className="text-gray-400 mr-3" />
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            className="w-full py-3 outline-none bg-transparent"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-xl font-semibold shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center mt-5 text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;