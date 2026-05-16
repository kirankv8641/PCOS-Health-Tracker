const express = require("express");
const dotenv  = require("dotenv");
const cors    = require("cors");

dotenv.config({ path: "./config/.env" }); 

const connectDB      = require("./config/db");
const authRoutes     = require("./routes/authRoutes");
const userRoutes     = require("./routes/userRoutes");
const symptomRoutes  = require("./routes/SymptomRoutes");
const exerciseRoutes = require("./routes/ExerciseRoutes");
const dietRoutes     = require("./routes/DietRoutes");

connectDB();

const app = express();

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use("/api/v1/auth",          authRoutes);
app.use("/api/v1/user",          userRoutes);
app.use("/api/v1/symptom-logs",  symptomRoutes);
app.use("/api/v1/exercise-logs", exerciseRoutes);
app.use("/api/v1/diet-logs",     dietRoutes);


app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", uptime: process.uptime() }) 
);


app.use((_req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({  
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }) 
  });
});

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
});