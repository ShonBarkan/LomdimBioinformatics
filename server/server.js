import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import config from "./config.js";
import Logger from "./utils/logger.js";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import subjectsRoute from "./routes/Subject.js";
import authRoute from "./routes/auth.js";

// Initialize Express app
const app = express();
app.use(express.json());

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.corsOrigins,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  }
});
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  Logger.info(["server.js"], "Health check requested");
  res.json({
    success: true,
    message: 'LomdimBioinformatics service is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.use('/auth', authRoute);
app.use('/subjects', subjectsRoute);

// Database connection
mongoose.connect(config.mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  Logger.success(["server.js"], "Connected to MongoDB");
})
.catch((error) => {
  Logger.error(["server.js"], `MongoDB connection error: ${error.message}`);
  process.exit(1);
});

// Swagger setup
const swaggerFile = JSON.parse(fs.readFileSync("./swagger-output.json", "utf-8"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

Logger.info(["server.js"], `Swagger API docs available at /docs`);


// Start server
const PORT = config.port;
app.listen(PORT, () => {
  Logger.success(["server.js"], `LomdimBioinformatics service running on http://localhost:${PORT}`);
  Logger.info(["server.js"], `Health check: http://localhost:${PORT}/health`);
  Logger.info(["server.js"], `API base path: http://localhost:${PORT}/api/`);
  Logger.info(["server.js"], `Swagger docs: http://localhost:${PORT}/docs`);
});

export default app;
