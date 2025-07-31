import mongoose from "mongoose";
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const { Schema } = mongoose;

const schema = new Schema({
  name: String,
  avatar: String,
  address: String,
  categoryId: String,
  acreage: String, //dien tich
  numberOfFloors: Number, //so tang cua can nha
  rentPrice: Number,
  purchasePrice: Number, 
  manager: String,
  status: String,
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: Date,
  deletedBy: String,
  createdBy: String,
  updatedBy: String,
}, {
  timestamps: true
});

const Building = mongoose.model("Building", schema, "building");

export default Building;