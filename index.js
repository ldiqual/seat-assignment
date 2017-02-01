const SeatAssignment = require('./SeatAssignment')

var assignment = new SeatAssignment()
var result = assignment.anneal()
console.log('Result:')
console.log(result)
console.log('Cost: ' + assignment.solution_cost(result))
