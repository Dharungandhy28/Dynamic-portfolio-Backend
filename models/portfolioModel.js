const mongoose = require("mongoose");

const introschema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  welcomeText: {
    type: String,

    default: "",
  },
  firstName: {
    type: String,

    default: "",
  },
  middleName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,

    default: "",
  },
  caption: {
    type: String,

    default: "",
  },
  description: {
    type: String,

    default: "",
  },
});

const aboutschema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  imgurl: {
    type: String,

    default: "",
  },
  description1: {
    type: String,

    default: "",
  },
  description2: {
    type: String,

    default: "",
  },
  skills: {
    type: Array,
  },
});

const experienceshema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  title: {
    type: String,
    required: true,
    default: "",
  },
  period: {
    type: String,
    required: true,
    default: "",
  },
  company: {
    type: String,
    required: true,
    default: "",
  },
  description: {
    type: String,
    required: true,
    default: "",
  },
});

const projectschema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  title: {
    type: String,
    required: true,
    default: "",
  },
  description: {
    type: String,
    required: true,
    default: "",
  },
  image: {
    type: String,
    required: true,
    default: "",
  },
  link: {
    type: String,
    required: true,
    default: "",
  },
  technology: {
    type: Array,
    required: true,
  },
});

const courseschema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  title: {
    type: String,
    required: true,
    default: "",
  },
  description: {
    type: String,
    required: true,
    default: "",
  },
  image: {
    type: String,
    required: true,
    default: "",
  },
  link: {
    type: String,
    required: true,
    default: "",
  },
});

const contactschema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  name: {
    type: String,

    default: "",
  },
  email: {
    type: String,

    default: "",
  },
  mobile: {
    type: String,

    default: "",
  },
  gender: {
    type: String,

    default: "",
  },
  country: {
    type: String,

    default: "",
  },
  github: {
    type: String,
    default: "",
  },
  linkedin: {
    type: String,
    default: "",
  },
});

module.exports = {
  Intro: mongoose.model("intro", introschema, "intro"),
  About: mongoose.model("about", aboutschema, "about"),
  Experience: mongoose.model("experience", experienceshema, "experience"),
  Project: mongoose.model("project", projectschema, "projects"),
  Course: mongoose.model("course", courseschema, "courses"),
  Contact: mongoose.model("contact", contactschema, "contacts"),
};
