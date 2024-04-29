const express = require("express");
const router = express.Router();
const User = require("../models/UserModel").UserModel;
const bcrypt = require("bcrypt");
const jwt = require("../utils/middleware");

router.post("/register", async (req, res) => {
  try {
    const { username, password, fullName, email, phone } = req.body;
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username: username,
      password: hashedPassword,
      fullName: fullName,
      email: email,
      phone: phone,
      bookings: [],
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    console.log(user);
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const details = user.toObject();
    delete details.password;
    const token = jwt.createToken(details);
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
