import Navbar from "../components/Navbar";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import InsightCard from "../components/InsightCard";

function Dashboard() {
  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <div className="left-panel">
          <ExpenseForm />
          <InsightCard />
        </div>

        <div className="right-panel">
          <ExpenseList />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;