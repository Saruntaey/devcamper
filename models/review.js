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

// prevent user from submittin more than one review per bootcamp
reviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// static method to get avg of rating and save
reviewSchema.statics.getAverageRating = async function (bootcampId) {    
    const obj = await this.aggregate([
        {
            $match: {bootcamp: bootcampId}
        },
        {
            $group: {
                _id: "$bootcamp",
                averageCost: {$avg: "$rating"}
            }
        }
    ]);
    
    try {
        await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
            averageRating: obj[0].averageCost
        })
    } catch (err) {
        console.error(err);
    }
};

// call getAverageRating after save
reviewSchema.post("save", async function() {
    await this.constructor.getAverageRating(this.bootcamp);
});

// call getAverageRating after remove
reviewSchema.post("remove", async function() {
    await this.constructor.getAverageRating(this.bootcamp);
})

module.exports = mongoose.model("Review", reviewSchema);