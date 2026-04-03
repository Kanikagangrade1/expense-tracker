import { useEffect, useState } from "react";
import API from "../services/api";

function ExpenseForm({ onAdd, onReminderAdd, editingExpense, onUpdate }) {
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

  useEffect(() => {
    if (editingExpense) {
      setForm({
        title: editingExpense.title || "",
        amount: editingExpense.amount || "",
        date: editingExpense.date
          ? new Date(editingExpense.date).toISOString().split("T")[0]
          : "",
        category: editingExpense.category || "",
        type: editingExpense.type || "Debit",
        setReminder: false,
      });
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "title") {
      const selected = titleMap[value] || { category: "Other", type: "Debit" };

      setForm({
        ...form,
        title: value,
        category: selected.category,
        type: selected.type,
        setReminder: selected.category === "Bills" ? form.setReminder : false,
      });
    } else if (type === "checkbox") {
      setForm({
        ...form,
        [name]: checked,
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      let res;

      if (editingExpense) {
        res = await API.put(`/expenses/${editingExpense._id}`, {
          title: form.title,
          amount: Number(form.amount),
          date: form.date || undefined,
          category: form.category,
          type: form.type,
        });

        if (onUpdate) {
          onUpdate(res.data.data);
        }

        setSuccess("Expense updated successfully");
      } else {
        res = await API.post("/expenses", {
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
      }

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
      setError(error.response?.data?.message || "Expense action failed");
    }
  };

  return (
    <div className="card">
      <h3>{editingExpense ? "Edit Entry" : "Add Entry"}</h3>

      <form onSubmit={handleSubmit}>
        <select
          name="title"
          value={form.title}
          onChange={handleChange}
          required
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
          placeholder="Category"
          readOnly
        />

        <input
          type="text"
          name="type"
          value={form.type}
          placeholder="Type"
          readOnly
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        {form.category === "Bills" && !editingExpense && (
          <label className="reminder-checkbox">
            <input
              type="checkbox"
              name="setReminder"
              checked={form.setReminder}
              onChange={handleChange}
            />
            Set Reminder
          </label>
        )}

        {error && <p className="error">{error}</p>}
        {success && <p style={{ color: "green", marginBottom: "10px" }}>{success}</p>}

        <button type="submit">
          {editingExpense ? "Update Entry" : "Add Entry"}
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;