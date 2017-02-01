var algos = require('algos')
var _ = require('lodash')

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

    var constraints = [
        ['Kaili', 'Lois', 1],
        ['Guy', 'Lois', 1],
        ['Randy', 'Chloe', 1],
        ['Alex', 'Idan', 3]
    ]

    var constants = [
        ['Scott', 0, 1],
        ['Robert', 0, 0],
        ['Cassy', 1, 0],
        ['Lois', 1, 1]
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

        _.each(constraints, function(constraint) {
            let d = distance(solution, constraint[0], constraint[1])
            if (d != constraint[2]) {
                energy += 1
            }
        })

        _.each(constants, function(constant) {
            let t = table(solution, constant[0])
            if (t[0] != constant[1] || t[1] != constant[2]) {
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

