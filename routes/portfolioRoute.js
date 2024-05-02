const router = require("express").Router();
const authorize = require("../middleware/Authorisation");

const {
  Intro,
  About,
  Project,
  Contact,
  Experience,
  Course,
} = require("../models/portfolioModel");
const User = require("../models/userModel");

const updateintro = async (user, intro) => {
  return await Intro.findOneAndUpdate(
    { _id: intro._id, userId: user._id },
    intro,
    { new: true }
  );
};

const Addintro = async (user, data) => {
  const intro = new Intro({ ...data, userId: user._id });
  const Newuser = user;
  Newuser.intro = intro;
  updateuser(Newuser._id, Newuser);
  await intro.save();
  return intro;
};

const updateAbout = async (user, about) => {
  return await About.findOneAndUpdate(
    { _id: about._id, userId: user._id },
    about,
    { new: true }
  );
};

const AddAbout = async (user, data) => {
  const about = new About({ ...data, userId: user._id });

  user.about = about;
  updateuser(user._id, user);
  await about.save();
  return about;
};

const updateContact = async (user, contact) => {
  return await Contact.findOneAndUpdate(
    { _id: contact._id, userId: user._id },
    contact,
    { new: true }
  );
};

const AddContact = async (user, data) => {
  const contact = new Contact({ ...data, userId: user._id });

  user.contact = contact;
  updateuser(user._id, user);
  await contact.save();
  return contact;
};

// share portfolio url//

router.get("/share/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const populateduser = await (
      await (
        await (
          await (
            await (await user.populate("intro")).populate("about")
          ).populate("course")
        ).populate("experience")
      ).populate("project")
    ).populate("contact");
    res.json(populateduser);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// get all portfolioData//

router.get("/get-portfolio-data", authorize, async (req, res) => {
  try {
    const intros = await Intro.find();
    const abouts = await About.find();
    const experiences = await Experience.find();
    const projects = await Project.find();
    const courses = await Course.find();
    const contacts = await Contact.find();

    res.status(200).send({
      intro: intros,
      about: abouts,
      projects: projects,
      contact: contacts[0],
      experiences: experiences,
      courses: courses,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update User//

const updateuser = async (_id, updatedData) => {
  const user = await User.findByIdAndUpdate(_id, updatedData);
  return user;
};

// update intro//

router.post("/update-intro", authorize, async (req, res) => {
  try {
    let intro;
    if (req.body._id) {
      intro = await updateintro(req.user, req.body);
    } else {
      intro = await Addintro(req.user, req.body);
    }

    res.status(200).send({
      data: intro,
      success: true,
      message: "Intro Updated Successfully",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update about//

router.post("/update-about", authorize, async (req, res) => {
  try {
    let about;
    if (req.body._id) {
      about = await updateAbout(req.user, req.body);
    } else {
      about = await AddAbout(req.user, req.body);
    }
    res.status(200).send({
      data: about,
      success: true,
      message: "About Updated Successfully",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Add experience//

router.post("/add-experience", authorize, async (req, res) => {
  try {
    const experience = new Experience({ ...req.body, userId: req.user._id });
    const user = req.user;
    user.experience.push(experience._id);
    await updateuser(req.user._id, user);
    await experience.save();
    res.status(200).send({
      data: experience,
      success: true,
      message: "Experience Added Successfully",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update experience//

router.post("/update-experience", authorize, async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(
      { _id: req.body._id, userId: req.user._id },
      req.body,
      { new: true }
    );
    res.status(200).send({
      data: experience,
      success: true,
      message: "Experience Updated Successfully",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete experience//

router.post("/delete-experience", authorize, async (req, res) => {
  try {
    const user = await req.user.populate("experience");
    const filteredexperience = user.experience.filter(
      (exp) => exp._id != req.body._id
    );
    user.experience = filteredexperience;
    await updateuser(user._id, user);
    const experience = await Experience.findByIdAndDelete({
      _id: req.body._id,
    });

    res.status(200).send({
      data: experience,
      message: "Experience Deleted Successfully",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Add project//

router.post("/add-project", authorize, async (req, res) => {
  try {
    const project = new Project({ ...req.body, userId: req.user._id });
    const user = req.user;
    user.project.push(project._id);
    await updateuser(req.user._id, user);
    await project.save();
    res.status(200).send({
      data: project,
      success: true,
      message: "Project Added Successfully",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update project//

router.post("/update-project", authorize, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      { _id: req.body._id, userId: req.user._id },
      req.body,
      { new: true }
    );
    res.status(200).send({
      data: project,
      success: true,
      message: "Project Updated Successfully",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete project//

router.post("/delete-project", authorize, async (req, res) => {
  try {
    const user = await req.user.populate("project");
    const filteredproject = user.project.filter(
      (exp) => exp._id != req.body._id
    );
    user.project = filteredproject;
    await updateuser(user._id, user);
    const project = await Project.findByIdAndDelete({ _id: req.body._id });
    res.status(200).send({
      data: project,
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Add course//

router.post("/add-course", authorize, async (req, res) => {
  try {
    const course = new Course({ ...req.body, userId: req.user._id });
    const user = req.user;
    user.course.push(course._id);
    await updateuser(req.user._id, user);
    await course.save();
    res.status(200).send({
      data: course,
      success: true,
      message: "Course Added Successfully",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update Course//

router.post("/update-course", authorize, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      { _id: req.body._id, userId: req.user._id },
      req.body,
      { new: true }
    );
    res.status(200).send({
      data: course,
      success: true,
      message: "Course Updated Successfully",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete Course//

router.post("/delete-course", authorize, async (req, res) => {
  try {
    const user = await req.user.populate("course");
    const filteredcourse = user.course.filter((exp) => exp._id != req.body._id);
    user.course = filteredcourse;
    await updateuser(user._id, user);
    const course = await Course.findByIdAndDelete({ _id: req.body._id });
    res.status(200).send({
      data: course,
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update Contact//

router.post("/update-contact", authorize, async (req, res) => {
  try {
    let contact;
    if (req.body._id) {
      contact = await updateContact(req.user, req.body);
    } else {
      contact = await AddContact(req.user, req.body);
    }
    res.status(200).send({
      data: contact,
      success: true,
      message: "Contact Updated Successfully",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = { router, Addintro, AddAbout, AddContact };
