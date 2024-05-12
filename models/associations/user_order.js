const Order = require("../order");
const User = require("../userModel");

User.hasMany(Order);
Order.belongsTo(User);