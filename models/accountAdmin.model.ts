import mongoose from "mongoose";
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const { Schema } = mongoose;

const schema = new Schema({
  id: String,
  fullName: String,
  email: String,
  password: String,
  avatar: String,
  phone: String,
  address: String,
  roleId: String,
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  deletedBy: String,
  updateBy: String,
  createdBy: String,
  slug: {
    type: String,
    slug: "fullName"
  }
}, {
  timestamps: true
})

const AccountAdmin = mongoose.model("AccountAdmin", schema, "admin-account");

export default AccountAdmin;