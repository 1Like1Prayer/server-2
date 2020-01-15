const Joi = require('@hapi/joi');
exports.joiProductSchema = Joi.object({
        name: Joi.string()
            .alphanum()
            .min(1)
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .required(),
        description: Joi.string()
            .min(1)
            .required(),
        price: Joi.number()
            .min(1)
            .required(),
        amount: Joi.number()
            .min(1)
            .required()
    }
);
exports.joiCheckOutSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
    amount: Joi.number()
        .min(1)
        .required()
});
