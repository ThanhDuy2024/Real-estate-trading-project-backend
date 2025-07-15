import mongoose, { Schema } from "mongoose";
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

export const schema = new Schema({
  name: String,
  parentId: Array,
  image: String,
  note: String,
  status: String,
  position: Number,
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: Date,
  deletedBy: String,
  updatedBy: String,
  createdBy: String,
  slug: {
    type: String,
    slug: "name"
  }
}, {
  timestamps: true
})

export const Category = mongoose.model("Category", schema, "categories");