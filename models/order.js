const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  paymentId: DataTypes.STRING,
  orderId: DataTypes.STRING,
  status: DataTypes.STRING,
});

module.exports = Order;
