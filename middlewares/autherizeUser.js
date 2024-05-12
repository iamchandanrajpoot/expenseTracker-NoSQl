const jwt = require("jsonwebtoken");
const autherizeUser = (req, res, next) => {
  try {
    // console.log(req.headers)
    const token = req.headers["authorization"];
    console.log(token);
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_kEY, (err, user) => {
        if (err) {
          console.log(err);
        } else {
          console.log(user);
          req.user = user;
          next();
        }
      });
    } else {
      console.log("token undefined");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = autherizeUser;
