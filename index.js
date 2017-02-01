var algos = require('algos')
var _ = require('lodash')
var Joi = require('joi')

class DistanceConstraint {
    constructor(params) {

        let schema = Joi.object().keys({
            name1: Joi.string().required(),
            name2: Joi.string().required(),
            operator: Joi.string().valid('=', '>', '<', '>=', '<=').default('='),
            value: Joi.number().min(1).required()
        }).required()

        Joi.assert(params, schema)

        this.name1 = params.name1
        this.name2 = params.name2
        this.operator = params.operator
        this.value = params.value
    }
}

class PositionConstraint {
    constructor(params) {

        let schema = Joi.object().keys({
            name: Joi.string().required(),
            operator: Joi.string().valid('=', '>', '<', '>=', '<=').default('='),
            value: Joi.object().keys({
                line: Joi.number().required(),
                col: Joi.number().required()
            }).required()
        })

        Joi.assert(params, schema)

        this.name = params.name
        this.operator = params.operator
        this.value = params.value
    }
}

function BinPacking( numBins ) {

    this.employees = [
        'Robert', 'Scott', 'Guy', 'Bo', 'Idan', 'Chloe',
        'Cassy', 'Lois', 'Kaili', 'Alex', 'Randy'
    ]

    function table(rows, employee) {
        var table = null
        _.each(rows, function(row, rowIndex) {
            _.each(row, function(col, colIndex) {
                if (col == employee) {
                    table = [rowIndex, colIndex]
                }
            })
        })
        return table
    }

    function distance(rows, employee1, employee2) {
        let table1 = table(rows, employee1)
        let table2 = table(rows, employee2)
        return Math.abs(table2[0] - table1[0]) + Math.abs(table2[1] - table1[1])
    }

    var numRows = 2
    var numCols = 6

    var distanceConstraints = [
        new DistanceConstraint({
            name1: 'Kaili',
            name2: 'Lois',
            value: 1
        }),
        new DistanceConstraint({
            name1: 'Guy',
            name2: 'Lois',
            value: 1
        }),
        new DistanceConstraint({
            name1: 'Randy',
            name2: 'Chloe',
            value: 1
        }),
        new DistanceConstraint({
            name1: 'Alex',
            name2: 'Idan',
            operator: '>=',
            value: 2
        }),
    ]

    var positionConstraints = [
        new PositionConstraint({
            name: 'Scott',
            value: {line: 0, col: 1}
        }),
        new PositionConstraint({
            name: 'Robert',
            value: {line: 0, col: 0}
        }),
        new PositionConstraint({
            name: 'Cassy',
            value: {line: 1, col: 0}
        }),
        new PositionConstraint({
            name: 'Lois',
            value: {line: 1, col: 1}
        })
    ]

    /**
    Initial solution function defines the starting state. Each bin gets 6 items - each 
    costing the bin number: bin0 contains 0,0,0,0,0,0  ... bin1 contains 1,1,1,1,1,1  ... binN contains N,N,N,N,N,N
    */
    this.initial_solution = function() {
        return this.random_transition()
    }

    /**
        how much does a solution cost. Make sure you have a 
        metric that measures the effective energy of a solution
    */
    this.solution_cost = function( solution ) {
        var energy = 0

        _.each(distanceConstraints, function(constraint) {
            let d = distance(solution, constraint.name1, constraint.name2)
            if (d != constraint.value) {
                energy += 1
            }
        })

        _.each(positionConstraints, function(constant) {
            let t = table(solution, constant.name)
            if (t[0] != constant.value.line || t[1] != constant.value.col) {
                energy += 5
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
    this.random_transition = function( solution ) {
        let employees = _.shuffle(this.employees)
        let rows = []
        for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
            var cols = []
            for (let colIndex = 0; colIndex < numCols; colIndex++) {
                let employee = employees.pop() || null
                cols.push(employee)
            }
            rows.push(cols)
        }
        return rows
    }
    /**
        This is purely for niceness/debugging. It's not part of the
        actual annealing
    */
    this.printSolution = function( solution ) {
        console.log(solution)
    }
}

var algos = require( "algos" ) ;        // npm install algos 

BinPacking.prototype = new algos.SimulatedAnnealing();  // Here's where the "inheritance" occurs 
BinPacking.prototype.constructor=BinPacking;            

var testBinPacking = new BinPacking( 30 ) ;         // 30 bins of random test data
var result = testBinPacking.anneal()  ;             // sort the bins evenly
console.log( result ) ;                  // log the result

