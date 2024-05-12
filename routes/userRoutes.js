const { Router } = require("express");
const {
  postRegister,
  postLogin,
  getUser,
} = require("../controlles/userControllers");
const autherizeUser = require("../middlewares/autherizeUser");
const { downloadExpense , getDownloadedfiles} = require("../controlles/expenseController");

const router = Router();

router.post("/register", postRegister);
router.post("/login", postLogin);
router.get("/", autherizeUser, getUser);
router.get("/download", autherizeUser, downloadExpense)
router.get("/downloaded-files", autherizeUser, getDownloadedfiles)

module.exports = router;
