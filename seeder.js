const mongoose = require("mongoose");
const fs = require("fs");

const usage = "USAGE: node seeder <-i/-d>";
if (process.argv.length != 3) {
    console.log(usage);
    process.exit();
}

const option = process.argv[2];
if (option === "-i") {
    connectDB();
    importData();
} else if (option === "-d") {
    connectDB();
    deleteData();
} else {
    console.log(usage);
}


async function connectDB() {
    const dotenv = require("dotenv");

    // load env var
    dotenv.config({ path: "./config/config.env" });

    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true, // not an option in v.6.0.5
        useUnifiedTopology: true,
        useFindAndModify: false, // not an option in v.6.0.5
    });
}

async function importData() {
    try {
        // load model
        const Bootcamp = require("./models/bootcamp");
        const Course = require("./models/course");
        const User = require("./models/user");

        // read JSON file
        const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8"));
        const course = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8"));
        const user = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8"));

        // save data to DB
        await Bootcamp.create(bootcamps);
        await Course.create(course);
        await User.create(user);

        console.log("Data imported...");
        // process.exit();
        await mongoose.connection.close();
    } catch (err) {
        console.log(err);
    }
};

async function deleteData() {
    try {
        // load model
        const Bootcamp = require("./models/bootcamp");
        const Course = require("./models/course");
        const User = require("./models/user");

        // remove data from DB
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        
        console.log("Data destroyed...");
        // process.exit();
        await mongoose.connection.close();
    } catch (err) {
        console.log(err);
    }
};

