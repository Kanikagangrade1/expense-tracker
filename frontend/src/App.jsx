import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ExpenseChart from "./components/ExpenseChart";
import AddExpense from "./pages/AddExpense";
import Chatbot from "./components/Chatbot";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;