const SeatAssignment = require('./lib/seat-assignment')
const { DistanceConstraint, PositionConstraint, ConstraintPriority } = require('./lib/constraint')

const employees = [
    'Robert', 'Scott', 'Guy', 'Bo', 'Idan', 'Chloe',
    'Cassy', 'Lois', 'Kaili', 'Alex', 'Randy'
]

const distanceConstraints = [
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
    })
]

const positionConstraints = [
    new PositionConstraint({
        name: 'Scott',
        value: {row: 0, col: 1}
    }),
    new PositionConstraint({
        name: 'Robert',
        value: {row: 0, col: 0}
    }),
    new PositionConstraint({
        name: 'Cassy',
        value: {row: 1, col: 0}
    }),
    new PositionConstraint({
        name: 'Lois',
        value: {row: 1, col: 1}
    })
]

let assignment = new SeatAssignment({
    numRows: 2,
    numCols: 6,
    employees: employees,
    distanceConstraints: distanceConstraints,
    positionConstraints: positionConstraints
})

let result = assignment.anneal()
console.log('Result:')
console.log(result)
console.log('Cost: ' + assignment.solution_cost(result))

