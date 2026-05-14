const express = require("express");
const dotenv  = require("dotenv");
const cors    = require("cors");

const connectDB      = require("./config/db");
const authRoutes     = require("./routes/authRoutes");
const userRoutes     = require("./routes/userRoutes");
const symptomRoutes  = require("./routes/SymptomRoutes");
const exerciseRoutes = require("./routes/ExerciseRoutes");
const dietRoutes     = require("./routes/DietRoutes");

dotenv.config({ path: "./config/.env" });
connectDB();

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://10.152.250.188:3000"],
  credentials: true,
}));
app.use(express.json());

app.use("/api/v1/auth",          authRoutes);
app.use("/api/v1/user",          userRoutes);
app.use("/api/v1/symptom-logs",  symptomRoutes);
app.use("/api/v1/exercise-logs", exerciseRoutes);
app.use("/api/v1/diet-logs",     dietRoutes);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use((_req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});