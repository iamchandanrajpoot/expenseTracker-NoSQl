const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const downloadFile = sequelize.define("downloadFile",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    fileUrl: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {timestamps: false})

module.exports = downloadFile;