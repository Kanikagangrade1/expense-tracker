require("dotenv").config()


const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
const expenseRoutes = require("./routes/expenseRoutes")
const app = express()


app.use(cors())
app.use(express.json())



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