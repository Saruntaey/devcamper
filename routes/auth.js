const express = require("express");
const {
    register,
    login,
    logout,
    getMe,
    forgotPassword,
    resetPassword,
    updateDeatils,
    updatePassword,
} = require("../controllers/auth");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getMe);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.put("/updatedetails", protect, updateDeatils);
router.put("/updatepassword", protect, updatePassword);

module.exports = router;