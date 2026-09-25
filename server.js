const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(express.json());

app.use(


  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Mahima backend is running" });
});

app.use("/api", require("./route/route"));



app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});





const PORT = process.env.PORT || 5000;

const startServer = async () => {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is required. Set it in .env or the server environment.");
    process.exitCode = 1;
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed. Check MONGO_URI and database connectivity.");
    await mongoose.disconnect();
    process.exitCode = 1;
  }
};

startServer();
