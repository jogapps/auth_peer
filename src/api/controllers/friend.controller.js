const catchAsync = require("../utils/requests/catchAsync");
const {successResponse} = require("../utils/requests/ApiResponder");
const friendService = require("../services/friend.service");
const {fetchedSuccess, createdSuccess, deletedSuccess, updatedSuccess} = require("../utils/texts");

const getRecommendations = catchAsync(async (req, res) => {
    return successResponse(res, await friendService.getRecommendations(req), `Recommendations ${fetchedSuccess}`);
});

const sendRequest = catchAsync(async (req, res) => {
    return successResponse(res, await friendService.sendRequest(req), `Recommendations ${createdSuccess}`);
});

const cancelRequest = catchAsync(async (req, res) => {
    return successResponse(res, await friendService.cancelRequest(req), `Request ${deletedSuccess}`);
});

const getPendingRequest = catchAsync(async (req, res) => {
    return successResponse(res, await friendService.getPendingRequest(req), `Request ${fetchedSuccess}`);
});

const getApprovedRequest = catchAsync(async (req, res) => {
    return successResponse(res, await friendService.getApprovedRequest(req), `Request ${fetchedSuccess}`);
});

const approveRequest = catchAsync(async (req, res) => {
    return successResponse(res, await friendService.approveRequest(req), `Request ${updatedSuccess}`);
});

module.exports = {
    sendRequest,
    cancelRequest,
    approveRequest,
    getPendingRequest,
    getApprovedRequest,
    getRecommendations,
}