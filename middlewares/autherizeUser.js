const jwt = require("jsonwebtoken");
const User = require("../models/user");

const autherizeUser = (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_kEY, async (err, user) => {
        if (err) {
          console.log(err);
          res.status(401).json({ message: "Unauthorized" });
        } else {
          const dbUser = await User.findById(user.id);
          req.user = dbUser;
          next();
        }
      });
    } else {
      console.log("token undefined");
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = autherizeUser;
