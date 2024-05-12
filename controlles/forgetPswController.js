const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/userModel");
const ForgotPasswordRequest = require("../models/ForgotPasswordRequest");
const transporter = require("../config/nodemailer");

exports.forgetPsw = async (req, res) => {
  try {
    const { email } = req.body;
    const userInstance = await User.findOne({ where: { email: email } });
    if (userInstance) {
      const token = uuidv4();
      await userInstance.createForgotPasswordRequest({
        id: token,
        isActive: true,
      });
      const info = await transporter.sendMail({
        from: "easeweb1@gmail.com",
        to: email,
        subject: "fhfkyu",
        html: `<p>Click <a href="http://localhost:4000/password/resetpassword/${token}">here</a> to reset your password.</p>`,
      });
      console.log(info);
      return res.send({ email });
    } else {
      return res.json({ message: "wrong email" });
    }
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const id = req.params.id;
    const forgotPasswordRequest = await ForgotPasswordRequest.findOne({
      where: { id },
    });
    if (forgotPasswordRequest) {
      if (forgotPasswordRequest.isActive) {
        await forgotPasswordRequest.update({ isActive: false });
        return res.status(200).send(`
        <html>
        <script>
            function formsubmitted(e){
                e.preventDefault();
                console.log('called')
            }
        </script>

        <form action="/password/updatepassword/${id}" method="get">
            <label for="newpassword">Enter New password</label><br/>
            <input name="newpassword" type="password" required></input>
            <button>reset password</button>
        </form>
       </html>`);
      } else {
        res.send({ message: "this link is inactive now" });
      }
    }
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { newpassword } = req.query;
    const token = req.params.id;
    const userIdObj = await ForgotPasswordRequest.findOne({
      where: { id: token },
      attributes: ["userId"],
    });

    const userInstance = await User.findOne({
      where: { id: userIdObj.userId },
    });
    // console.log(userInstance);
    const hashedPsw = await bcrypt.hash(newpassword, 10);
    await userInstance.update({ password: hashedPsw });

    res
      .status(201)
      .json({ message: "Successfully updated the password", success: true });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "internal server error", success: false });
  }
};
