const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isPremiumUser: {
    type: Boolean,
    default: false,
  },
  totalExpense: {
    type: Number,
    required: true,
    default: 0,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/dbConfig");

// const User = sequelize.define("User", {
//     id:{
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     isPremiumUser: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false
//     },
//     name:{
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     email:{
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//     },
//     password: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     totalExpense: {
//         type : DataTypes.INTEGER,
//         defaultValue: 0,
//         allowNull: false
//     }
// }, {timestamps: false})

// module.exports = User;
