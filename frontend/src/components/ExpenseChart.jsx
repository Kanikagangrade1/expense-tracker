import { useEffect, useState } from "react";
// import API from "../services/api"; // COMMENTED: ab chart parent se expenses lega
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function ExpenseChart({ expenses = [] }) {
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState("");

  // COMMENTED: ab fetch yahan nahi hoga, Dashboard se data aayega
  /*
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      const expenses = res.data.data || [];

      const groupedData = expenses.reduce((acc, expense) => {
        const category = expense.category || "Other";

        const existing = acc.find((item) => item.category === category);

        if (existing) {
          existing.amount += Number(expense.amount || 0);
        } else {
          acc.push({
            category,
            amount: Number(expense.amount || 0),
          });
        }

        return acc;
      }, []);

      setChartData(groupedData);
      setError("");
    } catch (error) {
      console.log("Error fetching expenses", error);
      setError("Failed to load chart data");
    }
  };
  */

  useEffect(() => {
    try {
      const groupedData = expenses.reduce((acc, expense) => {
        const category = expense.category || "Other";

        const existing = acc.find((item) => item.category === category);

        if (existing) {
          existing.amount += Number(expense.amount || 0);
        } else {
          acc.push({
            category,
            amount: Number(expense.amount || 0),
          });
        }

        return acc;
      }, []);

      setChartData(groupedData);
      setError("");
    } catch (error) {
      console.log("Error building chart data", error);
      setError("Failed to load chart data");
    }
  }, [expenses]);

  const getColor = (category) => {
    switch (category) {
      case "Food":
        return "#f59e0b";
      case "Travel":
        return "#3b82f6";
      case "Shopping":
        return "#ec4899";
      case "Bills":
        return "#10b981";
      case "Entertainment":
        return "#8b5cf6";
      case "Health":
        return "#ef4444";
      case "Income":
        return "#16a34a";
      case "Other":
        return "#6b7280";
      default:
        return "#14b8a6";
    }
  };

  return (
    <div className="card">
      <h3>Expense Overview</h3>

      {error && <p className="error">{error}</p>}

      {chartData.length === 0 ? (
        <p>No chart data available.</p>
      ) : (
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
              <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.category)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default ExpenseChart;