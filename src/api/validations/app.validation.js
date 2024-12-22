const Joi = require('joi');
const moment = require('moment');

const tomorrow = moment().add(1, 'day').toISOString();

const upload_image = {
    params: Joi.object().keys({
        filename: Joi.string().required(),
    }),
};

const deleteItem = {
    body: Joi.object().keys({
        id: Joi.string().uuid().required(),
    })
};

const getBasic = {
    query: Joi.object().keys({
        page: Joi.string().optional(),
        perPage: Joi.string().optional(),
        startDate: Joi.date().iso().max('now').optional(),
        endDate: Joi.date().iso().max(tomorrow).optional(),
        dir: Joi.string().valid(...['ASC', 'asc', 'DESC', 'desc']).messages({
            'any.only': '{{#label}} Enter valid dir [ASC, DESC] !'
        }).optional(),
        sortBy: Joi.string().valid(...['createdAt', 'updatedAt']).messages({
            'any.only': '{{#label}} Enter valid sortBy [createdAt, updatedAt] !'
        }).optional(),
    }),
};

const request = {
    body: Joi.object().keys({
        friend_id: Joi.string().uuid().required(),
    })
};

module.exports = {
    request,
    getBasic,
    deleteItem,
    upload_image,
};