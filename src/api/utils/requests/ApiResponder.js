const httpStatus = require('http-status');
const ApiError = require('./ApiError');

const ApiResponder = (res, statusCode, message, payload, extra = {}) => {
  res.status(statusCode).send({
    status: statusCode,
    success: statusCode === httpStatus.HTTP_STATUS_OK || statusCode === httpStatus.HTTP_STATUS_CREATED,
    message,
    data: payload,
    ...extra,
  });
};

const successResponse = (res, payload = {}, message = 'Success') => {
  return ApiResponder(res, httpStatus.HTTP_STATUS_OK, message, payload);
};

const errorResponse = (res, message = null, statusCode = httpStatus.HTTP_STATUS_INTERNAL_SERVER_ERROR, extra = {}) => {
  const httpMessage = message || httpStatus[statusCode];
  return ApiResponder(res, statusCode, httpMessage, {}, extra);
};

const abort = (status, message) => {
  throw new ApiError(status, message);
};

const abortIf = (condition, status, message) => {
  if (condition) abort(status, message);
};

const abortUnless = (condition, status, message) => {
  if (!condition) abort(status, message);
};

module.exports = { ApiResponder, successResponse, errorResponse, abort, abortIf, abortUnless };
