const expect = require('chai').expect;
const nock = require('nock')
const User = require('../User')
const email = 'j'


describe('User controller functions', () => {

  afterEach(() => {
    nock.cleanAll()
  })

  it('Get user item array', () => {
    return User.getItemArray(email)
      .then(response => {
        expect(typeof response).to.equal('object');
      });
  });

  it('Get user bitcoins', () => {
    return User.getBitcoin(email)
      .then(response => {
        expect(typeof response).to.equal('number');
      });
    });
    
  it('Confirm transaction', () => {
    return User.makeTransaction(email)
      .then(response => {
        expect(typeof response).to.equal('string');
      });
    });

  it('Confirm save progress', () => {
    return User.saveProgress(email)
      .then(response => {
        expect(typeof response).to.equal('string');
      });
    });

  it('Get prestige points', () => {
    return User.getPrestigePoints(email)
      .then(response => {
        expect(typeof response).to.equal('number');
      });
    });

  it('Confirm Save Prestige', () => {
    return User.savePrestigePoints(email)
      .then(response => {
        expect(typeof response).to.equal('string');
      });
    });

  it('Confirm prestige transaction', () => {
    return User.makePrestigeTransaction(email)
      .then(response => {
        expect(typeof response).to.equal('string');
      });
    });

  it('Confirm prestige reset', () => {
    return User.resetGainPrestige(email)
      .then(response => {
        expect(typeof response).to.equal('object');
      });
    });
});