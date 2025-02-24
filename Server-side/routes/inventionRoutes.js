const express = require("express");
const asyncHandler = require("express-async-handler");
const Invention = require("../models/Invention");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Basic Auth
const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Access Denied: No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or Expired Token" });
  }
});

// Add Invention
router.post("/inventions", authenticate, asyncHandler(async (req, res) => {
  const { title, description, category, tags } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ success: false, message: "Title, description, and category are required." });
  }

  const invention = new Invention({
    title,
    description,
    category,
    tags: tags || [],
  });

  await invention.save();
  res.status(201).json({ success: true, message: "Invention Submitted Successfully", invention });
}));

// Update 
router.patch("/inventions/:id/engagement", authenticate, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { likes, comments, views } = req.body;

  const updateFields = {};
  if (likes !== undefined) updateFields["engagement.likes"] = likes;
  if (comments !== undefined) updateFields["engagement.comments"] = comments;
  if (views !== undefined) updateFields["engagement.views"] = views;

  const invention = await Invention.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

  if (!invention) return res.status(404).json({ success: false, message: "Invention Not Found" });

  res.status(200).json({ success: true, message: "Engagement Updated Successfully", invention });
}));

// ML api

// router.get("/inventions/:id/predict", authenticate, asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const invention = await Invention.findById(id);

//   if (!invention) return res.status(404).json({ success: false, message: "Invention Not Found" });

//   const { likes, comments, views } = invention.engagement;

//   try {
//     const response = await axios.post("http://localhost:5000/predict", { likes, comments, views });
//     res.status(200).json({ success: true, prediction: response.data.prediction });
//   } catch (error) {
//     console.error("ML Model Error:", error.message);
//     res.status(500).json({ success: false, message: "Error connecting to ML model" });
//   }
// }));

module.exports = router;
