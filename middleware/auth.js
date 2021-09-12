const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandeler = require("./async");
const User = require("../models/user");

exports.protect = asyncHandeler(async (req, res, next) => {
    
    let token;

    if (req.headers.authorization 
        && req.headers.authorization.startsWith("Bearer")) {
        // set token from Bearer token in header
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
        // set token from cookie
        token = req.cookies.token
    }

    // make sure token exists
    if (!token) {
        return next(new ErrorResponse("Not authorize to access this route", 401));
    }

    try {
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        next(new ErrorResponse("Not authorize to access this route", 401));
    }
});

// grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User role ${req.user.role} is unauthorized to access this route`, 403));
        }
        next();
    }
}