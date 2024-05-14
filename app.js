// const https = require("https");
const express = require("express");
// const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
// const fs = require("fs");
// const morgan = require("morgan");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
dotenv.config();

const userRouter = require("./routes/userRoutes");
const expenseRouter = require("./routes/expenseRoutes");
// const purchaseRouter = require("./routes/purchaseRoutes");
// const forgetPswRouter = require("./routes/forgetPswRoutes");

const app = express();

// const privatkey = fs.readFileSync("server.key");
// const certificate = fs.readFileSync("server.crt");
// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "access.log"),
//   {
//     flags: "a",
//   }
// );
// app.use(morgan("combined", { stream: accessLogStream }));
// app.use(helmet());
// app.use((req, res, next) => {
//   res.setHeader(
//     "Content-Security-Policy",
//     "script-src 'self' https://checkout.razorpay.com; "
//   );
//   next();
// });

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/user", userRouter);
app.use("/api", expenseRouter);
// app.use("/purchase", purchaseRouter);
// app.use("/password", forgetPswRouter);

// app.use((req, res) => {
//   console.log(req.url);
//   res.sendFile(path.join(__dirname, `/public/${req.url}`));
// });

mongoose
  .connect(process.env.MONGO_CONNECTION_URI)
  .then((result) => {
    app.listen(process.env.PORT, () => {
      console.log(`App is running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
// sequelize
//   .sync()
//   // .sync({force: true})
//   .then(() => {
//     console.log("model synced database connected");
//     app.listen(process.env.PORT, () => {
//       console.log(`App is running on http://localhost:${process.env.PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });
