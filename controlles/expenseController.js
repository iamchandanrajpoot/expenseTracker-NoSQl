const uuid = require("uuid");
// // const sequelize = require("../config/dbConfig");
const uploadToS3 = require("../utils/uploadFileToS3");
const getExpensesOfUser = require("../utils/getExpenseOfUser");
const mongoose = require("mongoose");
const Expense = require("../models/expense");
const DownloadFile = require("../models/downloadsFiles");

exports.postExpense = async (req, res) => {
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();
    const { expendicture, description, category } = req.body;
    const expense = new Expense({
      expendicture,
      description,
      category,
      userId: req.user._id,
    });
    await expense.save({ session });
    // update user total expense
    req.user.totalExpense =
      parseInt(req.user.totalExpense) + parseInt(expendicture);
    await req.user.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ successful: true, expense });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    res
      .status(500)
      .json({ successful: false, message: "interanl server error" });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    console.log(req.query);
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perpage) || 10; // Set a default perPage value
    const offset = (page - 1) * perPage;

    const expenses = await Expense.find({ userId: req.user._id })
      .skip(offset)
      .limit(perPage)
      .exec();
    // Count total expenses for the user without fetching all
    const totalCount = await Expense.countDocuments({ userId: req.user._id });
    // Calculate totalPages
    const totalPages = Math.ceil(totalCount / perPage);
    // Check if expenses exist
    if (expenses.length > 0) {
      res.status(200).json({ expenses, totalPages });
    } else {
      res.status(404).json({ message: "No expenses found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.expenseId,
      userId: req.user._id,
    });

    res.status(200).json(expenses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

exports.deleteExpenseById = async (req, res) => {
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();
    const expense = await Expense.findOneAndDelete(
      {
        _id: req.params.expenseId,
        userId: req.user._id,
      },
      { session }
    );
    const updatedExpense =
      parseInt(req.user.totalExpense) - parseInt(expense.expendicture);
    req.user.totalExpense = updatedExpense;
    await req.user.save({ session });
    // commit transaction
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.log(error);
    // rollback transaction

    await session.abortTransaction();
    session.endSession();

    res.status(500).json({ message: "internal server error" });
  }
};

// // download expense

exports.downloadExpense = async (req, res) => {
  try {
    if (req.user.isPremiumUser) {
      const expenses = await getExpensesOfUser(req);
      const stringifiedExpenses = JSON.stringify(expenses);
      const filename = "expense" + uuid.v4() + ".txt";
      const data = await uploadToS3(stringifiedExpenses, filename);

      const downloadFile = new DownloadFile({
        fileUrl: data.Location,
        userId: req.user._id,
      });

      await downloadFile.save();

      res.status(201).json({ fileUrl: data.Location, success: true });
    }
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

exports.getDownloadedfiles = async (req, res) => {
  try {
    if (req.user.isPremiumUser) {
      const downloadFiles = await DownloadFile.find({
        userId: req.user._id,
      });
      res.status(200).json({ downloadFiles, success: true });
    } else {
      res.status(401).json({ message: "You are not premium user" });
    }
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};
