const { Router } = require("express");
const {
  postExpense,
  getExpenses,
  getExpenseById,
  deleteExpenseById,
} = require("../controlles/expenseController");
const autherizeUser = require("../middlewares/autherizeUser");

const router = Router();

router.post("/add-expense", autherizeUser, postExpense);
router.get("/expenses", autherizeUser, getExpenses);
router.get("/expenses/:expenseId", autherizeUser, getExpenseById);
router.delete("/expenses/:expenseId", autherizeUser, deleteExpenseById);

module.exports = router;
