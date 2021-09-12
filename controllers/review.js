const Review = require("../models/review");
const Bootcamp = require("../models/bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandeler = require("../middleware/async");

// @desc    Get reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  Public
exports.getReviews = asyncHandeler(async (req, res, next) => {

    if (req.params.bootcampId) {
        const reviews = await Review.find({ bootcamp: req.params.bootcampId });
        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews,
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});