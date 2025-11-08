import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 3001,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/LomdimBioinformatics',
  jwtSecret: process.env.JWT_SECRET || 'super-secret-jwt-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 6,
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  corsOrigins: process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
    : '*'
};

export default config;