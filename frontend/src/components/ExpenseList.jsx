import { useEffect, useState } from "react";
import API from "../services/api";

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data);
    } catch (error) {
      console.log("Error fetching expenses");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      console.log("Delete failed");
    }
  };

  return (
    <div className="card">
      <h3>Expense History</h3>

      {expenses.length === 0 ? (
        <p>No expenses yet.</p>
      ) : (
        expenses.map((expense) => (
          <div className="expense-item" key={expense._id}>
            <div>
              <h4>{expense.title}</h4>
              <p>{expense.category}</p>
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