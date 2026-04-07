const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function fallbackReply(message, expenses) {
  const text = message.toLowerCase();

  const incomeTransactions = expenses.filter(
    (item) => item.type?.toLowerCase() === "credit"
  );

  const expenseTransactions = expenses.filter(
    (item) => item.type?.toLowerCase() === "debit"
  );

  const totalIncome = incomeTransactions.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalExpense = expenseTransactions.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const balance = totalIncome - totalExpense;

  const categoryTotals = {};
  expenseTransactions.forEach((item) => {
    const category = item.category || "Other";
    categoryTotals[category] =
      (categoryTotals[category] || 0) + Number(item.amount || 0);
  });

  let topCategory = "Other";
  let topAmount = 0;

  for (const category in categoryTotals) {
    if (categoryTotals[category] > topAmount) {
      topAmount = categoryTotals[category];
      topCategory = category;
    }
  }

  if (text.includes("income") || text.includes("salary")) {
    return `Your total income is ₹${totalIncome}.`;
  }

  if (
    text.includes("total") ||
    text.includes("spent") ||
    text.includes("expense") ||
    text.includes("spending")
  ) {
    return `Your total spending is ₹${totalExpense}.`;
  }

  if (text.includes("balance")) {
    return `Your current balance is ₹${balance}.`;
  }

  if (text.includes("highest") || text.includes("top category")) {
    return `Your highest spending category is ${topCategory} with ₹${topAmount}.`;
  }

  if (text.includes("recent")) {
    const recent = expenseTransactions
      .slice(-3)
      .reverse()
      .map((e) => `${e.title} - ₹${e.amount}`)
      .join(", ");

    return recent
      ? `Your recent expenses are: ${recent}.`
      : "You have no recent expenses.";
  }

  if (text.includes("save") || text.includes("saving")) {
    return `Your highest spending category is ${topCategory}. Reducing that category may help you save more.`;
  }

  return "I can help with income, spending, balance, highest category, recent expenses, and savings suggestions.";
}

async function generateChatReply(message, expenses) {
  try {
    const incomeTransactions = expenses.filter(
      (item) => item.type?.toLowerCase() === "credit"
    );

    const expenseTransactions = expenses.filter(
      (item) => item.type?.toLowerCase() === "debit"
    );

    const totalIncome = incomeTransactions.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const totalExpense = expenseTransactions.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const balance = totalIncome - totalExpense;

    const categoryTotals = {};
    expenseTransactions.forEach((item) => {
      const category = item.category || "Other";
      categoryTotals[category] =
        (categoryTotals[category] || 0) + Number(item.amount || 0);
    });

    let topCategory = "Other";
    let topAmount = 0;

    for (const category in categoryTotals) {
      if (categoryTotals[category] > topAmount) {
        topAmount = categoryTotals[category];
        topCategory = category;
      }
    }

    const recentExpenses = expenseTransactions
      .slice(-5)
      .reverse()
      .map((e) => ({
        title: e.title,
        amount: e.amount,
        category: e.category,
        date: e.date,
      }));

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a personal finance assistant. Answer in short, clear, simple language. Credit means income. Debit means expense. Never treat salary or income as expense. For spending-related questions, use only Debit transactions.",
        },
        {
          role: "user",
          content: `
User question: ${message}

Financial summary:
- Total income: ₹${totalIncome}
- Total expense: ₹${totalExpense}
- Balance: ₹${balance}
- Highest spending category: ${topCategory} (₹${topAmount})

Recent expenses:
${JSON.stringify(recentExpenses)}

All transactions:
${JSON.stringify(expenses)}
          `,
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