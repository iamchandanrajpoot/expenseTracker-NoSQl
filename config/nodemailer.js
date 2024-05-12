const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: "iamchandanrajpoot@gmail.com",
        pass: process.env.BREVO_API_KEY
    }
});

module.exports = transporter;
