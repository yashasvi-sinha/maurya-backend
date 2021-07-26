const crypto = require("crypto");
const User = require("./../model/userSchema");
const jwt = require("jsonwebtoken");
const sendEmail = require("./../email");
const asyncHandler = require("express-async-handler");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: "90d",
  });
};

const cookieOptions = {
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  // secure: true //only  in prod env
  httpOnly: true,
};
const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id);

  //send  a cookie
  res.cookie("jwt", token, cookieOptions);

  //remove password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    message,
    token,
    user,
  });
};

exports.signup = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ status: "fail", message: "User already exists" });
    } else {
      const newUser = await User.create({
        name: req.body.name,
        mobile: req.body.mobile,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        // role: req.body.role,
      });

      createSendToken(newUser, 201, res, "User successfully registered");
    }
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      error,
    });
  }
};

//login users
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check if email and password is correct
  const user = await User.findOne({ email })
    .select("+password")
    .select("+mobile");

  if (user && (await user.correctPassword(password, user.password))) {
    createSendToken(user, 200, res);
  } else {
    return res
      .status(401)
      .json({ status: "fail", message: "Invalid email or password" });
  }
});

//protecting all
exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("You are not logged in!");
  } else {
    //   const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY)
    //   console.log(decoded)
    let decoded = {};
    jwt.verify(token, process.env.SECRET_KEY, function (err, data) {
      if (!err) {
        decoded = data;
      } else {
        return;
      }
    });

    if (!decoded.id) {
      res.status(401);
      throw new Error("Invalid token or token expired, try to login again");
    } else {
      // check if user exists or not
      const checkUser = await User.findById(decoded.id);
      if (!checkUser) {
        res.status(401);
        throw new Error("User belonging to this token no longer exists");
      } else {
        if (checkUser.passwordChangedAfter(decoded.iat)) {
          return res.status(401);
          throw new Error("Password recently changed, try to login again!");
        }

        //GRANT ACCESS TO PROTECTED ROUTE
        req.user = checkUser;

        next();
      }
    }
  }
};

exports.restrictTo = (req, res, next) => {
  // return (req, res, next) => {
  //only admin
  if (
    req.user &&
    (req.user.role === "admin" || req.user.role === "instructor")
  ) {
    next();
  } else {
    return res.status(403).json({
      status: "fail",
      message: "You do not have an access to this!",
    });
  }
};
// };

//forgot & reset password
exports.forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (!user) {
      return next(
        res.status(404).json({ message: "user not found, plz check" })
      );
    }
    const token = user.createPasswordResetToken();
    user.save({ validateBeforeSave: false });

    // const resetURL = `${req.protocol}://${req.get(
    //   "host"
    // )} /reset_password/${resetToken}`;

    const message = `Forgot your password? Submit you new password and confirmPassword at: <a href="http://localhost:3000/reset_password/${token}">Click here</a> \n If you do remember your password please ignore the link! Thank you`;
    // console.log(token);

    await sendEmail({
      email: user.email,
      subject: "Your password reset Token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      res
        .status(404)
        .json({ message: "there was an error while sending the email!" })
    );
  }
};

exports.resetPassword = async (req, res, next) => {
   const hashToken = crypto
     .createHash("sha256")
     .update(req.params.token)
     .digest("hex");
   const user = await User.findOne({
     passwordResetToken: hashToken,
     passwordResetExpires: { $gt: Date.now() },
   });
   if (!user) {
     return next(res.status(400).json({ message: "Token has been expired" }));
   }
   user.password = req.body.password;
   user.passwordConfirm = req.body.passwordConfirm;
   user.passwordResetToken = undefined;
   user.passwordResetExpires = undefined;
   await user.save();
   createSendToken(user, 200, res);
};

exports.updatePassword = async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    return next(res.status(404).json({ message: "no such user is found" }));
  }

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(
      res.status(400).json({ message: "Your current password is wrong" })
    );
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  createSendToken(user, 200, res);
};
