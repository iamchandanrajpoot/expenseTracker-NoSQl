const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Expense = sequelize.define(
  "Expense",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    expendicture: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false
    },
    category:{
        type: DataTypes.STRING,
        allowNull: false
    }
  },
  { timestamps: false }
);

module.exports = Expense;
