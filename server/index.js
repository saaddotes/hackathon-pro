import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import auth from "./routes/auth.js";

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("DB connected Successfully");
  })
  .catch((err) => {
    console.log("Failed to connect DB : " + err.message);
  });

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", auth);

app.listen(process.env.PORT, () => {
  console.log(`Server is running at : http://localhost:${process.env.PORT}`);
});
