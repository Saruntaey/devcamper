const errorHandeler = (err, req, res, next) => {
    // log err for dev
    console.log(err.stack)

    // JSON response
    res.status(500).json({ success: false, error: err.message, data: null });
};

module.exports = errorHandeler;