const Joi = require('joi');
const moment = require('moment');
const {VALID_FIAT_SYMBOLS, AVAILABILITY_STATUS} = require("../utils/texts");

const tomorrow = moment().add(1, 'day').toISOString();

const upload_image = {
    params: Joi.object().keys({
        filename: Joi.string().required(),
    }),
};

const addFaq = {
    body: Joi.object().keys({
        answer: Joi.string().required(),
        question: Joi.string().required()
    })
};

const updateFaq = {
    body: Joi.object().keys({
        id: Joi.string().uuid().required(),
        answer: Joi.string().required(),
        question: Joi.string().required()
    })
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
        email: Joi.string().email().optional(),
    }),
};

const addSavingsPackage = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        amount: Joi.number().optional(),
        roi: Joi.number().optional(),
        duration: Joi.number().optional(),
        currency: Joi.string().valid(...VALID_FIAT_SYMBOLS).messages({
            'any.only': '{{#label}} Enter valid fiat symbol!'
        }).required(),
    })
}

const updateSavingsPackage = {
    body: Joi.object().keys({
        id: Joi.string().uuid().required(),
        name: Joi.string().optional(),
        description: Joi.string().optional(),
        amount: Joi.number().optional(),
        roi: Joi.number().optional(),
        duration: Joi.number().optional(),
        currency: Joi.string().valid(...VALID_FIAT_SYMBOLS).messages({
            'any.only': '{{#label}} Enter valid fiat symbol!'
        }).optional(),
    }).custom((value, helpers) => {
        const numKeys = Object.keys(value).filter((key) => value[key] !== undefined).length;
        if (numKeys < 2) {
            return helpers.message('At least two field is required');
        }
        return value;
    }),
}

const currencyWallet = {
    params: Joi.object().keys({
        currency: Joi.string().required(),
    }),
};

const currencyConverter = {
    query: Joi.object().keys({
        from_currency: Joi.string().required(),
        to_currency: Joi.string().required(),
        from_amount: Joi.number().required()
    }),
};

const createSavings = {
    body: Joi.object().keys({
        package_id: Joi.string().uuid().required(),
        wallet_id: Joi.string().uuid().required(),
        name: Joi.string().required(),
        // currency: Joi.string().valid(...VALID_FIAT_SYMBOLS).messages({
        //     'any.only': '{{#label}} Enter valid fiat symbol!'
        // }).required(),
        amount: Joi.number().required(),
        end_date: Joi.date().greater('now').required(),
    })
}

const addInvestmentCategory = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        photo_url: Joi.string().required(),
    })
}

const updateInvestmentCategory = {
    body: Joi.object().keys({
        id: Joi.string().uuid().required(),
        name: Joi.string().optional(),
        description: Joi.string().optional(),
        photo_url: Joi.string().optional(),
    }).custom((value, helpers) => {
        const numKeys = Object.keys(value).filter((key) => value[key] !== undefined).length;
        if (numKeys < 2) {
            return helpers.message('At least two field is required');
        }
        return value;
    }),
}

const addInvestmentPackage = {
    body: Joi.object().keys({
        investment_category_id: Joi.string().uuid().required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        photo_url: Joi.string().required(),
        currency: Joi.string().valid(...VALID_FIAT_SYMBOLS).messages({
            'any.only': '{{#label}} Enter valid fiat symbol!'
        }).required(),
        roi: Joi.number().required(),
        duration: Joi.number().required(),
        unit_price: Joi.number().optional(),
        min_price: Joi.number().optional(),
        max_price: Joi.number().optional(),
        availability_status: Joi.string().valid(...AVAILABILITY_STATUS).messages({
            'any.only': '{{#label}} Enter valid Availability Status!'
        }).optional(),
        payout_type: Joi.string().optional(),
        investment_type: Joi.string().optional(),
    })
}

const updateInvestmentPackage = {
    body: Joi.object().keys({
        id: Joi.string().uuid().required(),
        investment_category_id: Joi.string().uuid().optional(),
        name: Joi.string().optional(),
        description: Joi.string().optional(),
        photo_url: Joi.string().optional(),
        currency: Joi.string().valid(...VALID_FIAT_SYMBOLS).messages({
            'any.only': '{{#label}} Enter valid fiat symbol!'
        }).optional(),
        roi: Joi.number().optional(),
        duration: Joi.number().optional(),
        unit_price: Joi.number().optional(),
        min_price: Joi.number().optional(),
        max_price: Joi.number().optional(),
        availability_status: Joi.string().valid(...AVAILABILITY_STATUS).messages({
            'any.only': '{{#label}} Enter valid Availability Status!'
        }).optional(),
        payout_type: Joi.string().optional(),
        investment_type: Joi.string().optional()
    }).custom((value, helpers) => {
        const numKeys = Object.keys(value).filter((key) => value[key] !== undefined).length;
        if (numKeys < 2) {
            return helpers.message('At least two field is required');
        }
        return value;
    })
}

const createInvestment = {
    body: Joi.object().keys({
        investment_package_id: Joi.string().uuid().required(),
        wallet_id: Joi.string().uuid().required(),
        unit: Joi.number().required(),
        amount: Joi.number().required(),
    })
}

const swapCurrency = {
    body: Joi.object().keys({
        from_wallet: Joi.string().uuid().required(),
        to_wallet: Joi.string().uuid().required(),
        from_amount: Joi.number().required()
    }).custom((value, helpers) => {
        if (value.from_wallet === value.to_wallet) {
            return helpers.message('from_wallet and to_wallet cannot be the same');
        }
        return value;
    })
}

const withdrawWallet = {
    body: Joi.object().keys({
        wallet_id: Joi.string().uuid().required(),
        receiver_address: Joi.string().required(),
        amount: Joi.number().required(),
        narration: Joi.string().optional()
    })
}

module.exports = {
    addFaq,
    getBasic,
    updateFaq,
    deleteItem,
    swapCurrency,
    upload_image,
    createSavings,
    withdrawWallet,
    currencyWallet,
    createInvestment,
    currencyConverter,
    addSavingsPackage,
    addInvestmentPackage,
    updateSavingsPackage,
    addInvestmentCategory,
    updateInvestmentPackage,
    updateInvestmentCategory,
};