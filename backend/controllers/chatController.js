const Expense = require("../models/Expense");
const generateChatReply = require("../utils/chatAgent");

exports.chatWithAgent = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
        data: null,
      });
    }

    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });

    const reply = await generateChatReply(message, expenses);

    res.status(200).json({
      success: true,
      message: "Chat response generated successfully",
      data: {
        reply,
      },
    });
  } catch (error) {
    console.log("CHAT ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to generate chat response",
      data: null,
    });
  }
};