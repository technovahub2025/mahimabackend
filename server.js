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

<<<<<<< HEAD
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is missing");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

=======




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
>>>>>>> 41f80dd09b8a3df2e5b643266e67a7fe0146e085
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
<<<<<<< HEAD
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
=======
    console.error("MongoDB connection failed. Check MONGO_URI and database connectivity.");
    await mongoose.disconnect();
    process.exitCode = 1;
  }
};

startServer();
>>>>>>> 41f80dd09b8a3df2e5b643266e67a7fe0146e085
