const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

// load env var
dotenv.config({ path: path.join(__dirname, "config/config.env") });
const PORT = process.env.PORT || "8080";

const server = express();

server.get("/api/v1/bootcamps", (req, res) => {
    res.status(200).json({ success: true, msg: "Show all bootcamps" });
});

server.get("/api/v1/bootcamps/:id", (req, res) => {
    res.status(200).json({ success: true, msg: `Show bootcamp ${req.params.id}` });
});

server.post("/api/v1/bootcamps", (req, res) => {
    res.status(200).json({ success: true, msg: "Create a new bootcamp" });
});

server.put("/api/v1/bootcamps/:id", (req, res) => {
    res.status(200).json({ success: true, msg: `Update bootcamp ${req.params.id}` });
});

server.delete("/api/v1/bootcamps/:id", (req, res) => {
    res.status(200).json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
});

server.listen(
    PORT, 
    () => console.log(`Serving in ${process.env.NODE_ENV} mode on port ${PORT}`) 
);
