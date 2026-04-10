import { useEffect, useState } from "react";
import { FaUser, FaLock, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Settings() {
  const [form, setForm] = useState({
    name: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      toast.error(error?.response?.data?.message || "Failed to update name");
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
    <div className="min-h-screen h-screen bg-[#eef2ff] lg:flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    <div className="flex-1 flex flex-col  overflow-hidden">

<Navbar onMenuClick={() => setSidebarOpen(true)} />
      <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="mb-8">
              <p className="inline-flex rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
                Account Settings
              </p>
              <h1 className="mt-4 text-3xl font-bold text-slate-800 md:text-4xl">
                Manage your profile and security
              </h1>
              <p className="mt-2 text-slate-500">
                Update your name, change password, and keep your account secure.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[28px] border border-white/40 bg-white/80 p-6 shadow-xl backdrop-blur-xl sm:p-8">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-xl text-blue-600">
                    <FaUser />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      Update Profile
                    </h2>
                    <p className="text-sm text-slate-500">
                      Change your display name
                    </p>
                  </div>
                </div>

                <form onSubmit={handleNameUpdate} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loadingProfile}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70"
                  >
                    <FaSave />
                    {loadingProfile ? "Updating..." : "Update Name"}
                  </button>
                </form>
              </div>

              <div className="rounded-[28px] border border-white/40 bg-white/80 p-6 shadow-xl backdrop-blur-xl sm:p-8">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-xl text-red-600">
                    <FaLock />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      Change Password
                    </h2>
                    <p className="text-sm text-slate-500">
                      Keep your account secure
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={form.currentPassword}
                      onChange={handleChange}
                      placeholder="Enter current password"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={form.newPassword}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loadingPassword}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-70"
                  >
                    <FaSave />
                    {loadingPassword ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Settings;