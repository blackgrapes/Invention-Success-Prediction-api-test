const mongoose = require("mongoose");

const InventionSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, "Title is required"], 
    trim: true 
  },
  description: { 
    type: String, 
    required: [true, "Description is required"], 
    trim: true 
  },
  category: { 
    type: String, 
    required: [true, "Category is required"], 
    trim: true 
  },
  tags: { 
    type: [String], 
    index: true,
    default: []
  },
  engagement: {
    likes: { type: Number, default: 0, min: 0 },
    comments: { type: Number, default: 0, min: 0 },
    views: { type: Number, default: 0, min: 0 },
  },
}, { timestamps: true });

module.exports = mongoose.model("Invention", InventionSchema);
