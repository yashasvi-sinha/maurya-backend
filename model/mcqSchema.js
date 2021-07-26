const mongoose = require("mongoose");

const mcqSchema = new mongoose.Schema(
  {
    ques: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [{}],
      required: true,
      trim: true,
    },
    correctAnswer: {
      type: [],
      required: true,
    },
    expireAt: {
      type: Date,
      default: Date.now() + 2 * 60 * 60 * 1000,
    },
  },
  { timestamps: true }
);
mcqSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const Mcq = mongoose.model("mcqs", mcqSchema);
module.exports = Mcq;
