const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function fallbackInsights(expenses) {
  if (!expenses || expenses.length === 0) {
    return "No expenses found yet.";
  }

  let total = 0;
  const categoryTotals = {};

  for (const expense of expenses) {
    const amount = Number(expense.amount) || 0;
    const category = expense.category || "Other";

    total += amount;
    categoryTotals[category] = (categoryTotals[category] || 0) + amount;
  }

  let topCategory = "Other";
  let topAmount = 0;

  for (const category in categoryTotals) {
    if (categoryTotals[category] > topAmount) {
      topAmount = categoryTotals[category];
      topCategory = category;
    }
  }

  return `Your total spending is ₹${total}. Your highest spending category is ${topCategory} with ₹${topAmount}.`;
}

async function generateInsights(expenses) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Analyze these expenses and give 2 short spending insights in simple words: ${JSON.stringify(expenses)}`,
        },
      ],
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.log("AI INSIGHTS ERROR:", error.message);
    return fallbackInsights(expenses);
  }
}

module.exports = generateInsights;