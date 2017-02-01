const expect = require('chai').expect

const SeatAssignment = require('../lib/seat-assignment')
const { DistanceConstraint, PositionConstraint } = require('../lib/constraint')

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
    }),
    new DistanceConstraint({
        name1: 'Alex',
        name2: 'Idan',
        operator: '>=',
        value: 2
    }),
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


describe('SeatAssignment', function() {

    describe('#getEmployeePosition', function() {
        it('works', function() {

            let seatAssignment = new SeatAssignment({
                numRows: 2,
                numCols: 6,
                employees: employees,
                distanceConstraints: distanceConstraints,
                positionConstraints: positionConstraints
            })

            let rows = [
                [ 'Robert', 'Scott' ],
                [ 'Cassy', 'Lois' ]
            ]

            expect(seatAssignment.getEmployeePosition(rows, 'Robert')).to.deep.equal({ row: 0, col: 0 })
            expect(seatAssignment.getEmployeePosition(rows, 'Scott')).to.deep.equal({ row: 0, col: 1 })
            expect(seatAssignment.getEmployeePosition(rows, 'Cassy')).to.deep.equal({ row: 1, col: 0 })
            expect(seatAssignment.getEmployeePosition(rows, 'Lois')).to.deep.equal({ row: 1, col: 1 })
            expect(seatAssignment.getEmployeePosition(rows, 'Greg')).to.be.null
        })
    })

    describe('#getDistance', function() {
        it('works', function() {

            let seatAssignment = new SeatAssignment({
                numRows: 2,
                numCols: 6,
                employees: employees,
                distanceConstraints: distanceConstraints,
                positionConstraints: positionConstraints
            })

            let rows = [
                [ 'Robert', 'Scott', 'Guy' ],
                [ 'Cassy', 'Lois', 'Kaili' ]
            ]

            expect(seatAssignment.getDistance(rows, 'Robert', 'Scott')).to.equal(1)
            expect(seatAssignment.getDistance(rows, 'Scott', 'Guy')).to.equal(1)
            expect(seatAssignment.getDistance(rows, 'Robert', 'Guy')).to.equal(2)
            expect(seatAssignment.getDistance(rows, 'Cassy', 'Lois')).to.equal(1)
            expect(seatAssignment.getDistance(rows, 'Lois', 'Kaili')).to.equal(1)
            expect(seatAssignment.getDistance(rows, 'Cassy', 'Kaili')).to.equal(2)
            expect(seatAssignment.getDistance(rows, 'Cassy', 'Robert')).to.equal(1)
            expect(seatAssignment.getDistance(rows, 'Cassy', 'Scott')).to.equal(2)
            expect(seatAssignment.getDistance(rows, 'Cassy', 'Guy')).to.equal(3)
            expect(seatAssignment.getDistance(rows, 'Lois', 'Robert')).to.equal(2)
            expect(seatAssignment.getDistance(rows, 'Lois', 'Guy')).to.equal(2)
        })
    })

    describe('#solution_cost', function() {
        it('works over a set of real constraints', function() {

            let seatAssignment = new SeatAssignment({
                numRows: 2,
                numCols: 6,
                employees: employees,
                distanceConstraints: distanceConstraints,
                positionConstraints: positionConstraints
            })

            let solution = [
                [ 'Robert', 'Scott', 'Kaili', 'Randy', 'Chloe', 'Alex' ],
                [ 'Cassy', 'Lois', 'Guy', 'Idan', 'Bo', null ]
            ]

            expect(seatAssignment.solution_cost(solution)).to.equal(1)
        })

        it('works', function() {

            const distanceConstraints = [
                new DistanceConstraint({
                    name1: 'Kaili',
                    name2: 'Lois',
                    value: 1
                })
            ]

            const positionConstraints = [
                new PositionConstraint({
                    name: 'Lois',
                    value: {row: 0, col: 0}
                }),
            ]

            let seatAssignment = new SeatAssignment({
                numRows: 2,
                numCols: 6,
                employees: employees,
                distanceConstraints: distanceConstraints,
                positionConstraints: positionConstraints
            })

            let solution = [
                [ 'Robert', 'Scott', 'Kaili', 'Randy', 'Chloe', 'Alex' ],
                [ 'Cassy', 'Lois', 'Guy', 'Idan', 'Bo', null ]
            ]

            expect(seatAssignment.solution_cost(solution)).to.equal(6)
        })
    })
})
