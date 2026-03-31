import { useState } from "react";
import Navbar from "../components/Navbar";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import InsightCard from "../components/InsightCard";
import ExpenseChart from "../components/ExpenseChart";
import ReminderCard from "../components/ReminderCard";

function Dashboard() {
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: "Electricity Bill",
      dueDate: "2026-04-05",
      status: "Due Soon",
    },
  ]);

  const handleReminderAdd = (newReminder) => {
    setReminders((prev) => [newReminder, ...prev]);
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <div className="left-panel">
          <ExpenseForm onReminderAdd={handleReminderAdd} />
          <InsightCard />
          <ReminderCard reminders={reminders} />
        </div>

        <div className="right-panel">
          <ExpenseChart />
          <ExpenseList />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;