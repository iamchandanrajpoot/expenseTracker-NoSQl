const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.postRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const isAlreadyRegister = await User.findOne({
      where: { email: email },
    });
    if (isAlreadyRegister) {
      res.json({
        message: `already register with this email ${req.body.email}`,
      });
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      await User.create({ name: name, email: email, password: hashPassword });
      res.json({ message: "succussfully register" });
    }
  } catch (error) {
    // console.log(error);
    res.json({ message: "internal server error" });
  }
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      if (!(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ message: "User not authorized" });
      } else {
        jwt.sign(
          { id: user.id, isPremiumUser: user.isPremiumUser },
          process.env.JWT_SECRET_kEY,
          (err, token) => {
            if (!err) {
              res
                .status(200)
                .json({ message: "successfully login", token: token });
            } else {
              res.status(500).json({ message: "error during creatin token" });
            }
          }
        );
      }
    }
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    console.log("control comes inside getUser");
    res.status(200).json(user);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};
