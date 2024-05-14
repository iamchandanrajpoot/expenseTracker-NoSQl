const razorpay = require("../config/razarpay");
const Order = require("../models/order");
const User = require("../models/user");
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
    const createOrderRes = new Order({
      userId: req.user._id,
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

    // get all orders of user
    const order = await Order.findOne({
      userId: req.user._id,
      orderId: order_id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isPaymentSuccessful = await verifyPaymentStatus(payment_id);

    if (!isPaymentSuccessful) {
      // Payment failed, update order status to "FAILED"
      await order.updateOne({ status: status });
      return res.status(400).json({ message: "Payment failed" });
    }

    // Payment successful, update order status to "SUCCESSFUL" and user premium status
    await Promise.all([
      order.updateOne({ paymentId: payment_id, status: status }),
      req.user.updateOne({ isPremiumUser: true }),
    ]);

    res.status(202).json({ message: "Transaction successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getLeaderBoardData = async (req, res) => {
  try {
    const leaderBoardData = await User.find()
      .select({
        id: 1,
        name: 1,
        totalExpense: 1,
      })
      .sort({
        totalExpense: -1,
      });

    res.status(200).json(leaderBoardData);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
