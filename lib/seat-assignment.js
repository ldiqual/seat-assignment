const _ = require('lodash')
const Joi = require('joi')
const algos = require('algos')

const Schema = require('./schema')
const { DistanceConstraint, PositionConstraint } = require('./constraint')

function SeatAssignment(params) {

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

    this.getEmployeePosition = function(rows, employee) {
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

    this.getDistance = function(rows, employee1, employee2) {

        Joi.assert(rows, Schema.rows)
        Joi.assert(employee1, Joi.string().min(1).required())
        Joi.assert(employee2, Joi.string().min(1).required())

        let position1 = this.getEmployeePosition(rows, employee1)
        let position2 = this.getEmployeePosition(rows, employee2)

        return Math.abs(position1.row - position2.row) + Math.abs(position1.col - position2.col)
    }

    this.randomRows = function() {

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

    /**
    Initial solution function defines the starting state. Each bin gets 6 items - each 
    costing the bin number: bin0 contains 0,0,0,0,0,0  ... bin1 contains 1,1,1,1,1,1  ... binN contains N,N,N,N,N,N
    */
    this.initial_solution = function() {
        return this.randomRows()
    }

    /**
        how much does a solution cost. Make sure you have a 
        metric that measures the effective energy of a solution
    */
    this.solution_cost = function(solution) {

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

    /**
        Make a random transition - in our case swap an item
        between one bin and another. For large scale solution states
        a better random number generator is recommended (It really is 
        important).

        Return the new solution
    */
    this.random_transition = function(solution) {

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

SeatAssignment.prototype = new algos.SimulatedAnnealing()
SeatAssignment.prototype.constructor = SeatAssignment

module.exports = SeatAssignment
