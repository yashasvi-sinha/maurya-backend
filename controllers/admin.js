const multer = require("multer");
const Pagination = require("../features/pagination");
const quesModel = require("./../model/quesSchema");
const User = require("./../model/userSchema");
const Announce = require("./../model/announcementSchema");
const Placement = require("./../model/placementSchema");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    cb(null, `image-${Date.now()}.${ext}`);
  },
});

const upload = multer({
  storage: storage,
});

(exports.uploadUserPhoto = upload.single("picPath")),
  (exports.upload = async (req, res) => {
    const question = await quesModel.findOne({ day: req.body.day });
    if (question) {
      return res.status(400).send({
        status: "fail",
        message: "for this day cc or assignment has already been uploaded",
      });
    }

    const newQuestion = await quesModel.create({
      day: req.body.day,
      picPath: req.file.filename,
    });
    return res.status(201).json({ status: "success", newQuestion });
  });

//get all the users
exports.getAllUsers = async (req, res) => {
  try {
    const feature = new Pagination(User.find(), req.query).paginate();

    const users = await User.find();
    if (!users) {
      return res
        .status(400)
        .json({ status: "fail", message: "No users found" });
    } else {
      return res.status(200).json({
        status: "success",
        res: users.length,
        users,
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

//GET USER BY ID
exports.getUserById = async (req, res) => {
  try {
    const userData = await User.findById(req.params.id).select("-password");
    if (userData) {
      return res.status(200).json({ status: "success", userData });
    } else {
      res.status(404);
      throw new Error("No such user Exists!");
    }
  } catch (error) {
    console.log(error);
  }
};

//delete a users
exports.deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    return res.json({ message: "User removed" });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
};

//update a user by admin
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.updateProfile = async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(res.status(404).json({ status: "fail" }));
  }
  /// filtered out the unwanted field names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email", "phone", "role");

  //update user document (admin can update the role)
  const updatedprofile = await User.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );
  return res.status(200).json({
    status: "success",
    user: {
      updatedprofile,
    },
  });
};

exports.announcementPage = async (req, res) => {
  try {
    const { announcement, designation, name, createdAt } = req.body;
    if (!announcement) {
      return res
        .status(401)
        .json({ status: "fail", message: "Field cannot be left empty!" });
    }
    const createAnnouncement = await Announce.create({
      announcement,
      name,
      designation,
    });
    return res.status(201).json({
      status: "success",
      message: "Announcement has been successfully created!",
      createAnnouncement,
    });
  } catch (error) {
    return res.status(400).json({ status: "fail", message: error });
  }
};

//recent placements
exports.userPhoto = upload.single("photo");
exports.placements = async (req, res) => {
  try {
    const newPlacement = await Placement.create({
      name: req.body.name,
      location: req.body.location,
      background: req.body.background,
      photo: req.file.filename,
      companyName: req.body.companyName,
    });
    res
      .status(201)
      .json({ status: "success", message: "Added successfully", newPlacement });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
};
