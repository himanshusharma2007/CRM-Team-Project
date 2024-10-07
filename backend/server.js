const express = require("express");
const app = express();
const cors = require("cors");
const colors = require("colors");
const connectDB=require("./database/db")
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const leadRouter = require("./routes/leadRoutes");
const todoRoutes = require("./routes/todoRoutes");
const stageRoutes = require("./routes/leadStageRoutes");
const todoStatusRoutes = require("./routes/todoStatusRoutes");
const contactUsRoutes = require("./routes/contactUsRoutes");
const contactRoutes = require("./routes/contactRoutes");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const URL = process.env.DB_URL;
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["*", "http://localhost:5173"],
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);
app.use("/api/profile", userRoutes);
app.use("/api/lead", leadRouter);
app.use("/api/stage", stageRoutes);
app.use("/api/todoStatus", todoStatusRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/contactUs", contactUsRoutes);

app.listen(PORT, () => {
    connectDB(URL);
  console.log(`Server running on Post- ${PORT}`.bgBlue.black);
});
