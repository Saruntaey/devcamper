const express = require("express");
const router = express.Router();
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload,
} = require("../controllers/bootcamps");
const bootcamp = require("../models/bootcamp");

// include other resource routers
const courseRouter = require("./course");

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router
    .route("/")
    .get(getBootcamps)
    .post(createBootcamp);
    
router
    .route("/:id")
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

router
    .route("/radius/:zipcode/:distance")
    .get(getBootcampsInRadius);

router.route("/:id/photo").put(bootcampPhotoUpload);

module.exports = router;
