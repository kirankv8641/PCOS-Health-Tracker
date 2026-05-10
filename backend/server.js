const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cycleRoutes = require("./routes/cycleRoutes");
const symptomRoutes = require("./routes/symptomRoutes");


dotenv.config({ path: "./config/.env" });
connectDB();

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://10.152.250.188:3000"],
  credentials: true
}));
app.use(express.json());

 
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/cycle", cycleRoutes); 


app.use("/api/v1/symptom-logs", symptomRoutes);  // matches frontend fetch URL exactly
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});