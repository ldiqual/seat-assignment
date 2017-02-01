const _ = require('lodash')
const Joi = require('joi')

const Schema = require('./schema')

const ConstraintPriority = {
    low: 250,
    medium: 500,
    high: 1000
}

class DistanceConstraint {
    constructor(params) {

        let schema = Joi.object().keys({
            name1: Joi.string().required(),
            name2: Joi.string().required(),
            operator: Joi.string().valid('=', '>', '<', '>=', '<='),
            value: Joi.number().min(1).required(),
            priority: Joi.number().valid(ConstraintPriority.low, ConstraintPriority.medium, ConstraintPriority.high)
        }).required()

        Joi.assert(params, schema)

        this.name1 = params.name1
        this.name2 = params.name2
        this.operator = params.operator || '='
        this.value = params.value
        this.priority = params.priority || ConstraintPriority.medium
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
            value: Schema.position,
            priority: Joi.number().valid(ConstraintPriority.low, ConstraintPriority.medium, ConstraintPriority.high)
        })

        Joi.assert(params, schema)

        this.name = params.name
        this.value = params.value
        this.priority = params.priority || ConstraintPriority.high
    }

    evaluate(position) {
        Joi.assert(position, Schema.position)
        return position.row == this.value.row && position.col == this.value.col
    }
}

module.exports = {DistanceConstraint, PositionConstraint, ConstraintPriority}
