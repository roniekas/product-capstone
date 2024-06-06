const Joi = require('joi');
const httpStatus = require('http-status');
const ApiError = require('../helper/ApiError');

class DetailValidator {
    async detailTrxValidator(req, res, next) {
        // create schema object
        const schema = Joi.object({
            type: Joi.string().valid('all', 'income', 'outcome').required(),
            startDate: Joi.string().required(),
            endDate: Joi.string().required(),
            byCategory: Joi.bool().required(),
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

module.exports = DetailValidator;
