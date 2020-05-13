const expect = require('chai').expect;
const nock = require('nock')
const User = require('./User')
const email = 'local@tests.nock'


describe('User controller functions', () => {

  afterEach(() => {
    nock.cleanAll()
  })

  it('Creating test user...', () => {
    return User.makeUser(email)
    .then(response => {
      expect(typeof response).to.equal('object')
    })
  }).timeout(5000);

  it('Get user item array', () => {
    return User.getItemArray(email)
      .then(response => {
        expect(typeof response).to.equal('object');
      });
  }).timeout(5000);

  it('Get user bitcoins', () => {
    return User.getBitcoin(email)
      .then(response => {
        expect(typeof response).to.equal('number');
      });
    }).timeout(5000);
    
  it('Confirm transaction', () => {
    return User.makeTransaction(email)
      .then(response => {
        expect(typeof response).to.equal('object');
      });
    }).timeout(5000);

  it('Confirm save progress', () => {
    return User.saveProgress(email)
      .then(response => {
        expect(typeof response).to.equal('string');
      });
    }).timeout(5000);

  it('Get prestige points', () => {
    return User.getPrestigePoints(email)
      .then(response => {
        expect(typeof response).to.equal('number');
      });
    }).timeout(5000);

  it('Confirm Save Prestige', () => {
    return User.savePrestigePoints(email)
      .then(response => {
        expect(typeof response).to.equal('string');
      });
    }).timeout(5000);

  it('Confirm prestige transaction', () => {
    return User.makePrestigeTransaction(email)
      .then(response => {
        expect(typeof response).to.equal('string');
      });
    }).timeout(5000);

  it('Confirm prestige reset', () => {
    return User.resetGainPrestige(email)
      .then(response => {
        expect(typeof response).to.equal('object');
      });
    });
});