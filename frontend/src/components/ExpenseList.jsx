import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data.data);
    } catch (error) {
      console.log("Error fetching expenses", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      console.log("Delete failed", error);
    }
  };

  const isToday = (date) => {
    const today = new Date();
    const d = new Date(date);

    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const isThisWeek = (date) => {
    const today = new Date();
    const d = new Date(date);

    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay());

    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

    return d >= firstDayOfWeek && d <= lastDayOfWeek;
  };

  const isThisMonth = (date) => {
    const today = new Date();
    const d = new Date(date);

    return (
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch = expense.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        filterCategory === "All" || expense.category === filterCategory;

      let matchesDate = true;

      if (dateFilter === "Today") {
        matchesDate = isToday(expense.date);
      } else if (dateFilter === "This Week") {
        matchesDate = isThisWeek(expense.date);
      } else if (dateFilter === "This Month") {
        matchesDate = isThisMonth(expense.date);
      }

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [expenses, search, filterCategory, dateFilter]);

  return (
    <div className="card">
      <h3>Expense History</h3>

      <div className="expense-controls">
        <input
          type="text"
          placeholder="Search expenses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Health">Health</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="All">All Dates</option>
          <option value="Today">Today</option>
          <option value="This Week">This Week</option>
          <option value="This Month">This Month</option>
        </select>
      </div>

      {filteredExpenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        filteredExpenses.map((expense) => (
          <div className="expense-item" key={expense._id}>
            <div>
              <h4>{expense.title}</h4>
              <p>{expense.category}</p>
              <p>{new Date(expense.date).toLocaleDateString()}</p>
            </div>

            <div>
              <strong>₹{expense.amount}</strong>
              <button onClick={() => handleDelete(expense._id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ExpenseList;