const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const connectDB = require("./config/db");
const errorHandeler = require("./middleware/error");

// load env var
dotenv.config({ path: "./config/config.env" });

connectDB();

// route files
const bootcamps = require("./routes/bootcamps.js");
const courses = require("./routes/course");

const server = express();

// body parser
server.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    server.use(morgan("dev"));
}

// file uploading
server.use(fileupload());

// set static folder
server.use(express.static(path.join(__dirname, "public")));

// mount routers
server.use("/api/v1/bootcamps", bootcamps);
server.use("/api/v1/courses", courses);

// handle error
server.use(errorHandeler);

const PORT = process.env.PORT || "8080";
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