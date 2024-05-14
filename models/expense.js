const mongoose = require("mongoose");
const expenseSchema = new mongoose.Schema({
  expendicture: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;

// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/dbConfig");

// const Expense = sequelize.define(
//   "Expense",
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       allowNull: false,
//       primaryKey: true,
//     },
//     expendicture: {
//         type: DataTypes.DOUBLE,
//         allowNull: false,
//     },
//     description:{
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     category:{
//         type: DataTypes.STRING,
//         allowNull: false
//     }
//   },
//   { timestamps: false }
// );

// module.exports = Expense;
