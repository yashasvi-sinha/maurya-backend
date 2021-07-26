const Mcq = require("./../model/mcqSchema");
const Attend = require("./../model/attendanceSchema");
const Session = require("./../model/sessionSchema");
const Library = require("./../model/librarySchema")

exports.createMcq = async (req, res) => {
  try {
    const { ques, options, correctAnswer } = req.body;

    const createQues = await Mcq.create({
      ques,
      options,
      correctAnswer,
    });
    res.status(201).json({ message: "created mcq", createQues });
  } catch (error) {
    res.status(401);
    throw new Error(error);
  }
};

exports.createAttendance = async (req, res) => {
  const number = await Attend.countDocuments();
  // console.log(number);
  try {
    const attendance = await Attend.find({});
    // console.log(attendance);
    if (number > 0) {
      const check = attendance.expiresAt > attendance.createdAt;
      // console.log(check);
      if (!check) {
        return res
          .status(404)
          .json({
            status: "fail",
            message: "Attendance can be created after 30 mins!",
          });
      }
    } else {
      const createAttend = await Attend.create({
        review: req.body.review,
        ratings: req.body.ratings,
        topicsCovered: req.body.topicsCovered,
      });

      return res
        .status(201)
        .json({ status: "success", message: "Attendance has been created" });
    }
  } catch (error) {
    return res.status(400);
    throw new Error(error);
  }
};

//create session
exports.createSession = async (req, res) => {
  try {
  const { sessionLink } = req.body;
  const newSession = await Session.create({
    sessionLink
  });
  return res.status(201).json({status: 'success', newSession});
  } catch(error) {
    return res.status(400).json({ status: "fail", message: error});
  }
  
}

//post lecturer video_sub_title
exports.postLibrary = async (req, res) => {
  try {
    const {videoLink, videoTitle, videoSub_Title} = req.body;
    const newLibrary = await Library.create({ videoLink, videoTitle, videoSub_Title})
    return res.status(201).json({ status: 'success', newLibrary})
  }catch(error) {
    return res.status(400).json({ status: "fail", message: error});
    
}
}
