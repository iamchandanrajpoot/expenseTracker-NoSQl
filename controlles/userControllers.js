const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.postRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      res.json({
        message: `already register with this email ${email}`,
      });
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: hashPassword,
      });
      await newUser.save();
      res.json({ message: "succussfully register" });
    }
  } catch (error) {
    res.json({ message: "internal server error" });
  }
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // const user = await User.findOne({ where: { email: email } });
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      if (!(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ message: "User not authorized" });
      } else {
        jwt.sign({ id: user._id }, process.env.JWT_SECRET_kEY, (err, token) => {
          if (!err) {
            res
              .status(200)
              .json({ message: "successfully login", token: token });
          } else {
            res.status(500).json({ message: "error during creatin token" });
          }
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};
