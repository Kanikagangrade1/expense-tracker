import { useEffect, useState } from "react";
import { FaUser, FaLock, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import API from "../services/api";

function Settings() {
  const [form, setForm] = useState({
    name: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNameUpdate = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setLoadingProfile(true);

      const res = await API.put("/users/update-profile", {
        name: form.name,
      });

      const updatedUser = res.data.data.user;

      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Name updated successfully ✅");
    } catch (error) {
      console.error("PROFILE UPDATE ERROR:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update name"
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (form.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      setLoadingPassword(true);

      await API.put("/users/update-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      toast.success("Password updated successfully ✅");

      setForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      console.error("PASSWORD UPDATE ERROR:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update password"
      );
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
          <p className="text-slate-500 mt-2">
            Manage your account details and password
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Update Name Card */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <FaUser />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Update Profile
                </h2>
                <p className="text-sm text-slate-500">
                  Change your display name
                </p>
              </div>
            </div>

            <form onSubmit={handleNameUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <button
                type="submit"
                disabled={loadingProfile}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-70"
              >
                <FaSave />
                {loadingProfile ? "Updating..." : "Update Name"}
              </button>
            </form>
          </div>

          {/* Update Password Card */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <FaLock />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Change Password
                </h2>
                <p className="text-sm text-slate-500">
                  Keep your account secure
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <button
                type="submit"
                disabled={loadingPassword}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-70"
              >
                <FaSave />
                {loadingPassword ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;