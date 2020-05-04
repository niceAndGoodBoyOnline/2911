var UserController = require('./controllers/UserController');
var GameController = require('./controllers/GameController')
const authMiddleware = require('./authHelper')
const cors = require('cors');


// Routes
module.exports = function(app){  
    // Main Routes

    app.post('/user/RegisterUser', cors(), UserController.RegisterUser);
    app.post('/user/getBitcoin', cors(), UserController.getBitcoin);
    app.post('/user/saveProgress', cors(), UserController.saveProgress)
    app.get('/Game/getItems', cors(), GameController.getItems)
    app.post('/user/makeTransaction', cors(), UserController.makeTransaction)
    app.post('/user/getItemArray', cors(), UserController.getItemArray)
    app.get('/user/autoBitcoin', cors(), UserController.autoBitcoin)
    app.get('/Game/getPrestigeItems', cors(), GameController.getPrestigeItems)
    app.post('/user/getPrestigePoints', cors(), UserController.getPrestigePoints)
    app.post('/user/savePrestigeProgress', cors(), UserController.savePrestigeProgress)
    
    // Sign in
    app.post(
        '/auth', cors(),
        // middleware that handles the sign in process
        authMiddleware.signIn,
        authMiddleware.signJWTForUser
        )
};
