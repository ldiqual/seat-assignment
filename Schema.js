const Joi = require('joi')

const Schema = {
    rows: Joi.array().items(
        Joi.array().items(Joi.string().allow(null))
    ).required(),

    position: Joi.object().keys({
        row: Joi.number().required(),
        col: Joi.number().required()
    }).required()
}

module.exports = Schema
