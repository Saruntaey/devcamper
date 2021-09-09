const mongoose = require("mongoose");

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true, // not an option in v.6.0.5
        useUnifiedTopology: true,
        useFindAndModify: false, // not an option in v.6.0.5
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
};

module.exports = connectDB;
