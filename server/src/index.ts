import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { userRouter } from "./routes/user";
import { productRouter } from "./routes/product";
import { adminRouter } from "./routes/admin";
import { orderRouter } from "./routes/order";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(express.json());
app.use(cors());
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/admin", adminRouter);
app.use("/order", orderRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
