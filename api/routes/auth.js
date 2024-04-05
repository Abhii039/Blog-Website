const router = require("express").Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
router.post("/register", async (req, res) => {
  //register
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    const user = await newUser.save();
   return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
    console.log(err);
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json("Wrong username");

    const validated = await bcrypt.compare(req.body.password, user.password);
    !validated && res.status(400).json("Wrong Data");

    const { password, ...others } = user;
     return res.status(200).json(user);
  } catch (err) {
      return res.status(500).json(err)
    console.log(err);
   
  }
});

module.exports = router;
