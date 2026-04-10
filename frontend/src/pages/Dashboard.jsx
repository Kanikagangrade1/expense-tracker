import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ExpenseList from "../components/ExpenseList";
import SummaryCards from "../components/SummaryCards";
import ReminderCard from "../components/ReminderCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);

  const [reminders, setReminders] = useState(() => {
    const savedReminders = localStorage.getItem("reminders");
    return savedReminders
      ? JSON.parse(savedReminders)
      : [
          {
            id: 1,
            title: "Electricity Bill",
            dueDate: "2026-04-10",
          },
          {
            id: 2,
            title: "WiFi Recharge",
            dueDate: "2026-04-12",
          },
        ];
  });

  const [reminderForm, setReminderForm] = useState({
    title: "",
    dueDate: "",
  });

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data.data || []);
    } catch (error) {
      console.log("Failed to fetch expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  const handleDeleteExpense = (id) => {
    setExpenses((prev) => prev.filter((item) => item._id !== id));
  };

  const handleUpdateExpense = (updatedExpense) => {
    setExpenses((prev) =>
      prev.map((item) =>
        item._id === updatedExpense._id ? updatedExpense : item
      )
    );
  };

  const handleOpenReminderModal = () => {
    setShowReminderModal(true);
  };

  const handleCloseReminderModal = () => {
    setShowReminderModal(false);
    setReminderForm({
      title: "",
      dueDate: "",
    });
  };

  const handleReminderChange = (e) => {
    const { name, value } = e.target;
    setReminderForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddReminder = (e) => {
    e.preventDefault();

    if (!reminderForm.title.trim() || !reminderForm.dueDate) {
      toast.error("Please fill all reminder fields");
      return;
    }

    const newReminder = {
      id: Date.now(),
      title: reminderForm.title,
      dueDate: reminderForm.dueDate,
    };

    setReminders((prev) => [newReminder, ...prev]);
    toast.success("Reminder added successfully");
    handleCloseReminderModal();
  };

  const handleDeleteReminder = (id) => {
    setReminders((prev) => prev.filter((item) => item.id !== id));
    toast.success("Reminder deleted");
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
        

        <div className="mt-6 space-y-6">
          <SummaryCards expenses={expenses} />

          {/* <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2 rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-xl sm:p-6">
              <h2 className="mb-4 text-2xl font-bold text-slate-800">
                Recent Expenses
              </h2>

              <ExpenseList
                expenses={expenses}
                onDelete={handleDeleteExpense}
                onUpdate={handleUpdateExpense}
              />
            </div>

            <div className="xl:col-span-1">
              <div className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-xl sm:p-6">
                <ReminderCard
                  reminders={reminders}
                  onAdd={handleOpenReminderModal}
                  onDelete={handleDeleteReminder}
                />
              </div>
            </div>
          </div> */}
          {/* adding analytics */}
          

        </div>

        {showReminderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
              <div className="mb-5">
                <h3 className="text-2xl font-bold text-slate-800">
                  Add Reminder
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Create a new payment or task reminder
                </p>
              </div>

              <form onSubmit={handleAddReminder} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Reminder Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={reminderForm.title}
                    onChange={handleReminderChange}
                    placeholder="Enter reminder title"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={reminderForm.dueDate}
                    onChange={handleReminderChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseReminderModal}
                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Save Reminder
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={2000} theme="colored" />
      </main>
    </div>
    </div>
  );
}

export default Dashboard;