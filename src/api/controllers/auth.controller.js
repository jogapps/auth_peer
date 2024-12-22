const authService = require("../services/auth.service");
const catchAsync = require("../utils/requests/catchAsync");
const {successResponse} = require("../utils/requests/ApiResponder");
const {updatedSuccess} = require("../utils/texts");


const login = catchAsync(async (req, res) => {
    return successResponse(res, await authService.loginUser(req), `User logged in successfully!`);
});

const registerUsers = catchAsync(async (req, res) => {
    return successResponse(res, await authService.register(req), `User registered successfully`);
});

const updatePassword = catchAsync(async (req, res) => {
    return successResponse(res, await authService.updatePassword(req), `Password ${updatedSuccess}`);
});



module.exports = {
    login,
    registerUsers,
    updatePassword,
}