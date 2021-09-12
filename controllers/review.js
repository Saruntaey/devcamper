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

// @desc    Add review
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  Private
exports.addReview = asyncHandeler(async (req, res, next) => {

    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`, 400));
    }

    const review = await Review.create(req.body);
    res.status(201).json({ success: true, data: review });
});

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandeler(async (req, res, next) => {

    let review = await Review.findById(req.params.id);

    if (!review) {
        return next(new ErrorResponse(`No reviw with the id of ${req.params.id}`, 400));
    }

    // make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new ErrorResponse(`User with id of ${req.user.id} can not update this review`, 403));
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: review });
});

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandeler(async (req, res, next) => {

    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(new ErrorResponse(`No reviw with the id of ${req.params.id}`, 400));
    }

    // make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new ErrorResponse(`User with id of ${req.user.id} can not delete this review`, 403));
    }

    await review.remove();

    res.status(200).json({ success: true, data: review });
});