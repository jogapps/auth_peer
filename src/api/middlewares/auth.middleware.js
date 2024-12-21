const httpStatus = require("http-status");
const ApiError = require("../utils/requests/ApiError");
const { ROLES } = require("../utils/texts");
const cacheService = require("../utils/redis");

let adminAuth = (req, res, next) => {
    const { role } = req.data;
    if(role === ROLES[0]) next();
    else throw new ApiError(httpStatus.HTTP_STATUS_UNAUTHORIZED, "Unauthorized Admin");
}

let userAuth = (req, res, next) => {
    const { role } = req.data;
    if(role === ROLES[2]) next();
    else throw new ApiError(httpStatus.HTTP_STATUS_UNAUTHORIZED, "Unauthorized User");
}




module.exports = {
    userAuth,
    adminAuth,
}