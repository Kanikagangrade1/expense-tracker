const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
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

  return "I can help with total spending, highest category, recent expenses, and savings suggestions.";
}

async function generateChatReply(message, expenses) {
  try {
    const prompt = `
You are a personal finance assistant.
Reply in short, simple language.
Answer only from the given expenses data.
Question: ${message}
Expenses: ${JSON.stringify(expenses)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const reply =
      response?.text ||
      response?.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log("Gemini reply:", reply);

    return reply || fallbackReply(message, expenses);
  } catch (error) {
    console.log("Gemini failed:", error.message);
    return fallbackReply(message, expenses);
  }
}

module.exports = generateChatReply;