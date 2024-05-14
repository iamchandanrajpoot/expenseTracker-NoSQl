const mongoose = require("mongoose");

const downloadFileSchema = mongoose.Schema({
  fileUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const DownloadFile = mongoose.model("DownloadFile", downloadFileSchema);

module.exports = DownloadFile;

// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/dbConfig");

// const downloadFile = sequelize.define("downloadFile",{
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         allowNull: false,
//         autoIncrement: true,
//     },
//     fileUrl: {
//         type: DataTypes.STRING,
//         allowNull: false
//     }
// }, {timestamps: false})

// module.exports = downloadFile;
