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

// @desc    Get single review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandeler(async (req, res, next) => {

    const review = await Review.findById(req.params.id).populate({
        path: "bootcamp",
        select: "name description"
    });

    if (!review) {
        return next(new ErrorResponse(`No review found with the id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({ success: true, data: review });
});