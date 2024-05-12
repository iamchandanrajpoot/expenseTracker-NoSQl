const ForgotPasswordRequest = require("../ForgotPasswordRequest");
const User = require("../userModel");

User.hasMany(ForgotPasswordRequest, {foreignKey: "userId"})
ForgotPasswordRequest.belongsTo(User, {foreignKey: "userId"})