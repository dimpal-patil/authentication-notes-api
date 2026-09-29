const express = require('express');
const router = express.Router();
const authController = require("../controllers/user-controller");
const verifyAuthentication = require("../middleware/verifyAuthentication");
const adminOnly= require("../middleware/adminOnly");


router.get("/", verifyAuthentication, authController.getUser);
router.get("/admin", verifyAuthentication, adminOnly, authController.getUser);
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser)


module.exports = router