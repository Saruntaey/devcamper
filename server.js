const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

// load env var
dotenv.config({ path: path.join(__dirname, "config/config.env") });
const PORT = process.env.PORT || "8080";

// route files
const bootcamps = require(path.join(__dirname, "routes/bootcamps.js"));

const server = express();

// mount routers
server.use("/api/v1/bootcamps", bootcamps);

server.listen(
    PORT, 
    () => console.log(`Serving in ${process.env.NODE_ENV} mode on port ${PORT}`) 
);
