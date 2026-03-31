import { useEffect, useState } from "react";
import API from "../services/api";
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

function ExpenseChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      const expenses = res.data.data; // ✅ important fix

      const groupedData = expenses.reduce((acc, expense) => {
        const category = expense.category || "Other";

        const existing = acc.find((item) => item.category === category);

        if (existing) {
          existing.amount += Number(expense.amount);
        } else {
          acc.push({
            category,
            amount: Number(expense.amount),
          });
        }

        return acc;
      }, []);

      setChartData(groupedData);
    } catch (error) {
      console.log("Error fetching expenses", error);
    }
  };

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
      case "Other":
        return "#6b7280";
      default:
        return "#14b8a6";
    }
  };

  return (
    <div className="card">
      <h3>Expense Overview</h3>

      {chartData.length === 0 ? (
        <p>No chart data available.</p>
      ) : (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
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