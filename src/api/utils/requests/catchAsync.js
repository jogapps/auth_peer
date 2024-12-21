const { errorResponse } = require('./ApiResponder');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => errorResponse(res, err.message, err.statusCode));
};

module.exports = catchAsync;
