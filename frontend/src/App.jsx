import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ExpenseChart from "./components/ExpenseChart";
import AddExpense from "./pages/AddExpense";
import Chatbot from "./components/Chatbot";
import Settings from "./pages/Settings";
import ExpenseListPage from "./pages/ExpenseListPage";
// import ExpenseList from "./components/ExpenseListPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/chart" element={<ExpenseChart />} />
        <Route path="/chat" element={<Chatbot />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/expenses" element={<ExpenseListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;