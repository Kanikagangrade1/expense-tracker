import { useState } from "react";
import API from "../services/api";

function ExpenseForm({ onAdd, onReminderAdd }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    date: "",
    category: "",
    setReminder: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const titleCategoryMap = {
    "Rapido Ride": "Travel",
    "Uber Ride": "Travel",
    "Electricity Bill": "Bills",
    "WiFi Recharge": "Bills",
    "House Rent": "Bills",
    "Groceries": "Food",
    "Restaurant Food": "Food",
    "Netflix Subscription": "Entertainment",
    "Mobile Recharge": "Bills",
    "Shopping": "Shopping",
    "Salary": "Income",
  };

  const titleOptions = Object.keys(titleCategoryMap);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "title") {
      const selectedCategory = titleCategoryMap[value] || "Other";

      setForm({
        ...form,
        title: value,
        category: selectedCategory,
        setReminder: selectedCategory === "Bills" ? form.setReminder : false,
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
      const res = await API.post("/expenses", {
        title: form.title,
        amount: Number(form.amount),
        date: form.date || undefined,
        category: form.category,
      });

      if (onAdd) {
        onAdd(res.data.data);
      }

      if (form.category === "Bills" && form.setReminder && onReminderAdd) {
        onReminderAdd({
          id: Date.now(),
          title: form.title,
          dueDate: form.date,
          status: "Due Soon",
        });
      }

      setSuccess("Expense added successfully");

      setForm({
        title: "",
        amount: "",
        date: "",
        category: "",
        setReminder: false,
      });
    } catch (error) {
      console.log("Add expense failed:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Add expense failed");
    }
  };

  return (
    <div className="card">
      <h3>Add Expense</h3>

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

        {form.category === "Bills" && (
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
        {success && (
          <p style={{ color: "green", marginBottom: "10px" }}>
            {success}
          </p>
        )}

        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
}

export default ExpenseForm;