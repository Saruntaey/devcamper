const errorHandeler = (err, req, res, next) => {
    // log err for dev
    console.log(err.stack)

    // JSON response
    res
        .status(err.status || 500)
        .json({ success: false, 
                error: err.message || "Server error", 
                data: null });
};

module.exports = errorHandeler;