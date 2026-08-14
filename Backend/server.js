const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]); // force Google DNS for SRV lookups

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB Atlas (no deprecated options)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ School Schema
const SchoolSchema = new mongoose.Schema({
  schoolName: String,
  regNumber: String,
  schoolType: String,
  county: String,
  subCounty: String,
  principalName: String,
  principalEmail: { type: String, unique: true },
  principalPhone: String,
  principalPassword: String, // hashed
});

const School = mongoose.model("School", SchoolSchema);

// ✅ Register Endpoint
app.post("/register", async (req, res) => {
  try {
    const { principalPassword, principalEmail, schoolName, ...rest } = req.body;

    if (!schoolName || !principalEmail || !principalPassword) {
      return res.status(400).json({ error: "School name, email, and password are required." });
    }

    const hashedPassword = await bcrypt.hash(principalPassword, 10);

    const school = new School({
      ...rest,
      schoolName,
      principalEmail,
      principalPassword: hashedPassword,
    });
    await school.save();

    res.json({ message: "School registered successfully" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }
    res.status(500).json({ error: err.message });
  }
});

// ✅ Login Endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const school = await School.findOne({ principalEmail: email });
    if (!school) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, school.principalPassword);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: school._id, email: school.principalEmail },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Middleware for Protected Routes
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// ✅ Verify Endpoint (for ProtectedRoute to check token validity)
app.get("/verify", authMiddleware, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// ✅ Current school/user data (for dashboard)
app.get("/me", authMiddleware, async (req, res) => {
  try {
    const school = await School.findById(req.user.id).select("-principalPassword");
    if (!school) return res.status(404).json({ error: "School not found" });
    res.json(school);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const counties = require("./data/counties");

// ✅ Counties + Sub-counties Endpoint
app.get("/counties", (req, res) => {
  res.json(counties);
});

// ✅ Example Protected Route
app.get("/financial-years", authMiddleware, async (req, res) => {
  res.json({ message: "Protected financial years data" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
