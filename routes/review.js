const express = require("express");
const {
    getReviews,
    getReview
} = require("../controllers/review");

const advancedResults = require("../middleware/advancedResults");
const Review = require("../models/review");

const router = express.Router({ mergeParams: true });

router
    .route("/")
    .get(advancedResults(Review, {
        path: "bootcamp",
        select: "name description"
    }), getReviews);

router
    .route("/:id")
    .get(getReview);

module.exports = router;