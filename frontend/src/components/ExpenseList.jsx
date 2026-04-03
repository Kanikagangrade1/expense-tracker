import { useMemo, useState } from "react";
import API from "../services/api";

function ExpenseList({ expenses, onEdit, onDelete }) {
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  const handleDelete = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      onDelete(id);
    } catch (err) {
      console.log("Delete failed", err);
      setError("Failed to delete expense");
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
    firstDayOfWeek.setHours(0, 0, 0, 0);
    firstDayOfWeek.setDate(today.getDate() - today.getDay());

    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setHours(23, 59, 59, 999);
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
    return expenses.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        filterCategory === "All" || item.category === filterCategory;

      let matchesDate = true;

      if (dateFilter === "Today") {
        matchesDate = isToday(item.date);
      } else if (dateFilter === "This Week") {
        matchesDate = isThisWeek(item.date);
      } else if (dateFilter === "This Month") {
        matchesDate = isThisMonth(item.date);
      }

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [expenses, search, filterCategory, dateFilter]);

  return (
    <div className="card">
      <h3>Expense Table</h3>

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
          <option value="Bills">Bills</option>
          <option value="Shopping">Shopping</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Income">Income</option>
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

      {error && <p className="error">{error}</p>}

      {filteredExpenses.length === 0 ? (
        <p>No expenses found</p>
      ) : (
        <div className="table-wrapper">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredExpenses.map((item, index) => (
                <tr
                  key={item._id}
                  className="table-row-animate"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <td>{item.title}</td>
                  <td>
                    <span className={`table-badge ${item.category?.toLowerCase()}`}>
                      {item.category}
                    </span>
                  </td>
                  <td>
                    <span className={`type-badge ${item.type?.toLowerCase()}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="amount-cell">₹{item.amount}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>
                    <div className="table-actions">
                      {/* <button
                        className="edit-btn"
                        onClick={() => onEdit && onEdit(item)}
                      >
                        ✏
                      </button> */}

                      <button
                        className="delete-btn"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this expense?")) {
                            handleDelete(item._id);
                          }
                        }}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ExpenseList;