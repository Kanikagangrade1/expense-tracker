import { useEffect, useState } from "react";
import API from "../services/api";

function InsightCard() {
  const [insight, setInsight] = useState("Loading insights...");

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const res = await API.get("/expenses/insights");
      setInsight(res.data.insights);
    } catch (error) {
      setInsight("Could not load insights.");
    }
  };

  return (
    <div className="card">
      <h3>AI Insights</h3>
      <p>{insight}</p>
    </div>
  );
}

export default InsightCard;