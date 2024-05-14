const Expense = require("../models/expense");

async function getExpensesOfUser(req) {
  return await Expense.find({
    user: req.user._id,
  });
}

module.exports = getExpensesOfUser;
