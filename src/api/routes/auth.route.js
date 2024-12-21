const express = require('express');
const authController = require("../controllers/auth.controller");
const authValidation = require("../validations/auth.validation");
const {validateReq} = require("../middlewares/validate");

const router = express.Router();

router.post('/login', validateReq(authValidation.login), authController.login);
router.post('/register', validateReq(authValidation.register_user), authController.registerUsers);

module.exports = router;