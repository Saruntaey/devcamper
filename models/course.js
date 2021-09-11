const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Please add a course title"],
    },
    description: {
        type: String,
        required: [true, "Please add a description"],
    },
    weeks: {
        type: String,
        required: [true, "Please add number of weeks"],
    },
    tuition: {
        type: Number,
        required: [true, "Please add a tuition cost"],
    },
    minimumSkill: {
        type: String,
        required: [true, "Please add a minimum skill"],
        enum: ["beginner", "intermediate", "advanced"],
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: Schema.ObjectId,
        ref: "Bootcamp",
        required: true,
    },
    user: {
        type: Schema.ObjectId,
        ref: "User",
        required: true,
    }
});

// static method to get avg of course tuitions
courseSchema.statics.getAverageCost = async function (bootcampId) {    
    const obj = await this.aggregate([
        {
            $match: {bootcamp: bootcampId}
        },
        {
            $group: {
                _id: "$bootcamp",
                averageCost: {$avg: "$tuition"}
            }
        }
    ]);
    
    try {
        await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10
        })
    } catch (err) {
        console.error(err);
    }
};

// call getAverageCost after save
courseSchema.post("save", async function() {
    await this.constructor.getAverageCost(this.bootcamp);
});

// call getAverageCost after remove
courseSchema.post("remove", async function() {
    await this.constructor.getAverageCost(this.bootcamp);
})

module.exports = mongoose.model("Course", courseSchema);