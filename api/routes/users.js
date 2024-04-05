const router = require("express").Router();
const User = require("../models/User.js");
const Post = require("../models/Post.js");
const bcrypt = require("bcrypt");

//Update
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("You can update only your account");
    console.log(err);
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  console.log(req.params.id)
  if (req.body.userId === req.params.id || req.body.username == 'admin' ) {
    try {
      const user = await User.findById(req.params.id);
     try {
        await Post.deleteMany({username:user.username});
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
      } catch (err) {
        res.status(500).json(err)
      }
    } catch (err) {
      res.status(404).json("User not found");
    }
  } else {
    res.status(401).json("You can delete only your account");
  }
});

router.get("/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const { password, ...others } = user._doc;
      res.status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  });

  router.get("/", async (req, res) => {
    try {
      const users = await User.find();
      // const { password, ...others } = users._doc;
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  });
module.exports = router;
