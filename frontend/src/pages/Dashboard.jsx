import Navbar from "../components/Navbar";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import InsightCard from "../components/InsightCard";
import ExpenseChart from "../components/ExpenseChart";
import ReminderCard from "../components/ReminderCard";

function Dashboard() {
  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <div className="left-panel">
          <ExpenseForm />
          <InsightCard />
          <ReminderCard />
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