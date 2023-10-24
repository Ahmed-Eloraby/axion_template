const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["superadmin", "schooladmin"],
    required: true,
  },
  // School field is only applicable to School admins
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },
});

module.exports = mongoose.model("User", userSchema);
