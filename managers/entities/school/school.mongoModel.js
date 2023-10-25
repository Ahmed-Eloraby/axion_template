const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true, // Make the classroom name unique
    message: "School Name Already Exists",
  },
});

module.exports = mongoose.model("School", schoolSchema);
