const express = require("express");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();
//Registration
userRouter.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        res.json({ err: err.message });
      } else {
        const user = new userModel({ name, email, password: hash });
        await user.save();
      }
    });

    res.json({ msg: "user has been registered", user: req.body });
  } catch (err) {
    res.json({ err: err.message });
  }
});

//Login
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          let token = jwt.sign({ userID: user._id, user: user.name }, "masai");
          res.json({ msg: "Logged In..!", token });
        } else {
          res.json({ error: "wrong crencicals" });
        }
      });
    } else {
      res.json({ msg: "user does not exitst..!!" });
    }
  } catch (err) {
    res.json({ err: err.message });
  }
});

module.exports = userRouter;
