const User = require("../models/userModel");

async function getExpensesOfUser(req){
    const userInstance  = await User.findByPk(req.user.id);
    return   userInstance.getExpenses();
}

module.exports = getExpensesOfUser;