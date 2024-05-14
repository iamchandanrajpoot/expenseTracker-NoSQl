const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  paymentId: {
    type: String,
  },
  orderId: {
    type: String,
  },
  status: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Oder = mongoose.model("Order", orderSchema);

module.exports = Order;

// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/dbConfig");

// const Order = sequelize.define("Order", {
//   id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   paymentId: DataTypes.STRING,
//   orderId: DataTypes.STRING,
//   status: DataTypes.STRING,
// });

// module.exports = Order;
