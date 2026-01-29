import userRoutes from "./user/user.routes";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { json } from "express";
import morgan from "morgan";

// Import routes (to be implemented)
import transactionRoutes from "./transaction/transaction.routes";
import categoryRoutes from "./category/category.routes";
import walletRoutes from "./wallet/wallet.routes";
import summaryRoutes from "./summary/summary.routes";
import { errorHandler } from "./middleware/error.middleware";
import createHttpError from "http-errors";

dotenv.config();

const app = express();

// Logging middleware
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(cors());
app.use(json());
app.use("/users", userRoutes);

app.use("/transactions", transactionRoutes);
app.use("/categories", categoryRoutes);
app.use("/wallets", walletRoutes);
app.use("/summary", summaryRoutes);

app.use((req, res, next) => {
  const error = createHttpError(404, `Cannot ${req.method} ${req.originalUrl}`);

  next(error);
});

app.use(errorHandler); // Centralized error handler
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server started on :${port}`);
});
export default app;
