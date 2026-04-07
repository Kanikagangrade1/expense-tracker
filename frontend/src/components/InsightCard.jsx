import { useEffect, useState } from "react";
import API from "../services/api";

function InsightCard() {
  const [insight, setInsight] = useState("Loading insights...");

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const res = await API.get("/expenses");
      const expenses = res.data.data || [];

      // Only count spending
      const debitExpenses = expenses.filter((item) => item.type === "Debit");

      if (debitExpenses.length === 0) {
        setInsight("No spending data available yet. Start adding debit expenses to see smart insights.");
        return;
      }

      const totalSpending = debitExpenses.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );

      const categoryTotals = debitExpenses.reduce((acc, item) => {
        const category = item.category || "Other";
        acc[category] = (acc[category] || 0) + Number(item.amount || 0);
        return acc;
      }, {});

      let highestCategory = "";
      let highestAmount = 0;

      for (const category in categoryTotals) {
        if (categoryTotals[category] > highestAmount) {
          highestAmount = categoryTotals[category];
          highestCategory = category;
        }
      }

      setInsight(
        `Your total spending is ₹${totalSpending}. Your highest spending category is ${highestCategory} with ₹${highestAmount}.`
      );
    } catch (error) {
      console.error("Failed to fetch insights:", error);
      setInsight("Could not load insights right now.");
    }
  };

  return (
    <div className="rounded-[28px] bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-xl border border-white/40">
      <h3 className="text-2xl font-bold text-slate-800 mb-3">Smart Insights</h3>
      <p className="text-slate-700 leading-8">{insight}</p>
    </div>
  );
}

export default InsightCard;