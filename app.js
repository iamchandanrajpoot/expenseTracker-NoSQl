const express = require("express");
const cors = require("cors");
const path = require("path");

const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
dotenv.config();

const userRouter = require("./routes/userRoutes");
const expenseRouter = require("./routes/expenseRoutes");
const purchaseRouter = require("./routes/purchaseRoutes");
const forgetPswRouter = require("./routes/forgetPswRoutes");

const app = express();

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' https://checkout.razorpay.com; "
  );
  next();
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/user", userRouter);
app.use("/api", expenseRouter);
app.use("/purchase", purchaseRouter);
app.use("/password", forgetPswRouter);

app.use((req, res) => {
  console.log(req.url);
  res.sendFile(path.join(__dirname, `/public/${req.url}`));
});

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
