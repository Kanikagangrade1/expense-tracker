import { useMemo, useState } from "react";
import API from "../services/api";

function ExpenseList({ expenses = [], onDelete, onUpdate }) {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    category: "",
    amount: "",
    type: "",
    date: "",
  });
  const [error, setError] = useState("");

  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const matchesSearch =
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.category?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        filterCategory === "All" || item.category === filterCategory;

      let matchesDate = true;
      const today = new Date();
      const itemDate = new Date(item.date);

      if (dateFilter === "Today") {
        matchesDate = itemDate.toDateString() === today.toDateString();
      } else if (dateFilter === "This Week") {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        matchesDate = itemDate >= weekAgo && itemDate <= today;
      } else if (dateFilter === "This Month") {
        matchesDate =
          itemDate.getMonth() === today.getMonth() &&
          itemDate.getFullYear() === today.getFullYear();
      }

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [expenses, search, filterCategory, dateFilter]);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      onDelete(id);
    } catch (err) {
      setError("Failed to delete expense");
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setEditForm({
      title: item.title || "",
      category: item.category || "",
      amount: item.amount || "",
      type: item.type || "",
      date: item.date ? item.date.slice(0, 10) : "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      title: "",
      category: "",
      amount: "",
      type: "",
      date: "",
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await API.put(`/expenses/${id}`, editForm);
      onUpdate(res.data.data);
      setEditingId(null);
      setError("");
    } catch (err) {
      setError("Failed to update expense");
    }
  };

  return (
    <div className="bg-white/75 backdrop-blur-xl rounded-[28px] p-6 shadow-xl border border-white/40">
      <h3 className="text-2xl font-bold text-slate-800 mb-4">Expense List</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-2xl border border-slate-200 px-4 py-3"
        >
          <option>All</option>
          <option>Food</option>
          <option>Travel</option>
          <option>Bills</option>
          <option>Shopping</option>
          <option>Entertainment</option>
          <option>Income</option>
          <option>Other</option>
        </select>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-2xl border border-slate-200 px-4 py-3"
        >
          <option>All</option>
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>

      <input
        type="text"
        placeholder="Search expenses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full rounded-2xl border border-slate-200 px-4 py-3"
      />

      {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="py-3">Title</th>
              <th className="py-3">Category</th>
              <th className="py-3">Amount</th>
              <th className="py-3">Type</th>
              <th className="py-3">Date</th>
              <th className="py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredExpenses.map((item) => (
              <tr key={item._id} className="border-t border-slate-100">
                {editingId === item._id ? (
                  <>
                    <td className="py-3 pr-2">
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                        className="w-full rounded-lg border px-2 py-1"
                      />
                    </td>
                    <td className="py-3 pr-2">
                      <input
                        type="text"
                        value={editForm.category}
                        onChange={(e) =>
                          setEditForm({ ...editForm, category: e.target.value })
                        }
                        className="w-full rounded-lg border px-2 py-1"
                      />
                    </td>
                    <td className="py-3 pr-2">
                      <input
                        type="number"
                        value={editForm.amount}
                        onChange={(e) =>
                          setEditForm({ ...editForm, amount: e.target.value })
                        }
                        className="w-full rounded-lg border px-2 py-1"
                      />
                    </td>
                    <td className="py-3 pr-2">
                      <select
                        value={editForm.type}
                        onChange={(e) =>
                          setEditForm({ ...editForm, type: e.target.value })
                        }
                        className="w-full rounded-lg border px-2 py-1"
                      >
                        <option value="Credit">Credit</option>
                        <option value="Debit">Debit</option>
                      </select>
                    </td>
                    <td className="py-3 pr-2">
                      <input
                        type="date"
                        value={editForm.date}
                        onChange={(e) =>
                          setEditForm({ ...editForm, date: e.target.value })
                        }
                        className="w-full rounded-lg border px-2 py-1"
                      />
                    </td>
                    <td className="py-3 space-x-2">
                      <button
                        onClick={() => handleSaveEdit(item._id)}
                        className="rounded-xl bg-green-500 px-3 py-1 text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="rounded-xl bg-slate-200 px-3 py-1 text-slate-700"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-3 font-medium text-slate-700">{item.title}</td>
                    <td className="py-3 text-slate-700">{item.category}</td>
                    <td className="py-3 text-slate-700">₹{item.amount}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.type === "Credit"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 text-slate-700">
                      {item.date ? new Date(item.date).toLocaleDateString() : ""}
                    </td>
                    <td className="py-3 space-x-2">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="rounded-xl bg-blue-100 px-3 py-1 text-blue-700 hover:bg-blue-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="rounded-xl bg-red-100 px-3 py-1 text-red-700 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpenseList;