import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function ExpenseChart() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await API.get("/expenses");
        setExpenses(res.data.data || []);
      } catch (error) {
        console.log("Failed to fetch expenses:", error);
        setError("Failed to load expenses");
      }
    };

    fetchExpenses();
  }, []);

  const getColor = (category) => {
    switch (category) {
      case "Food":
        return "#ff6b6b";
      case "Travel":
        return "#4f7cff";
      case "Shopping":
        return "#8b5cf6";
      case "Bills":
        return "#10b981";
      case "Entertainment":
        return "#f59e0b";
      case "Health":
        return "#ef4444";
      case "Income":
        return "#16a34a";
      case "Other":
        return "#14b8a6";
      default:
        return "#6b7280";
    }
  };

  const chartData = useMemo(() => {
  return expenses
    .filter((expense) => expense.category !== "Income")
    .reduce((acc, expense) => {
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
}, [expenses]);

  const totalExpense = useMemo(() => {
    return expenses
      .filter((item) => item.category !== "Income")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [expenses]);

  const totalIncome = useMemo(() => {
    return expenses
      .filter((item) => item.category === "Income")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [expenses]);

  const balance = totalIncome - totalExpense;

  const monthlyData = useMemo(() => {
    const monthsMap = {
      Jan: { month: "Jan", income: 0, expense: 0 },
      Feb: { month: "Feb", income: 0, expense: 0 },
      Mar: { month: "Mar", income: 0, expense: 0 },
      Apr: { month: "Apr", income: 0, expense: 0 },
      May: { month: "May", income: 0, expense: 0 },
      Jun: { month: "Jun", income: 0, expense: 0 },
      Jul: { month: "Jul", income: 0, expense: 0 },
      Aug: { month: "Aug", income: 0, expense: 0 },
      Sep: { month: "Sep", income: 0, expense: 0 },
      Oct: { month: "Oct", income: 0, expense: 0 },
      Nov: { month: "Nov", income: 0, expense: 0 },
      Dec: { month: "Dec", income: 0, expense: 0 },
    };

    expenses.forEach((item) => {
      if (!item.date) return;

      const date = new Date(item.date);
      const month = date.toLocaleString("en-US", { month: "short" });
      const amount = Number(item.amount || 0);

      if (!monthsMap[month]) return;

      if (item.category === "Income") {
        monthsMap[month].income += amount;
      } else {
        monthsMap[month].expense += amount;
      }
    });

    return Object.values(monthsMap);
  }, [expenses]);

  const topCategory = useMemo(() => {
    const filtered = chartData.filter((item) => item.category !== "Income");
    if (filtered.length === 0) return null;
    return filtered.reduce((max, item) =>
      item.amount > max.amount ? item : max
    );
  }, [chartData]);

  return (
    <div className="min-h-screen bg-[#eef2ff] lg:flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="mt-4">
          <div className="rounded-2xl border border-white/40 bg-white/60 p-5 shadow-md backdrop-blur-md">
            <h2 className="text-2xl font-bold text-slate-800">Analytics</h2>
            <p className="mt-2 text-slate-500">
              Track your spending patterns and financial summary
            </p>

            {error && (
              <p className="mt-4 text-sm font-medium text-red-500">{error}</p>
            )}

            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
              <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">
                      Expense Breakdown
                    </h3>
                    <p className="mt-1 text-slate-500">
                      Category-wise spending
                    </p>
                  </div>

                  <select className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none">
                    <option>This Month</option>
                  </select>
                </div>

                {chartData.length === 0 ? (
                  <p className="text-slate-500">No chart data available.</p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-2">
                      <div className="h-[240px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={chartData}
                              dataKey="amount"
                              nameKey="category"
                              innerRadius={55}
                              outerRadius={95}
                              paddingAngle={3}
                            >
                              {chartData.map((entry, index) => (
                                <Cell
                                  key={index}
                                  fill={getColor(entry.category)}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value) => [`₹${value}`, "Amount"]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="space-y-4">
                        {chartData.map((item, index) => {
                          const total = chartData.reduce(
                            (sum, entry) => sum + entry.amount,
                            0
                          );
                          const percentage =
                            total > 0
                              ? Math.round((item.amount / total) * 100)
                              : 0;

                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className="h-4 w-4 rounded-full"
                                  style={{
                                    backgroundColor: getColor(item.category),
                                  }}
                                />
                                <span className="text-lg font-medium text-slate-700">
                                  {item.category}
                                </span>
                              </div>
                              <span className="text-lg font-semibold text-slate-800">
                                {percentage}%
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-200 pt-5 sm:grid-cols-2">
                      {chartData.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="h-3.5 w-3.5 rounded-md"
                              style={{
                                backgroundColor: getColor(item.category),
                              }}
                            />
                            <span className="font-medium text-slate-700">
                              {item.category}
                            </span>
                          </div>
                          <span className="font-bold text-slate-800">
                            ₹ {item.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">
                      Overall Expenses
                    </h3>
                    <p className="mt-1 text-slate-500">
                      Income vs expenses by month
                    </p>
                  </div>

                  <select className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none">
                    <option>Last 12 Months</option>
                  </select>
                </div>

                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
                      <Legend />
                      <Bar
                        dataKey="income"
                        name="Income"
                        fill="#4f7cff"
                        radius={[8, 8, 0, 0]}
                      />
                      <Bar
                        dataKey="expense"
                        name="Expense"
                        fill="#ff6b6b"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-emerald-50 px-4 py-4">
                    <p className="text-sm font-medium text-emerald-700">
                      Total Income
                    </p>
                    <h4 className="mt-2 text-3xl font-bold text-emerald-600">
                      ₹ {totalIncome}
                    </h4>
                  </div>

                  <div className="rounded-2xl bg-rose-50 px-4 py-4">
                    <p className="text-sm font-medium text-rose-700">
                      Total Expense
                    </p>
                    <h4 className="mt-2 text-3xl font-bold text-rose-600">
                      ₹ {totalExpense}
                    </h4>
                  </div>

                  <div className="rounded-2xl bg-blue-50 px-4 py-4">
                    <p className="text-sm font-medium text-blue-700">Balance</p>
                    <h4 className="mt-2 text-3xl font-bold text-blue-600">
                      ₹ {balance}
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-white p-5 shadow-sm">
              <h3 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
                <span>💡</span>
                Smart Insights
              </h3>

              <div className="mt-4 rounded-2xl border border-amber-100 bg-white/80 px-4 py-4">
                {topCategory ? (
                  <>
                    <p className="text-xl font-semibold text-slate-800">
                      You are spending the most on{" "}
                      <span className="text-amber-600">
                        {topCategory.category}
                      </span>
                      .
                    </p>
                    <p className="mt-2 text-slate-600">
                      Consider reviewing this category to improve your monthly
                      budget. Current amount: ₹ {topCategory.amount}
                    </p>
                  </>
                ) : (
                  <p className="text-slate-500">No insights available yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ExpenseChart;