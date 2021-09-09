const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");

// load env var
dotenv.config({ path: "./config/config.env" });
const PORT = process.env.PORT || "8080";

connectDB();

// route files
const bootcamps = require("./routes/bootcamps.js");

const server = express();

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    server.use(morgan("dev"));
}

// mount routers
server.use("/api/v1/bootcamps", bootcamps);

const app = server.listen(
    PORT, 
    () => console.log(`Serving in ${process.env.NODE_ENV} mode on port ${PORT}`) 
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server and exit process
    app.close(() => process.exit(1));
});