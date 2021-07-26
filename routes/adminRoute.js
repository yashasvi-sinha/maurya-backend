const express = require("express");
const router = express.Router();
const admin = require('./../controllers/admin');
const authController = require('./../controllers/authController');


router.post("/upload", admin.uploadUserPhoto, authController.protect, admin.upload);

//get all user
router.get(
  "/getAllUsers",
  authController.protect,
  authController.restrictTo,
  admin.getAllUsers
);

//admin--update user
router.put('/updateProfile/:id', authController.protect, authController.restrictTo, admin.updateProfile)


router.post(
  "/announcementPage",
  authController.protect,
  authController.restrictTo,
  admin.announcementPage
);

//delete a user
router.delete('/deleteUser/:id', authController.protect, admin.deleteUser);

//post recent placements of students
router.post(
  "/placements",
  admin.userPhoto,
  authController.protect,
  authController.restrictTo,
  admin.placements
);


module.exports = router;