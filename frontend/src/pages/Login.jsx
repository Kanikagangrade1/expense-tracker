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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("All fields are required ❌");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));

      toast.success("Login Successful ✅");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      if (err.code === "ERR_NETWORK") {
        toast.error("Server not running ⚠️");
      } else {
        toast.error(err.response?.data?.message || "Login failed ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-200">
      
      <form
        className="bg-white p-8 rounded-2xl shadow-lg w-[400px] h-auto "
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Welcome Back 
        </h2>

        {/* Email */}
        <div className="flex items-center border rounded-lg px-3 mb-4 font-serif">
          <FaEnvelope className="text-gray-400 mr-2" />
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 outline-none"
            required
          />
        </div>

        {/* Password */}
        <div className="flex items-center border rounded-lg px-3 mb-4 font-serif">
          <FaLock className="text-gray-400 mr-2" />
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 outline-none"
            required
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Link */}
        <p className="text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-semibold">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;