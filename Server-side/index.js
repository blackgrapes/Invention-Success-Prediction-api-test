const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const axios = require("axios");
const dotenv = require("dotenv");
const Joi = require("joi");
const asyncHandler = require("express-async-handler");

dotenv.config();

const app = express();
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => console.log("MongoDB Connected"));

// User Schema (For authentication)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

// Invention Schema
const InventionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  tags: { type: [String], index: true }, // Indexed for faster searches
  engagement: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
}, { timestamps: true });

const Invention = mongoose.model("Invention", InventionSchema);

// Middleware for Authentication
const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Access Denied: No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id).select("-password");
    if (!req.user) throw new Error();
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or Expired Token" });
  }
});

// Validation Schema
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
});


const inventionSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
  engagement: Joi.object({
    likes: Joi.number().min(0).default(0),
    comments: Joi.number().min(0).default(0),
    views: Joi.number().min(0).default(0)
  }).optional()
});

// Register User (Secure Authentication)
app.post("/test/register", asyncHandler(async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(400).json({ success: false, message: "Username already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();

  res.status(201).json({ success: true, message: "User Registered Successfully" });
}));

// Login
app.post("/test/login", asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ success: false, message: "Invalid Credentials" });
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.status(200).json({ success: true, token: `Bearer ${token}` });
}));

// Submit Invention
app.post("/test/inventions", authenticate, asyncHandler(async (req, res) => {
  const { error } = inventionSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  const invention = new Invention(req.body);
  await invention.save();

  res.status(201).json({ success: true, message: "Invention Submitted Successfully", invention });
}));

// Update Engagement Metrics
app.patch("/test/inventions/:id/engagement", authenticate, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { likes, comments, views } = req.body;

  const invention = await Invention.findByIdAndUpdate(id, {
    $set: {
      "engagement.likes": likes,
      "engagement.comments": comments,
      "engagement.views": views,
    },
  }, { new: true });

  if (!invention) return res.status(404).json({ success: false, message: "Invention Not Found" });

  res.status(200).json({ success: true, message: "Engagement Updated Successfully", invention });
}));

// Predict Success using ML Model
app.get("/test/inventions/:id/predict", authenticate, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const invention = await Invention.findById(id);

  if (!invention) return res.status(404).json({ success: false, message: "Invention Not Found" });

  const { likes, comments, views } = invention.engagement;

  try {
    const response = await axios.post("http://localhost:5000/predict", { likes, comments, views });
    res.status(200).json({ success: true, prediction: response.data.prediction });
  } catch (error) {
    console.error("ML Model Error:", error.message);
    res.status(500).json({ success: false, message: "Error connecting to ML model" });
  }
}));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
