const expect = require('chai').expect

const { DistanceConstraint, PositionConstraint, ConstraintPriority } = require('../lib/constraint')

describe('DistanceConstraint', function() {

    it('initializes properly', function() {
        let constraint = new DistanceConstraint({
            name1: 'Greg',
            name2: 'Lois',
            operator: '>',
            value: 2,
            priority: ConstraintPriority.high
        })

        expect(constraint.name1).to.equal('Greg')
        expect(constraint.name2).to.equal('Lois')
        expect(constraint.operator).to.equal('>')
        expect(constraint.value).to.equal(2)
        expect(constraint.priority).to.equal(ConstraintPriority.high)
    })

    it('defaults to the = operator', function() {
        let constraint = new DistanceConstraint({
            name1: 'Greg',
            name2: 'Lois',
            value: 2
        })

        expect(constraint.operator).to.equal('=')
    })

    it('defaults to the medium priority', function() {
        let constraint = new DistanceConstraint({
            name1: 'Greg',
            name2: 'Lois',
            value: 2
        })

        expect(constraint.priority).to.equal(ConstraintPriority.medium)
    })

    it('evaluates = properly', function() {
        let constraint = new DistanceConstraint({
            name1: 'Greg',
            name2: 'Lois',
            operator: '=',
            value: 2
        })

        expect(constraint.evaluate(1)).to.be.false
        expect(constraint.evaluate(2)).to.be.true
        expect(constraint.evaluate(3)).to.be.false
    })

    it('evaluates > properly', function() {
        let constraint = new DistanceConstraint({
            name1: 'Greg',
            name2: 'Lois',
            operator: '>',
            value: 2
        })

        expect(constraint.evaluate(1)).to.be.false
        expect(constraint.evaluate(2)).to.be.false
        expect(constraint.evaluate(3)).to.be.true
    })

    it('evaluates >= properly', function() {
        let constraint = new DistanceConstraint({
            name1: 'Greg',
            name2: 'Lois',
            operator: '>=',
            value: 2
        })

        expect(constraint.evaluate(1)).to.be.false
        expect(constraint.evaluate(2)).to.be.true
        expect(constraint.evaluate(3)).to.be.true
    })

    it('evaluates < properly', function() {
        let constraint = new DistanceConstraint({
            name1: 'Greg',
            name2: 'Lois',
            operator: '<',
            value: 2
        })

        expect(constraint.evaluate(1)).to.be.true
        expect(constraint.evaluate(2)).to.be.false
        expect(constraint.evaluate(3)).to.be.false
    })

    it('evaluates <= properly', function() {
        let constraint = new DistanceConstraint({
            name1: 'Greg',
            name2: 'Lois',
            operator: '<=',
            value: 2
        })

        expect(constraint.evaluate(1)).to.be.true
        expect(constraint.evaluate(2)).to.be.true
        expect(constraint.evaluate(3)).to.be.false
    })
})

describe('PositionConstraint', function() {

    it('initializes properly', function() {
        let constraint = new PositionConstraint({
            name: 'Greg',
            value: { row: 1, col: 2 },
            priority: ConstraintPriority.low
        })

        expect(constraint.name).to.equal('Greg')
        expect(constraint.value.row).to.equal(1)
        expect(constraint.value.col).to.equal(2)
        expect(constraint.priority).to.equal(ConstraintPriority.low)
    })

    it('defaults to the high priority', function() {
        let constraint = new PositionConstraint({
            name: 'Greg',
            value: { row: 1, col: 2 },
        })

        expect(constraint.priority).to.equal(ConstraintPriority.high)
    })

    it('evaluates properly', function() {
        let constraint = new PositionConstraint({
            name: 'Greg',
            value: { row: 1, col: 2 }
        })

        expect(constraint.evaluate({ row: 0, col: 2 })).to.be.false
        expect(constraint.evaluate({ row: 1, col: 2 })).to.be.true
        expect(constraint.evaluate({ row: 1, col: 1 })).to.be.false
        expect(constraint.evaluate({ row: 1, col: 0 })).to.be.false
    })
})

