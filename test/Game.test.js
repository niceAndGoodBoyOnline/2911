const expect = require('chai').expect;
const nock = require('nock')
const Game = require('./Game')


describe('Game controller functions', () => {

  afterEach(() => {
    nock.cleanAll()
  })

  it('Get all items', () => {
    return Game.getItems()
      .then(response => {
        expect(typeof response).to.equal('object');

      });
  });

  it('Get all prestige items', () => {
    return Game.getPrestigeItems()
      .then(response => {
        expect(typeof response).to.equal('object')
      })
  })

  it('Get all firewalls', () => {
    return Game.getFirewalls()
      .then(response => {
        expect(typeof response).to.equal('object')
      })
  })
});