import fs from "fs";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import mongoose from "mongoose";
import logger from "./utils/logger";
import v1Routes from "./routes/v1/index";
import config from "./config/constants";
import { Product } from "./models/Product";
// import { Vendor } from "./models/Vendor";
// import { Transaction } from "./models/Transaction";
import { productRoutes } from "./routes/v1/ProductRoutes";
import { requestLogger, errorLogger } from "./middlewares/requestLogger";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

const app = express();

const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Database connection
mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err) => logger.error("MongoDB connection error:", err));

// Middlewares
app.use(cors());
app.use(helmet());
// app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Routes
app.use("/api/v1", v1Routes);

// 404 Handler
app.use(notFoundHandler);

// Error logging
app.use(errorLogger);

// Error handler
app.use(errorHandler);

const PORT = config.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});

export default app;
