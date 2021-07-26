const express = require("express");
const router = express.Router();
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

//get mcq
router.get('/getMcq', authController.protect, userController.getMcq);
router.post('/markMcq/:id', authController.protect, userController.markMcq);

router.post("/signup", authController.signup);
router.post("/login", authController.login);

//user profile
router.get("/getUserProfile", authController.protect, userController.getUserProfile);


// forgot password &reset password route
router.post("/forgotPassword", authController.forgotPassword); //will send email with token link
router.patch("/resetPassword/:token", authController.resetPassword); //will receive the token

router.patch(
  "/updatePassword",
  authController.protect,
  authController.updatePassword
);

router.patch("/userUpdate", authController.protect, userController.userUpdate);
router.delete("/deactivateUser", authController.protect, userController.deactivateUser);


// .post(userController.creatUser);

router.get("/downloadFile/:id", authController.protect, userController.downloadFile);

router.get("/allques", authController.protect, userController.allques);

//get announcement Page
router.get('/announcementPage', authController.protect, userController.announcementPage);

//get recent placements page
router.get('/getPlacements', authController.protect, userController.getPlacements);

//get all the video lectures
router.get('/getLibrary', authController.protect, userController.getLibrary);
router.get("/joinSession", authController.protect, userController.joinSession);

module.exports = router;
