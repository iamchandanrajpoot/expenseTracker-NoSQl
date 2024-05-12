const downloadFile = require("../downloadsFiles");
const User = require("../userModel");

User.hasMany(downloadFile, {foreignKey: "userId"});
downloadFile.belongsTo(User, {foreignKey: "userId"})