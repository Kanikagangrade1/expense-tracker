const Expense = require("../models/Expense");
const getCategory = require("../utils/aiCategory");
const generateInsights = require("../utils/aiInsights");

// ADD EXPENSE
exports.addExpense = async (req, res) => {
  try {
    const { title, amount, date, category } = req.body;

    if (!title || !amount) {
      return res.status(400).json({
        success: false,
        message: "Title and amount are required",
        data: null,
      });
    }

    const expense = new Expense({
      user: req.user.id,
      title,
      amount,
      category: category || "Other",
      date: date || Date.now(),
    });

    await expense.save();

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      data: expense,
    });
  } catch (error) {
    console.log("ADD EXPENSE ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
  }
};

// GET EXPENSES
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      message: "Expenses fetched successfully",
      data: expenses,
    });
  } catch (error) {
    console.log("GET EXPENSES ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
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
      return res.status(404).json({
        success: false,
        message: "Expense not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: updatedExpense,
    });
  } catch (error) {
    console.log("UPDATE EXPENSE ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
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
      return res.status(404).json({
        success: false,
        message: "Expense not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
      data: deletedExpense,
    });
  } catch (error) {
    console.log("DELETE EXPENSE ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
  }
};

// GET INSIGHTS
exports.getInsights = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    const insights = await generateInsights(expenses);

    res.status(200).json({
      success: true,
      message: "Insights fetched successfully",
      data: {
        insights,
      },
    });
  } catch (error) {
    console.log("GET INSIGHTS ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Error generating insights",
      data: null,
    });
  }
};