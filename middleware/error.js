const errorHandeler = (err, req, res, next) => {
    // log err for dev
    console.log(err)

    const e = {
        msg: err.message,
        status: err.status,
    };

    // Custom err msg and status
    //
    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        e.msg = `Resource not found with id of ${err.value}`;
        e.status = 404;
    }
    // Mongoose duplicate key
    else if (err.code === 11000) {
        e.msg = "Duplicate field value enter";
        e.status = 400;
    }
    // Mongoose validation error
    else if (err.name === "ValidationError") {
        e.msg = Object.values(err.errors).map(val => val.message).join(",");
        e.status = 400;
    }
    
    // JSON response
    res
        .status(e.status || 500)
        .json({ success: false, 
                error: e.msg || "Server error", 
                data: null });
};

module.exports = errorHandeler;