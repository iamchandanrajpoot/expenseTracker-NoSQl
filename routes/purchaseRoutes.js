const { Router } = require("express");
const {
  purchasePremium,
  updateTransactionStatus,
  getLeaderBoardData,
} = require("../controlles/purchaseController");
const autherizeUser = require("../middlewares/autherizeUser");

const router = Router();

router.get("/premium-membership", autherizeUser, purchasePremium);
router.post(
  "/update-transaction-status",
  autherizeUser,
  updateTransactionStatus
);
router.get("/leader-board", autherizeUser, getLeaderBoardData);

module.exports = router;
