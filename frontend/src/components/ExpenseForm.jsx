import { useState } from "react";
import API from "../services/api";

function ExpenseForm({ onAdd, onReminderAdd }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    date: "",
    category: "",
    type: "Debit",
    setReminder: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const titleMap = {
    "Rapido Ride": { category: "Travel", type: "Debit" },
    "Uber Ride": { category: "Travel", type: "Debit" },
    "Electricity Bill": { category: "Bills", type: "Debit" },
    "WiFi Recharge": { category: "Bills", type: "Debit" },
    "House Rent": { category: "Bills", type: "Debit" },
    Groceries: { category: "Food", type: "Debit" },
    "Restaurant Food": { category: "Food", type: "Debit" },
    "Netflix Subscription": { category: "Entertainment", type: "Debit" },
    "Mobile Recharge": { category: "Bills", type: "Debit" },
    Shopping: { category: "Shopping", type: "Debit" },
    Salary: { category: "Income", type: "Credit" },
  };

  const titleOptions = Object.keys(titleMap);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "title") {
      const selected = titleMap[value] || { category: "Other", type: "Debit" };

      setForm((prev) => ({
        ...prev,
        title: value,
        category: selected.category,
        type: selected.type,
        setReminder: selected.category === "Bills" ? prev.setReminder : false,
      }));
    } else if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await API.post("/expenses", {
        title: form.title,
        amount: Number(form.amount),
        date: form.date || undefined,
        category: form.category,
        type: form.type,
      });

      if (onAdd) {
        onAdd(res.data.data);
      }

      if (form.category === "Bills" && form.setReminder && onReminderAdd) {
        onReminderAdd({
          id: Date.now(),
          title: form.title,
          dueDate: form.date,
        });
      }

      setSuccess("Expense added successfully");

      setForm({
        title: "",
        amount: "",
        date: "",
        category: "",
        type: "Debit",
        setReminder: false,
      });
    } catch (error) {
      console.log("Expense submit failed:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Expense add failed");
    }
  };

return (
  <div className="bg-white/75 backdrop-blur-xl rounded-[28px] p-6 shadow-xl border border-white/40">
    <h3 className="text-2xl font-bold text-slate-800 mb-2">Add Entry</h3>
    <p className="text-slate-500 mb-5">Add your income or expense here</p>

    <form onSubmit={handleSubmit} className="space-y-4">
      <select
        name="title"
        value={form.title}
        onChange={handleChange}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none"
      >
        <option value="">Select Title</option>
        {titleOptions.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="category"
        value={form.category}
        readOnly
        placeholder="Category"
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none"
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          className={`rounded-2xl px-5 py-3 font-semibold ${
            form.type === "Credit"
              ? "bg-green-500 text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          Credit
        </button>

        <button
          type="button"
          className={`rounded-2xl px-5 py-3 font-semibold ${
            form.type === "Debit"
              ? "bg-red-500 text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          Debit
        </button>
      </div>

      {form.category === "Bills" && (
        <label className="flex items-center gap-2 text-slate-600">
          <input
            type="checkbox"
            name="setReminder"
            checked={form.setReminder}
            onChange={handleChange}
          />
          Set Reminder
        </label>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <button
        type="submit"
        className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 py-3 text-lg font-semibold text-white shadow-lg"
      >
        Add Entry
      </button>
    </form>
  </div>
);
}

export default ExpenseForm;