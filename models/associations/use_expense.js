const Expense = require("../expenseModel");
const User = require("../userModel");

User.hasMany(Expense, {foreignKey: "userId"});
Expense.belongsTo(User, {foreignKey: "userId"});