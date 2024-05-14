const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const transporter = require("../config/nodemailer");
const User = require("../models/user");
const ForgotPasswordRequest = require("../models/ForgotPasswordRequest");

exports.forgetPsw = async (req, res) => {
  try {
    const { email } = req.body;
    //finding user with given email
    const user = await User.findOne({ email });
    if (user) {
      const token = uuidv4();
      // //   creating forgot password request
      const forgotPasswordRequest = new ForgotPasswordRequest({
        token: token,
        isActive: true,
        userId: user._id,
      });
      await forgotPasswordRequest.save();

      //   await user.createForgotPasswordRequest({
      //     id: token,
      //     isActive: true,
      //   });
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
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const token = req.params.id;
    const forgotPasswordRequest = await ForgotPasswordRequest.findOne({
      token,
    });
    if (forgotPasswordRequest) {
      if (forgotPasswordRequest.isActive) {
        forgotPasswordRequest.isActive = false;
        await forgotPasswordRequest.save();
        return res.status(200).send(`
        <html>
        <script>
            function formsubmitted(e){
                e.preventDefault();
                console.log('called')
            }
        </script>

        <form action="/password/updatepassword/${token}" method="get">
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
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { newpassword } = req.query;
    const token = req.params.id;
    // Find the userId associated with the token
    const forgotPasswordRequest = await ForgotPasswordRequest.findOne({
      token,
    }).populate("userId");
    console.log(forgotPasswordRequest);
    if (!forgotPasswordRequest) {
      return res
        .status(404)
        .json({ message: "Token not found", success: false });
    }

    const userId = forgotPasswordRequest.userId._id;

    // Check if userId is valid
    if (!userId) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // // Find the user by userId
    const user = await User.findById(userId);

    const hashedPsw = await bcrypt.hash(newpassword, 10);

    // // Await the update operation
    user.password = hashedPsw;
    await user.save();

    res
      .status(201)
      .json({ message: "Successfully updated the password", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
