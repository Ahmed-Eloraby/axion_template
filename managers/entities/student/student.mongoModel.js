const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  gender: { type: String, enum: ["Male", "Female"] },
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classroom",
  },
});

module.exports = mongoose.model("Student", studentSchema);
