const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const errorHandeler = require("./middleware/error");

// load env var
dotenv.config({ path: "./config/config.env" });

connectDB();

// route files
const bootcamps = require("./routes/bootcamps.js");
const courses = require("./routes/course");
const auth = require("./routes/auth");

const server = express();

// body parser
server.use(express.json());

// cookie parser
server.use(cookieParser());

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
server.use("/api/v1/auth", auth);

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