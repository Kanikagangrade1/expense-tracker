const Expense = require("../models/Expense");
const getCategory = require("../utils/aiCategory");
const generateInsights = require("../utils/aiInsights");

// ADD EXPENSE
exports.addExpense = async (req, res) => {
  try {
    const { title, amount } = req.body;

    const category = await getCategory(title);

    const expense = new Expense({
      user: req.user.id,
      title,
      amount,
      category,
    });

    await expense.save();

    res.status(201).json(expense);
  } catch (error) {
    console.log("ADD EXPENSE ERROR:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET EXPENSES
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    res.json(expenses);
  } catch (error) {
    console.log("GET EXPENSES ERROR:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// UPDATE EXPENSE
exports.updateExpense = async (req, res) => {
  try {
    const { title, amount, category } = req.body;

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, amount, category },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(updatedExpense);
  } catch (error) {
    console.log("UPDATE EXPENSE ERROR:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// DELETE EXPENSE
exports.deleteExpense = async (req, res) => {
  try {
    const deletedExpense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.log("DELETE EXPENSE ERROR:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET INSIGHTS
exports.getInsights = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });

    const insights = await generateInsights(expenses);

    res.json({ insights });
  } catch (error) {
    console.log("GET INSIGHTS ERROR:", error.message);
    res.status(500).json({
      message: "Error generating insights",
      error: error.message,
    });
  }
};