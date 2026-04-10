import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddExpense() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    amount: "",
    date: "",
    type: "Debit",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (type) => {
    setForm({ ...form, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/expenses", form);
      setForm({
        title: "",
        category: "",
        amount: "",
        date: "",
        type: "Credit",
        
      });
      toast.success("Expense added successfully");
    } catch (error) {
      console.log("Failed to add expense:", error);
      toast.error("Failed to add expense");
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

      <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto ">
        
        <div className="mt-6">
          <div className="mx-auto w-full max-w-3xl rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-xl sm:p-6 md:p-8">
            <h2 className="text-2xl font-bold text-slate-800">Add Entry</h2>
            <p className="mt-2 text-slate-500">
              Add your income or expense here
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <select
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select Title</option>
                <option value="Groceries">Groceries</option>
                <option value="Electricity Bill">Electricity Bill</option>
                <option value="Salary">Salary</option>
                <option value="Shopping">Shopping</option>
              </select>

              <input
                type="text"
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleTypeChange("Credit")}
                  className={`rounded-2xl px-6 py-3 font-semibold transition ${
                    form.type === "Credit"
                      ? "bg-green-500 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  Credit
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeChange("Debit")}
                  className={`rounded-2xl px-6 py-3 font-semibold transition ${
                    form.type === "Debit"
                      ? "bg-red-500 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  Debit
                </button>
              </div>

              <div className="flex justify-center mt-4">
  <button
    type="submit"
    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
  >
    Add Entry
  </button>
</div>
            </form>
          </div>
        </div>
        
        <ToastContainer position="top-right" autoClose={2000} theme="colored" />
      </main>
    </div></div>
    
  );
  
}

export default AddExpense;