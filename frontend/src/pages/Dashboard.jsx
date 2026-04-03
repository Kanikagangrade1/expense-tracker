import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseChart from "../components/ExpenseChart";
import ReminderCard from "../components/ReminderCard";
import Chatbot from "../components/Chatbot";
import SummaryCards from "../components/SummaryCards";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);

  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: "Electricity Bill Due",
      dueDate: "2026-04-05",
    },
  ]);

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data.data);
    } catch (error) {
      console.log("Failed to fetch expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = (newExpense) => {
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const handleUpdateExpense = (updatedExpense) => {
    setExpenses((prev) =>
      prev.map((item) =>
        item._id === updatedExpense._id ? updatedExpense : item
      )
    );
    setEditingExpense(null);
  };

  const handleDeleteExpense = (id) => {
    setExpenses((prev) => prev.filter((item) => item._id !== id));
  };

  const handleReminderAdd = (newReminder) => {
    setReminders((prev) => [newReminder, ...prev]);
  };

  return (
    <div>
      <Navbar reminders={reminders} />

      <div className="dashboard-container">
        <div className="left-panel">
          <ExpenseForm
            onAdd={handleAddExpense}
            onReminderAdd={handleReminderAdd}
            editingExpense={editingExpense}
            onUpdate={handleUpdateExpense}
          />

          <Chatbot />

          <ReminderCard reminders={reminders} />
        </div>

        <div className="right-panel">
          <SummaryCards expenses={expenses} />

          <ExpenseChart expenses={expenses} />

          <ExpenseList
            expenses={expenses}
            onEdit={setEditingExpense}
            onDelete={handleDeleteExpense}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;