const sequelize = require('sequelize');
const httpStatus = require('http-status');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/requests/ApiError');
const { errorResponse } = require('../utils/requests/ApiResponder');

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError || error instanceof sequelize.Error)) {
    const statusCode = error.statusCode || httpStatus.HTTP_STATUS_INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
    console.log({statusCode, message, stack: err});
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.log('error', err);
  let { statusCode, message } = err;
  statusCode = statusCode || httpStatus.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  if (statusCode === httpStatus.HTTP_STATUS_INTERNAL_SERVER_ERROR) {
    // message = message || httpStatus[httpStatus.HTTP_STATUS_INTERNAL_SERVER_ERROR];
    message = 'Oh sugar! we have a problem, please check back later';
  }

  res.locals.errorMessage = err.message;
  if (statusCode === httpStatus.HTTP_STATUS_INTERNAL_SERVER_ERROR || config.env === 'test') {
    logger.error(err);
    if (err instanceof sequelize.Error) {
      logger.error(err.parent);
    }
  }

  return errorResponse(res, message, statusCode, config.env === 'development' && { stack: err.stack });
};

module.exports = {
  errorConverter,
  errorHandler,
};
