const express = require('express');
const friendController = require("../controllers/friend.controller");
const appValidation = require("../validations/app.validation");
const {validateReq} = require("../middlewares/validate");
const {validateToken} = require("../middlewares/jwt.middleware");

const router = express.Router();

router.get('/recommendations', [validateToken, validateReq(appValidation.getBasic)], friendController.getRecommendations);
router.post('/request/send', [validateToken, validateReq(appValidation.request)], friendController.sendRequest);
router.post('/request/cancel', [validateToken, validateReq(appValidation.request)], friendController.cancelRequest);
router.post('/request/approve', [validateToken, validateReq(appValidation.request)], friendController.approveRequest);
router.get('/request/pending', [validateToken, validateReq(appValidation.getBasic)], friendController.getPendingRequest);
router.get('/request/approved', [validateToken, validateReq(appValidation.getBasic)], friendController.getApprovedRequest);

module.exports = router;