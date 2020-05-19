var UserController = require('./controllers/UserController');
var GameController = require('./controllers/GameController')
const authMiddleware = require('./authHelper')
const cors = require('cors');


// Routes
module.exports = function(app){  
    // Main Routes

    app.get('/user/autoBitcoin', cors(), UserController.autoBitcoin)
    
    app.get('/Game/getItems', cors(), GameController.getItems)
    app.get('/Game/getFirewalls', cors(), GameController.getFirewalls)
    app.get('/Game/getPrestigeItems', cors(), GameController.getPrestigeItems)
    app.get('/Game/getCommands', cors(), GameController.getCommands)

    app.post('/user/RegisterUser', cors(), UserController.RegisterUser);
    app.post('/user/getBitcoin', cors(), UserController.getBitcoin);
    app.post('/user/saveProgress', cors(), UserController.saveProgress)
    app.post('/user/makeTransaction', cors(), UserController.makeTransaction)
    app.post('/user/getItemArray', cors(), UserController.getItemArray)
    app.post('/user/getCommandArray', cors(), UserController.getCommandArray)
    app.post('/user/executeCommand', cors(), UserController.executeCommand)

    app.post('/user/getPrestigePoints', cors(), UserController.getPrestigePoints)
    app.post('/user/savePrestigeProgress', cors(), UserController.savePrestigeProgress)
    app.post('/user/resetGainPrestige', cors(), UserController.resetGainPrestige)
    app.post('/user/makePrestigeTransaction', cors(), UserController.makePrestigeTransaction)
    app.post('/user/getUserPrestigeItems', cors(), UserController.getUserPrestigeItems)
    
    // Sign in
    app.post(
        '/auth', cors(),
        // middleware that handles the sign in process
        authMiddleware.signIn,
        authMiddleware.signJWTForUser
        )
};
