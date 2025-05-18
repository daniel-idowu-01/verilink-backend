import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import mongoose from "mongoose";
import config from "./config/constants";
// import { Vendor } from "./models/Vendor";
import { Product } from "./models/Product";
import express, { RequestHandler } from "express";
// import { Transaction } from "./models/Transaction";
import { productRoutes } from "./routes/ProductRoutes";
import { ProductService } from "./services/ProductService";
import { ProductRepository } from "./repositories/ProductRepository";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

const app = express();

// Database connection
mongoose
  .connect(config.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize repositories and services
const productRepository = new ProductRepository(Product);
const productService = new ProductService(productRepository);

// Routes
app.use("/api/products", productRoutes(productService));

// 404 Handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

const PORT = config.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
