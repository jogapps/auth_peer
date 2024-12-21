const express = require('express');
const moment = require('moment');


const router = express.Router();

// routes
const authRoute = require('./auth.route');

const apiVersion = '1.0.0';

// console log every visited route
router.use((req, res, next) => {
    console.log(`${moment()}: ${req.originalUrl}`);
    next();
});

router.use('/auth', authRoute);

router.get("/", (req, res) => {
    res.status(200).json({
        status: true,
        message: `Welcome to the API - v${apiVersion}`
    });
});


module.exports = router;