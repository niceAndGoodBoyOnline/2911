const expect = require('chai').expect;
const Main = require('../Main')

// const getItems = Main.getItems;

describe('Main page functions', () => {
  it('Get all items', () => {
    return Main.getItems()
      .then(response => {
        console.log(response)
        //expect an object back
        expect(typeof response).to.equal('object');

      });
  });
});