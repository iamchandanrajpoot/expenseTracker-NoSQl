const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const ForgotPasswordRequest = sequelize.define(
  "ForgotPasswordRequest",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
    },
  },
  { timestamps: false }
);

module.exports = ForgotPasswordRequest;
