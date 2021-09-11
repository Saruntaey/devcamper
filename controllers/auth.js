const Bootcamp = require("../models/bootcamp");
const User = require("../models/user");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandeler = require("../middleware/async");

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandeler(async (req, res, next) => {
    // create user
    const user = await User.create(req.body);

    // creata token
    const token = user.getSighedJwtToken();
    res.status(200).json({ success: true, token });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandeler(async (req, res, next) => {
    const { email, password } = req.body;

    // validate email and password
    if (!email || !password) {
        return next(new ErrorResponse("Please provide an email and password", 400));
    }

    // check user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorResponse("Invaild credentials", 401));
    }

    // check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    // creata token
    const token = user.getSighedJwtToken();
    res.status(200).json({ success: true, token });
});