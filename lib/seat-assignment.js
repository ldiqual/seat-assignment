const _ = require('lodash')
const Joi = require('joi')
const algos = require('algos')

const Schema = require('./schema')
const { DistanceConstraint, PositionConstraint } = require('./constraint')

class SeatAssignment extends algos.SimulatedAnnealing {

    constructor(params) {

        super()
        
        let schema = Joi.object().keys({
            numRows: Joi.number().min(0).required(),
            numCols: Joi.number().min(0).required(),
            employees: Joi.array().items(Joi.string()).required(),
            distanceConstraints: Joi.array().items(
                Joi.object().type(DistanceConstraint)
            ).required(),
            positionConstraints: Joi.array().items(
                Joi.object().type(PositionConstraint)
            ).required(),
        })

        Joi.assert(params, schema)

        this.employees = params.employees
        this.numRows = params.numRows
        this.numCols = params.numCols
        this.distanceConstraints = params.distanceConstraints
        this.positionConstraints = params.positionConstraints
    }

    getEmployeePosition(rows, employee) {
        var position = null
        _.each(rows, function(row, rowIndex) {
            _.each(row, function(col, colIndex) {
                if (col == employee) {
                    position = { row: rowIndex, col: colIndex }
                }
            })
        })
        return position
    }

    getDistance(rows, employee1, employee2) {

        Joi.assert(rows, Schema.rows)
        Joi.assert(employee1, Joi.string().min(1).required())
        Joi.assert(employee2, Joi.string().min(1).required())

        let position1 = this.getEmployeePosition(rows, employee1)
        let position2 = this.getEmployeePosition(rows, employee2)

        return Math.abs(position1.row - position2.row) + Math.abs(position1.col - position2.col)
    }

    randomRows() {

        let fixedEmployees = this.positionConstraints.map( (constraint) => constraint.name )
        let shuffledEmployees = _.shuffle(this.employees)
        let unplacedEmployees = _.difference(shuffledEmployees, fixedEmployees)

        let getFixedEmployeeForPosition = (position) => {
            Joi.assert(position, Schema.position)
            let constraint = _.find(this.positionConstraints, function(constraint) {
                return constraint.evaluate(position)
            })
            if (!constraint) {
                return null
            }
            return constraint.name
        }

        let rows = []
        for (let rowIndex = 0; rowIndex < this.numRows; rowIndex++) {
            let cols = []
            for (let colIndex = 0; colIndex < this.numCols; colIndex++) {
                let position = { row: rowIndex, col: colIndex }
                let employee = getFixedEmployeeForPosition(position) || unplacedEmployees.pop() || null
                cols.push(employee)
            }
            rows.push(cols)
        }

        return rows
    }

    initial_solution() {
        return this.randomRows()
    }

    solution_cost(solution) {

        Joi.assert(solution, Schema.rows)

        var energy = 0

        _.each(this.distanceConstraints, (constraint)  => {
            let distance = this.getDistance(solution, constraint.name1, constraint.name2)
            let evaluation = constraint.evaluate(distance)
            if (!evaluation) {
                energy += constraint.priority
            }
        })

        _.each(this.positionConstraints, (constraint) => {
            let position = this.getEmployeePosition(solution, constraint.name)
            let evaluation = constraint.evaluate(position)
            if (!evaluation) {
                energy += constraint.priority
            }
        })

        return energy
    }

    random_transition(solution) {

        Joi.assert(solution, Schema.rows)

        return this.randomRows()

        let position1 = { 
            row: _.random(0, this.numRows - 1),
            col: _.random(0, this.numCols - 1)
        }
        let position2 = { 
            row: _.random(0, this.numRows - 1),
            col: _.random(0, this.numCols - 1)
        }

        let employee1 = solution[position1.row][position1.col]
        let employee2 = solution[position2.row][position2.col]
        solution[position1.row][position1.col] = employee2
        solution[position2.row][position2.col] = employee1

        return solution
    }
}

module.exports = SeatAssignment
