const Joi = require('joi');
const httpStatus = require('http-status');
const ApiError = require('../helper/ApiError');

class ActivityValidator {
    async createActivityValidator(req, res, next) {
        // create schema object
        const schema = Joi.object({
            amount: Joi.number().default(0),
            activityType: Joi.string().valid('income', 'outcome').required(),
            category: Joi.string().required(),
            notes: Joi.string().allow(""),
            date: Joi.string().required(),
            walletId: Joi.string().required(),
            iconId: Joi.string().allow(""),
            billId: Joi.string().allow("")
        });

        // schema options
        const options = {
            abortEarly: false, // include all errors
            allowUnknown: true, // ignore unknown props
            stripUnknown: true, // remove unknown props
        };

        // validate request body against schema
        const { error, value } = schema.validate(req.body, options);

        if (error) {
            // on fail return comma separated errors
            const errorMessage = error.details
                .map((details) => {
                    return details.message;
                })
                .join(', ');
            next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        } else {
            // on success replace req.body with validated value and trigger next middleware function
            req.body = value;
            return next();
        }
    }
}

module.exports = ActivityValidator;
