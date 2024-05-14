const mongoose = require("mongoose");

const forgotPasswordRequestSchema = new mongoose.Schema({
  token: {
    //tupe will be uuid
    type: "UUID",
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
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
