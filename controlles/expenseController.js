const uuid = require("uuid");
const sequelize = require("../config/dbConfig");
const User = require("../models/userModel");
const uploadToS3 = require("../utils/uploadFileToS3");
const getExpensesOfUser = require("../utils/getExpenseOfUser");

exports.postExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userInstance = await User.findByPk(req.user.id);
    const { expendicture, description, category } = req.body;
    
    const expense = await userInstance.createExpense(
      {
        expendicture,
        description,
        category,
      },
      { transaction: t }
    );
    await userInstance.update(
      {
        totalExpense:
          parseInt(userInstance.totalExpense) + parseInt(expendicture),
      },
      { transaction: t }
    );
    await t.commit();
    res.status(201).json({ successful: true, expense });
  } catch (error) {
    t.rollback();
    // console.log(error);
    res
      .status(500)
      .json({ successful: false, message: "interanl server error" });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    console.log(req.query);
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perpage);
    const userInstance = await User.findByPk(req.user.id);
    const expenses = await userInstance.getExpenses({
      limit: perPage,
      offset: (page - 1) * perPage,
    });

    // Count total expenses without fetching all
    const totalCount = await userInstance.countExpenses();
    const totalPages = Math.ceil(totalCount/perPage)

    // Check if expenses exist
    if (expenses) {
      res.status(200).json({ expenses, totalPages });
    } else {
      res.status(404).json({ message: "No expenses found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

exports.getExpenseById = async (req, res) => {
  try {
    const userInstance = await User.findByPk(req.user.id);
    const expenses = await userInstance.getExpenses({
      where: { id: req.params.expenseId },
    });
    res.status(200).json(expenses[0]);
  } catch (error) {
    console.log(error);
    res.satatus(500).json({ message: "internal server error" });
  }
};

exports.deleteExpenseById = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userInstance = await User.findByPk(req.user.id);
    const expenses = await userInstance.getExpenses({
      where: { id: req.params.expenseId },
    });
    const updatedExpense =
      parseInt(userInstance.totalExpense) - parseInt(expenses[0].expendicture);
    await expenses[0].destroy({ transaction: t });
    await userInstance.update(
      { totalExpense: updatedExpense },
      { transaction: t }
    );

    await t.commit();
    return res.json({ message: "Deleted" });
  } catch (error) {
    await t.rollback();
    // console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

// download expense

exports.downloadExpense = async (req, res) => {
  try {
    const userInstance = await User.findByPk(req.user.id);
    if (userInstance.isPremiumUser) {
      const expenses = await getExpensesOfUser(req);
      const stringifiedExpenses = JSON.stringify(expenses);
      const filename = "expense" + uuid.v4() + ".txt";
      const data = await uploadToS3(stringifiedExpenses, filename);

      await userInstance.createDownloadFile({ fileUrl: data.Location });

      res.status(201).json({ fileUrl: data.Location, success: true });
    }
  } catch (error) {
    res.status(500).json({message: "internal server error"})
  }
};

exports.getDownloadedfiles = async (req, res) => {
  try {
    const userInstance = await User.findByPk(req.user.id);
    if (userInstance.isPremiumUser) {
      const downloadFiles = await userInstance.getDownloadFiles();
      res.status(200).json({ downloadFiles, success: true });
    }
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};
