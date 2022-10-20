import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDatabase from "./config/MongoDb.js";
import ImportData from "./DataImport.js";
import { errorHandler, notFound } from "./Middleware/Errors.js";
import userRouter from "./Routes/UserRoutes.js";
import transferRouter from "./Routes/TransferRoutes.js";

dotenv.config();
connectDatabase();
const app = express();
app.use(cors());
app.use(express.json());

// API
app.use("/api/import", ImportData);
app.use("/api/users", userRouter);
app.use("/api/transactions", transferRouter);

// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 1000;

app.listen(PORT, console.log(`server run in port ${PORT}`));
