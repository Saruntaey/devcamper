const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Please add a title for a review"],
        maxlength: 100,
    },
    text: {
        type: String,
        required: [true, "Please add some text"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, "Please add a rating between 1 and 10"]
    },
    bootcamp: {
        type: Schema.ObjectId,
        ref: "Bootcamp",
        required: true
    },
    user: {
        type: Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Review", reviewSchema);