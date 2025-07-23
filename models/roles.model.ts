import mongoose from "mongoose";
const slug = require("mongoose-slug-updater");
const { Schema } = mongoose;
mongoose.plugin(slug);

const schema = new Schema({
  name: String,
  permissions: Array,
  status: String,
  deleted: {
    type: Boolean,
    default: false
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

export const Role = mongoose.model("Role", schema, "roles");