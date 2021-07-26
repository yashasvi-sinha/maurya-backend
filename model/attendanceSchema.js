const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    topicsCovered: {
      type: String,
      required: true,
      trim: true,
    },
    countAttendanceTeacher: { 
      type: Number,
      required: true,
      trim: true,
    },
    review: {
      type: String,
      required: true,
      trim: true,
    },
    ratings: {
      type: Number,
      required: true,
    },
    // user: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "User",
    // },
    expireAt: {
      type: Date,
      default: Date.now() + 5 * 60 * 1000,
    },
  },
  { timestamps: true }
);
attendanceSchema.index({ "expireAt": 1 }, { expireAfterSeconds: 0 });

const Attend = mongoose.model("attendance", attendanceSchema);
module.exports = Attend;
