require("dotenv").config()


const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
const expenseRoutes = require("./routes/expenseRoutes")
const app = express()


const allowedOrigins = [
  "http://localhost:5173",
  "https://expense-tracker-ashy-chi-16.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));



connectDB()

app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/expenses", expenseRoutes)
app.use("/api/chat", require("./routes/chatRoutes"));

app.get("/", (req,res)=>{
  res.send("Expense Tracker Backend Running")
})




const PORT = 5000

app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`)
})