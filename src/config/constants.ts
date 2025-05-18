const constants = {
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/myapp",
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret",
};

export default constants;
