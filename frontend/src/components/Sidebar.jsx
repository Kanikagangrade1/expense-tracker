import { NavLink, useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaComments,
  FaCog,
  FaHome,
  FaPlusCircle,
  FaSignOutAlt,
  FaTimes,
  FaUserCircle,
  FaWallet,
} from "react-icons/fa";

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-100"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-slate-200 bg-white px-5 py-5 shadow-2xl transition-transform duration-300 lg:static lg:z-0 lg:w-72 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md">
                <FaWallet className="text-lg" />
              </div>

              <div>
                <h1 className="text-lg font-bold leading-tight text-slate-800">
                  Expense Tracker
                </h1>
                <p className="text-xs text-slate-500">Personal finance dashboard</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 lg:hidden"
            >
              <FaTimes />
            </button>
          </div>

          <nav className="space-y-2">
            <NavLink to="/dashboard" className={navLinkClass} onClick={onClose}>
              <FaHome className="text-base" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/add-expense" className={navLinkClass} onClick={onClose}>
              <FaPlusCircle className="text-base" />
              <span>Add Expense</span>
            </NavLink>

            <NavLink to="/chart" className={navLinkClass} onClick={onClose}>
              <FaChartPie className="text-base" />
              <span>Analytics</span>
            </NavLink>

            <NavLink to="/chat" className={navLinkClass} onClick={onClose}>
              <FaComments className="text-base" />
              <span>Chat Support</span>
            </NavLink>

            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
              <FaCog className="text-base" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                <FaUserCircle className="text-3xl text-blue-600" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {user?.name || "User"}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {user?.email || "user@email.com"}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;