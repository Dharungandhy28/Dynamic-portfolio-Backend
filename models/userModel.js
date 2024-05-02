const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  intro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "intro",
  },
  about: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "about",
  },
  course: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
    },
  ],
  experience: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "experience",
    },
  ],
  project: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
    },
  ],
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "contact",
  },
  tokens: {
    type: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
});

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

UserSchema.statics.findByCredential = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid Credential!");
  }
  const isAuthenticate = await bcrypt.compare(password, user.password);
  if (!isAuthenticate) {
    throw new Error("Invalid Credential!");
  }

  return (
    await (
      await (
        await (
          await (await user.populate("intro")).populate("about")
        ).populate("course")
      ).populate("experience")
    ).populate("project")
  ).populate("contact");
};
const User = model("users", UserSchema, "users");
module.exports = User;
