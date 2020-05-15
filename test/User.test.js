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
      console.log(response)
    })
  }).timeout(5000);

  it('Get user item array', () => {
    return User.getItemArray(email)
      .then(response => {
        expect(typeof response).to.equal('object');
      });
  }).timeout(5000);


  it('Get user prestige items', () => {
    return User.getUserPrestigeItems(email)
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


describe('User creation testing', () => {

  afterEach(() => {
    nock.cleanAll()
  })

  it('Checking password validation', () => {
    return User.checkPasswordValidation(email)
    .then(response => {
     console.log(response)
     expect(response.errorMessage).to.equal('Passwords do not match')
    })
  }).timeout(5000);

  it('Checking password strength validation', () => {
    return User.checkPasswordStrengthValidation(email)
    .then(response => {
     console.log(response)
     expect(response.message).to.equal('Password must have 1 lowercase and uppercase, 1 number, 1 special character, and at least 8 characters long.')
    })
  }).timeout(5000);
  


  it('Checking if existing username', () => {
    return User.checkExistingUser(email)
    .then(response => {
     console.log(response)
     expect(response.message).to.equal('User already exists with that username.')
    })
  }).timeout(5000);

  it('Checking if existing email', () => {
    return User.checkExistingEmail(email)
    .then(response => {
     console.log(response)
     expect(response.message).to.equal('User already exists with that email.')

    })
  }).timeout(5000);

});