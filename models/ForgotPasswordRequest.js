const mongoose = require("mongoose");

const forgotPasswordRequestSchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    required: tre,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const ForgotPasswordRequest = mongoose.model(
  "ForgotPasswordRequest",
  forgotPasswordRequestSchema
);

module.exports = ForgotPasswordRequest;
// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/dbConfig");

// const ForgotPasswordRequest = sequelize.define(
//   "ForgotPasswordRequest",
//   {
//     id: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       primaryKey: true,
//     },

//     isActive: {
//       type: DataTypes.BOOLEAN,
//     },
//   },
//   { timestamps: false }
// );

// module.exports = ForgotPasswordRequest;
