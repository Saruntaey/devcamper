const Course = require("../models/course");
const Bootcamp = require("../models/bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandeler = require("../middleware/async");
const { findByIdAndUpdate } = require("../models/bootcamp");

// @desc    Get courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandeler(async (req, res, next) => {
    let query;

    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId });
    } else {
        query = Course.find().populate({
            path: "bootcamp",
            select: "name description",
        });
    }

    const courses = await query;
    res.status(200).json({ 
        success: true,
        count: courses.length,
        data: courses,
     });
});

// @desc    Get course
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = asyncHandeler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: "bootcamp",
        select: "name description"
    });
    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`, 404));
    }

    res.status(200).json({ 
        success: true,
        data: course,
     });
});

// @desc    Add course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.addCourse = asyncHandeler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`, 400));
    }

    const course = await Course.create(req.body);
  
    res.status(200).json({ 
        success: true,
        data: course,
     });
});

// @desc    Update course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandeler(async (req, res, next) => {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`, 400));
    }
  
    res.status(200).json({ 
        success: true,
        data: course,
     });
});

// @desc    Delete course
// @route   DELETE /api/v1/courses/:id
// @access  Private
exports.deleteCourse = asyncHandeler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`, 400));
    }

    await course.remove();
  
    res.status(200).json({ 
        success: true,
        data: course,
     });
});