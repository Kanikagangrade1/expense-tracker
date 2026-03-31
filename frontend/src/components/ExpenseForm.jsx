import { useState } from "react";
import API from "../services/api";

function ExpenseForm({ onAdd }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    date: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      });

      if (onAdd) {
        onAdd(res.data.data);
      }

      setSuccess("Expense added successfully");

      setForm({
        title: "",
        amount: "",
        date: "",
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
        <input
          type="text"
          name="title"
          placeholder="Expense title"
          value={form.title}
          onChange={handleChange}
          required
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

        {error && <p className="error">{error}</p>}
        {success && <p style={{ color: "green", marginBottom: "10px" }}>{success}</p>}

        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
}

export default ExpenseForm;