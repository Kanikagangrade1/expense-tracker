const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function fallbackReply(message, expenses) {
  const text = message.toLowerCase();

  const total = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const categoryTotals = {};
  expenses.forEach((item) => {
    const category = item.category || "Other";
    categoryTotals[category] = (categoryTotals[category] || 0) + Number(item.amount || 0);
  });

  let topCategory = "Other";
  let topAmount = 0;

  for (const category in categoryTotals) {
    if (categoryTotals[category] > topAmount) {
      topAmount = categoryTotals[category];
      topCategory = category;
    }
  }

  if (text.includes("total") || text.includes("spent")) {
    return `Your total spending is ₹${total}.`;
  }

  if (text.includes("highest") || text.includes("top category")) {
    return `Your highest spending category is ${topCategory} with ₹${topAmount}.`;
  }

  if (text.includes("recent")) {
    const recent = expenses
      .slice(0, 3)
      .map((e) => `${e.title} - ₹${e.amount}`)
      .join(", ");

    return recent
      ? `Your recent expenses are: ${recent}.`
      : "You have no recent expenses.";
  }

  if (text.includes("save") || text.includes("saving")) {
    return `Your highest spending category is ${topCategory}. Reducing that category may help you save more.`;
  }

  return "I can help with total spending, highest category, recent expenses, and savings suggestions.";
}

async function generateChatReply(message, expenses) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a personal finance assistant. Answer in short, clear, simple language based on the user's expenses.",
        },
        {
          role: "user",
          content: `User question: ${message}\nUser expenses: ${JSON.stringify(expenses)}`,
        },
      ],
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.log("CHAT AGENT FALLBACK:", error.message);
    return fallbackReply(message, expenses);
  }
}

module.exports = generateChatReply;