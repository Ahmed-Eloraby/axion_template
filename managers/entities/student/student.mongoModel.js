const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: {
    type: Number,
    min: 0,
    max: 100,
    message: "age should between 0 and 100",
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    message: "{VALUE} is not supported for gender",
  },
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classroom",
  },
});

module.exports = mongoose.model("Student", studentSchema);
