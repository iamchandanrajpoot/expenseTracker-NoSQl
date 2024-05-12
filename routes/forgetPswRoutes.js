const { Router } = require("express");
const {
  forgetPsw,
  resetPassword,
  updatePassword,
} = require("../controlles/forgetPswController");

const router = Router();

router.post("/forgotpassword", forgetPsw);
router.get("/resetpassword/:id", resetPassword);
router.get("/updatepassword/:id", updatePassword);
module.exports = router;
