const _ = require('lodash')
const Joi = require('joi')

const Schema = require('./schema')

class DistanceConstraint {
    constructor(params) {

        let schema = Joi.object().keys({
            name1: Joi.string().required(),
            name2: Joi.string().required(),
            operator: Joi.string().valid('=', '>', '<', '>=', '<='),
            value: Joi.number().min(1).required()
        }).required()

        Joi.assert(params, schema)

        this.name1 = params.name1
        this.name2 = params.name2
        this.operator = params.operator || '='
        this.value = params.value
    }

    evaluate(distance) {
        let schema = Joi.number().required()
        Joi.assert(distance, schema)

        switch (this.operator) {
        case '=':
            return distance == this.value
        case '>':
            return distance > this.value
        case '<':
            return distance < this.value
        case '>=':
            return distance >= this.value
        case '<=':
            return distance <= this.value
        }

        return false
    }
}

class PositionConstraint {
    constructor(params) {

        let schema = Joi.object().keys({
            name: Joi.string().required(),
            value: Schema.position
        })

        Joi.assert(params, schema)

        this.name = params.name
        this.value = params.value
    }

    evaluate(position) {
        Joi.assert(position, Schema.position)
        return position.row == this.value.row && position.col == this.value.col
    }
}

module.exports = {DistanceConstraint, PositionConstraint}
