import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ExpenseList from "../components/ExpenseList";

function ExpenseListPage() {
  const [expenses, setExpenses] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data.data || []);
    } catch (error) {
      console.log("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDeleteExpense = (id) => {
    setExpenses((prev) => prev.filter((item) => item._id !== id));
  };

  const handleUpdateExpense = (updatedExpense) => {
    setExpenses((prev) =>
      prev.map((item) =>
        item._id === updatedExpense._id ? updatedExpense : item
      )
    );
  };

  return (
    <div className="min-h-screen h-screen bg-[#eef2ff] lg:flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    <div className="flex-1 flex flex-col  overflow-hidden">

<Navbar onMenuClick={() => setSidebarOpen(true)} />
      <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
         <div className="mx-auto max-w-7xl">
            <div className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-xl sm:p-6">
              <h2 className="mb-4 text-2xl font-bold text-slate-800">
                {/* Expense List */}
              </h2>

              <ExpenseList
                expenses={expenses}
                onDelete={handleDeleteExpense}
                onUpdate={handleUpdateExpense}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ExpenseListPage;