// Template for making Unit tests & teaching Oliver

// const = a "constant" reference
// it can't be changed, but can be used like any variable

// asset = the name of our const

// require = a node.js method that will include a module
// the module can be a built-in one
// or the module can be from the node_modules folder
const asset = require('chai').assert


//it = how we declare a new test

//'this test will always fail' = description of the test

// () => {...}    =  this is a lamba function basically
// (a lamba function one we make, use once, and throw away)

// assert = the constant we declared up top

// equal = the method of the asset module we want to use
// equal checks if parameter 1 "Moon" is the same as parameter 2 69

// this test will always fail
it('this test will always fail', () => {
    assert.equal("Moon", 69)
})

// another test, this one always passes
// using the notEqual method from assert
// it is indeed true that apples do not equal oranges

it ('this test will always pass', () => {
    assert.notEqual("apples", "oranges")
})

// find all the methods for the assert module here
// https://nodejs.org/api/assert.html