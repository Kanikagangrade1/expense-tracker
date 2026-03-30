import { useState } from "react";
import API from "../services/api";

function ExpenseForm() {
  const [form, setForm] = useState({
    title: "",
    amount: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/expenses", {
        title: form.title,
        amount: Number(form.amount),
      });

      setForm({ title: "", amount: "" });
      window.location.reload();
    } catch (error) {
      console.log("Add expense failed");
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

        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
}

export default ExpenseForm;