const express = require("express");
const cors = require("cors");
const globalError = require("./error/error");
const connectDb = require("./db/db");
const config = require("./config/config");
// const router = require("./router/product.router");
const path = require("path");
const adminAuthRouter = require("./router/admin/admin.auth.router");
const frontendAuthRouter = require("./router/frontend/frontend.auth.router");
const adminUserRouter = require("./router/admin/admin.user.router");
const { uploadImage } = require("./controller/ImageUpload.Controller");
const adminHomeControlRouter = require("./router/admin/admin.homeControll.router");
const frontendHomeControlRouter = require("./router/frontend/frontend.controll.router");
const adminHomeFooterControlRouter = require("./router/admin/admin.homeFooterControll.router");
// const { uploadImage } = require("./controller/ImageUpload.Controller");

// Create app
const app = express();

// Use middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      `https://${process.env.SITE_URL}`,
      `http://${process.env.SITE_URL}`,
      `http://www.${process.env.SITE_URL}`,
      `www.${process.env.SITE_URL}`,
      `${process.env.SITE_URL}`,
      "*",
    ], // Allow requests from frontend
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allow specified methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
  })
);

app.use(cors());

app.use(express.urlencoded({ extended: true })); // For form data parsing (optional, not needed for multipart)
app.use(express.json()); // For JSON data (not needed for file uploads)

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// * Image upload route (uses multer from uploadImage controller)

app.post("/upload", uploadImage); // Matches frontend fetch URL

// * admin routes
app.use("/api/v1/admin", [
  adminAuthRouter,
  adminUserRouter,
  adminHomeControlRouter,
  adminHomeFooterControlRouter,
]);

// * view customer user routers
app.use("/api/v1/frontend", [frontendAuthRouter, frontendHomeControlRouter]);

// Custom middleware (if any can go here)

// Global error handler
app.use(globalError);

// Private route
app.get("/private", (req, res) => {
  return res.status(200).json({
    message: "I am a private route",
  });
});

// Root route
app.get("/", (req, res) => {
  res.send({
    message: "This is the root route",
  });
});

// MongoDB connection and server start
connectDb(config.DB_CONN)
  .then(() => {
    console.log("Database connected");
    app.listen(config.PORT, () => {
      console.log(`Server is running at ${config.PORT}`);
    });
  })
  .catch((e) => console.log("Database connection failed:", e));

module.exports = app; // Optional: export app for testing or other modules

// added 2
