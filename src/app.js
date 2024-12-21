require("dotenv").config();
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const moment = require('moment');
const express = require('express');
const httpStatus = require('http-status');

// import initialization
const app = express();

// local imports
const routes = require('./api/routes/index');
const ApiError = require('./api/utils/requests/ApiError');
const { errorConverter, errorHandler } = require('./api/middlewares/error');


// middlewares

// set security HTTP headers
app.use(helmet());
// parse json request body
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
// sanitize request data
app.use(xss());
// enable cors
app.use(cors());


app.use("/api/v1", routes);


// catch 404 errors and print requested route
app.use((req, res, next) => {
  console.log(`${moment()}: ${req.originalUrl}`);
  throw new ApiError(httpStatus.HTTP_STATUS_NOT_FOUND, 'Not found');
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`server started on port ${PORT}`);
// });

module.exports = app;
