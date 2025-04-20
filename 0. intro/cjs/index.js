// CommonJS module export

const { sum } = require('./sum.js');

console.log('Hello, world! This is a test.');

// Using the imported sum function
console.log('Sum of 5 and 10 is:', sum(5, 10));