const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
//name, email, photo, password, passwordConfirm

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name must be provided"],
  },
  email: {
    type: String,
    required: [true, "An email must be provided"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  mobile: {
    type: Number,
    required: true,
  },
  photo: String,
  role: {
    type: String,
    enum: ["user", "instructor", "admin"],
    default: "user",
  },
  eduBackground: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: [true, "A password must be provided"],
    min: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Must be provided"],
    select: false,
    validate: {
      // work only with --Create and Save-- method and not with update or any other
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  isActive: {
    type: Boolean,
    default: true,
    select: false, //so that no one knows that this active flag is here
  },
  attendance: {
    type: Number,
  },
},
{timestamps: true}
);

userSchema.pre("save", async function (next) {
  //only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  //to hash the user password at the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});
//middleware

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 10000;
  next();
});

userSchema.pre(/^find/, function (next) {
  //calling Regex exp in the current query
  this.find({ isActive: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async (
  candidatePassword,
  userPassword
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.passwordChangedAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const passwordChanged = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(passwordChanged, JWTTimestamp);
    return JWTTimestamp < passwordChanged;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex"); //send to user & like a reset password which user can use to create a new real password. Only user has access to this token.(this token should never be stored in db)

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex"); //hashed reset token stored in db

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //miliseconds
  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
