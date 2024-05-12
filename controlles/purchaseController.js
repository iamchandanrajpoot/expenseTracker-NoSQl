const razorpay = require("../config/razarpay");
const User = require("../models/userModel");
const verifyPaymentStatus = require("../utils/verifyPayments");

exports.purchasePremium = async (req, res) => {
  try {
    const amount = 5000;

    // Create order using Razorpay instance
    const order = await new Promise((resolve, reject) => {
      razorpay.orders.create({ amount, currency: "INR" }, (err, order) => {
        if (err) reject(err);
        else resolve(order);
      });
    });

    const userInstance = await User.findByPk(req.user.id);
    // Create order
    const createOrderRes = await userInstance.createOrder({
      orderId: order.id,
      status: "PENDING",
    });

    if (createOrderRes) {
      res.status(201).json({ order, key_id: razorpay.key_id });
    } else {
      console.log("Something went wrong during creating order");
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const { order_id, payment_id, status } = req.body;
    console.log(req.body);

    // Find the user instance
    const userInstance = await User.findByPk(req.user.id);
    if (!userInstance) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the order associated with the user
    const userOrders = await userInstance.getOrders({
      where: { orderId: order_id },
    });
    if (!userOrders || userOrders.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isPaymentSuccessful = await verifyPaymentStatus(payment_id);
    if (!isPaymentSuccessful) {
      // Payment failed, update order status to "FAILED"
      await userOrders[0].update({ status: status });
      return res.status(400).json({ message: "Payment failed" });
    }

    // Payment successful, update order status to "SUCCESSFUL" and user premium status
    await Promise.all([
      userOrders[0].update({ paymentId: payment_id, status: status }),
      userInstance.update({ isPremiumUser: true }),
    ]);

    res.status(202).json({ message: "Transaction successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getLeaderBoardData = async (req, res) => {
  try {
    const leaderBoardData = await User.findAll({
      attributes: ["id", "name", "totalExpense"],
      order: [["totalExpense", "DESC"]],
    });
    res.status(200).json(leaderBoardData);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
