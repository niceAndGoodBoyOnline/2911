var HomeController = require('./controllers/HomeController');
var UserController = require('./controllers/UserController');
var GameController = require('./controllers/GameController')
const authMiddleware = require('./authHelper')
const cors = require('cors');


// Routes
module.exports = function(app){  
    // Main Routes
    app.get('/',      HomeController.Index);

    app.get('/user/Register', UserController.Register);
    app.post('/user/RegisterUser', cors(), UserController.RegisterUser);
    app.get('/user/Login', UserController.Login);
    app.post('/user/LoginUser', UserController.LoginUser);
    app.get('/user/Logout', UserController.Logout);
    app.get('/user/SecureArea', UserController.SecureArea);

    app.post('/user/getBitcoin', cors(), UserController.getBitcoin);
    app.post('/user/saveProgress', cors(), UserController.saveProgress)
    app.get('/Game/getItems', cors(), GameController.getItems)
    app.post('/user/makeTransaction', cors(), UserController.makeTransaction)
    app.post('/user/getItemArray', cors(), UserController.getItemArray)
    app.get('/user/autoBitcoin', cors(), UserController.autoBitcoin)
    
    // Sign in
    app.post(
        '/auth', cors(),
        // middleware that handles the sign in process
        authMiddleware.signIn,
        authMiddleware.signJWTForUser
        )

    // Accessible to authenticated user. CORS must be enabled 
    // for client App to access it.
    app.get('/user/SecureAreaJwt', cors(),  
        authMiddleware.requireJWT, UserController.SecureAreaJwt)

    // Accessible to manager or admin. CORS must be enabled for 
    // client App to access it.
    app.get('/user/ManagerAreaJwt', cors(), 
        authMiddleware.requireJWT, UserController.ManagerAreaJwt)
    
    // Receives posted data from authenticated users.
    app.post('/user/PostAreaJwt', cors(), 
        authMiddleware.requireJWT, UserController.PostAreaJwt)

};
