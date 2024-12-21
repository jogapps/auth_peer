const JWT = require("jsonwebtoken");
const jwtUtils = require("../utils/security/jwt.utils");
const ApiError = require("../utils/requests/ApiError");
const httpStatus = require("http-status");

let validateToken = (req, res, next) => {
    let token = req.headers["authorization"];

    if (!token || !token.startsWith('Bearer ')) {
        throw new ApiError(httpStatus.HTTP_STATUS_UNAUTHORIZED, "Token is required");
    }

    // Extract the actual token without "Bearer "
    const tokenWithoutBearer = token.slice(7);

    if (token) {
        JWT.verify(tokenWithoutBearer, jwtUtils.secret, (error, data) => {
            if (error) throw new ApiError(httpStatus.HTTP_STATUS_UNAUTHORIZED, "Invalid token found");
            else {
                req.data = data;
                next();
            }
        });
    } else throw new ApiError(httpStatus.HTTP_STATUS_UNAUTHORIZED, "Token is required");
}

module.exports = {
    validateToken
}