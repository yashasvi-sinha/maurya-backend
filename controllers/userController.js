const User = require("./../model/userSchema");
const fs = require("fs");
const quesModel = require("./../model/quesSchema");
const Mcq = require("./../model/mcqSchema");
const Pagination = require("../features/pagination");
const Announce = require("./../model/announcementSchema");
const Placement = require("./../model/placementSchema");
const Library = require("./../model/librarySchema");
const Session = require("./../model/sessionSchema");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

//get user profile
exports.getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    return res.status(200).json({ status: "success", user });
  } else {
    res.status(404);
    throw new Error("No such user Exists!");
  }
};

//update user data
exports.userUpdate = async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      res.status(403).json({
        status: "fail",
        message: "This route is not password update, please use updatePassword",
      })
    );
  }

  /// filtered out the unwanted field names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email", "phone");

  //update user document, update role is not allowed(only admin can update the role)
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({
    status: "success",
    user: {
      updatedUser,
    },
  });
};

//delete a user
exports.deactivateUser = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { isActive: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
};

//get all questions
exports.allques = async (req, res) => {
  try {
    const feature = new Pagination(quesModel.find(), req.query).paginate();
    const data = await feature.query;
    if (!data) {
      console.log("nothing");
    } else {
      res.status(200).json({
        res: data.length,
        status: "success",
        data,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//download a quest
exports.downloadFile = async (req, res) => {
  const file = await quesModel.findById({ _id: req.params.id });
  // console.log(file);
  const files = fs.createReadStream(`${file.picPath}`);
  res.writeHead(200, {
    "Content-disposition": `attachment; filename=${file.picPath}`,
  });
  files.pipe(res);
};

//mark mcq

exports.getMcq = async (req, res) => {
  try {
    const mcq = await Mcq.find({});
    if (!mcq) {
      res.status(400).json({ message: "no mcq created" });
    } else {
      res.status(200).json({ mcq });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.markMcq = async (req, res) => {
  const mcq = await Mcq.findById(req.params.id);
  if (!mcq) {
    return res.status(400).json({ message: "no mcq found" });
  } else {
    const { options } = req.body;

    console.log(options, mcq);
  }
};

//get all the announcements
exports.announcementPage = async (req, res) => {
  try {
    const announceList = await Announce.find().select("+createdAt");
    if (!announceList) {
      return res
        .status(400)
        .json({ status: "fail", message: "No announcement found" });
    } else {
      res.status(200).json({ status: "success", announceList });
    }
  } catch (error) {
    throw new Error(error);
  }
};

//get all recent placements

exports.getPlacements = async (req, res) => {
  try {
    const allPlacements = await Placement.find();
    if (!allPlacements) {
      return res
        .status(400)
        .json({ status: "fail", message: "No data found in the database" });
    } else {
      res.status(200).json({
        status: "success",
        res: allPlacements.length,
        data: allPlacements,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
};

//get all the lecture videos in library

exports.getLibrary = async (req, res) => {
  try {
    const library = await Library.find();
    if (!library) {
      return res.status(401).json({ status: "fail", message: "no data found" });
    } else {
      return res.status(200).json({ status: "success", library });
    }
  } catch (error) {
    console.log(error);
  }
};

// join the lecture session
exports.joinSession = async (req, res) => {
  const session = await Session.find().sort({ _id: -1 }).limit(1);
  // console.log(session);
  return res.status(200).json({ status: "success", session });
};
