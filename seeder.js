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

        // read JSON file
        const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8"));

        // save data to DB
        await Bootcamp.create(bootcamps);

        console.log("Data imported...");
        process.exit();
    } catch (err) {
        console.log(err);
    }
};

async function deleteData() {
    try {
        // load model
        const Bootcamp = require("./models/bootcamp");

        // remove data from DB
        await Bootcamp.deleteMany();
        
        console.log("Data destroyed...");
        process.exit();
    } catch (err) {
        console.log(err);
    }
};

