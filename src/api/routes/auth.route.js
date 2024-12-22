const express = require('express');
const authController = require("../controllers/auth.controller");
const authValidation = require("../validations/auth.validation");
const {validateReq} = require("../middlewares/validate");
const {validateToken} = require("../middlewares/jwt.middleware");

const router = express.Router();

router.post('/login', validateReq(authValidation.login), authController.login);
router.post('/register', validateReq(authValidation.register_user), authController.registerUsers);
router.post('/update/password', [validateToken, validateReq(authValidation.password_update)], authController.updatePassword);

module.exports = router;