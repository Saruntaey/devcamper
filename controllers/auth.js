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

    sendTokenResponse(user, 200, res);
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

    sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: req.user
    });
};

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandeler(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    if (!user) {
        return next(new ErrorResponse(`There is no user with email ${req.body.email}`, 404));
    }

    // get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        data: user
    });
});


// get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === "production") {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie("token", token, options)
        .json({
            success: true,
            token
        })
};