const authorize = require("../middleware/Authorisation");
const User = require("../models/userModel");
const router = require("express").Router();
const axios = require("axios");
const { AddAbout, Addintro, AddContact } = require("./portfolioRoute");
const bcrypt = require("bcrypt");
// New User Signup//

router.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    const intro = await Addintro(user);
    const about = await AddAbout(user);
    const contact = await AddContact(user);
    return res.json({
      message: "Registered successfully",
      success: true,
      data: { user, intro, about, contact },
      token,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message, success: false });
  }
});

// User Login //

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredential(email, password);
    const token = await user.generateAuthToken();
    // await user.deleteOne({ _id: user._id });
    return res.json({
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/changepassword", authorize, async (req, res) => {
  try {
    let { oldpassword, newpassword } = req.body;
    const user = await User.findById(req.user._id);
    const isAuthenticate = await bcrypt.compare(oldpassword, user.password);
    if (isAuthenticate) {
      newpassword = await bcrypt.hash(newpassword, 8);
      await User.findByIdAndUpdate(req.user._id, { password: newpassword });
      res.json({ success: true, message: "Password Changed successfully" });
    } else {
      throw new Error("Invalid Credientials");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// User Logout //

router.post("/logout", authorize, async (req, res) => {
  try {
    req.user.tokens = await req.user.tokens.filter(
      ({ token }) => token !== req.token
    );
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = router;
