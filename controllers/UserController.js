const User           = require('../models/User');
const UserRepo       = require('../data/UserRepo');
const _userRepo      = new UserRepo();

const ItemRepo = require('../data/ItemRepo');
const _itemRepo = new ItemRepo();

const PrestigeRepo = require('../data/PrestigeRepo')
const _prestigeRepo = new PrestigeRepo();

var   passport       = require('passport');
const RequestService = require('../services/RequestService');

//This variable is to prevent multiple instances of autosaves / autobitcoin
var timer = false;

// Displays registration form.
exports.Register = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    //Return the below information (stuff in {}) to 'user/Register' for rendering the page.
    res.render('user/Register', {errorMessage:"", user:{}, reqInfo:reqInfo})
};

// Handles 'POST' with registration form submission.
// Registers the user.
exports.RegisterUser  = async function(req, res){
    // RegEx formula for a strong password
    var validation = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

    // Grab the password from the POST request
    var password        = req.body.password;
    var passwordConfirm = req.body.passwordConfirm;

    // If the password does not follow the RegEx formula,
    if(validation.test(password) != true){
        // Return the following message.
        // This data is recieved by "(data)" in whatever function in the frontend that called this function.
        res.json({message:'Password must have 1 lowercase and uppercase, 1 number, 1 special character, and at least 8 characters long.'})
        return
    }

    // Call checkUser() function in UserRepo.js and assigned whatever returned to checkUser variable.
    let checkUser = await _userRepo.checkUser(req.body.email, req.body.username)
    // If checkUser is true
    if(checkUser){
        // Return the following message
        // This data is recieved by "(data) => " in whatever function in the frontend that called this function.
        res.json({message: checkUser})
        return
    }

    // If password is the same as the password confirmation,
    if (password == passwordConfirm) {

        //!!!!The following comments and code are not mine lol, it was taken from a previous assignment that was given to us!!!!!

        // Creates user object with mongoose model.
        var newUser = new User({
            email:        req.body.email,
            username:     req.body.username,
            bitcoin:      0,
            prestigePoints: 0
        });
       
        // Uses passport to register the user.
        // Pass in user object without password
        // and password as next parameter.
        User.register(new User(newUser), req.body.password, 
                function(err, account) {
                    // Show registration form with errors if fail.
                    if (err) {
                        let reqInfo = RequestService.reqHelper(req);
                        return res.json( 
                        { user : newUser, errorMessage: err, 
                          reqInfo:reqInfo });
                    }
                    // User registered so authenticate and redirect to secure 
                    // area.
                    passport.authenticate('local') (req, res, 
                            function () { res.json( {user: newUser, message:'Registration successful. Please login.'}); });
                });

    }
    else {
      res.json( {errorMessage: "Passwords do not match"})
    };
}


// Shows login form.
// !!!This function is not mine!!!
exports.Login = async function(req, res) {
    // reqInfo is basically important user information/credentials.
    // I dont really know much about it. We were never taught reqInfo thoroughly.
    let reqInfo      = RequestService.reqHelper(req);
    let errorMessage = req.query.errorMessage; 

    // Return information to user/Login page for rendering.
    res.render('user/Login', { user:{}, errorMessage:errorMessage, 
                               reqInfo:reqInfo});
}

// Log user out and direct them to the login screen.
// !!!This function is not mine!!!!
exports.Logout = (req, res) => {
    req.logout();
    let reqInfo = RequestService.reqHelper(req);

    res.render('user/Login', { user:{}, isLoggedIn:false, errorMessage : "", 
                               reqInfo:reqInfo});
};

// Gets the bitcoin from the database
exports.getBitcoin = async function(req, res) {
    // Call getBitcoin() function from UserRepo.js with user email from POST request as parameter
    console.log(req.body.email)
    let bitcoin = await _userRepo.getBitcoin(req.body.email)

    // Return amount of bitcoins.
    // This data is recieved by "(data) => " in whatever function in the frontend that called this function.
    res.json(bitcoin)
}

// Save progress
exports.saveProgress = async function(req, res){
    // Call saveProgress() function from UserRepo.js with email and bitcoin from POST request as parameter
    let response = await _userRepo.saveProgress(req.body.email, req.body.bitcoin)

    // Return whatever is returned from saveProgress from UserRepo.js
    // This data is recieved by "(data) => " in whatever function in the frontend that called this function.
    res.json(response)
}


// Make the transaction from buying items
exports.makeTransaction = async function(req, res){
    // Call getIndex() function from ItemRepo.js with item name from POST request as parameter
    // This function returns the index.
    let index = await _itemRepo.getIndex(req.body.name)
    // Call makeTransaction() function from UserRepo.js with email from POST request and index as parameter
    let response = await _userRepo.makeTransaction(req.body.email, index, req.body.quantity)

    // Return whatever is returned from makeTransaction() from UserRepo.js
    // This data is recieved by "(data) => " in whatever function in the frontend that called this function.
    res.json(response)
}


// Get amount of items the user bought
exports.getItemArray = async function(req, res){
    // Call getItemArray() from UserRepo.js with email from POST request as parameter
    let itemArray = await _userRepo.getItemArray(req.body.email)
    
    // Return whatever is returned from getItemArray from UserRepo.js
    // This data is recieved by "(data) => " in whatever function in the frontend that called this function.
    res.json(itemArray)
}

// Increase bitcoin for ALL USERS every 5 seconds.
// This is the afk bitcoin gain function.
exports.autoBitcoin = async function(req, res){
    // If timer is false,
    if(timer == false){
        // Make it true. This is so that there arent multiple instances of this function running at the same time.
        timer = true
        // Set how often the code below is executed.
        setInterval(async function(){
            // Call autoBitcoin() function from UserRepo.js
            let response = await _userRepo.autoBitcoin()
        // Execute above code every 5000 miliseconds (5 seconds)
        }, 5000)
    // If timer is not false,
    } else {
        // let em know that this is already running.
        res.json('Bitcoins already incrementing automatically.')
    }

}

// Get the user's prestige points
exports.getPrestigePoints = async function(req, res){
    // Call getPrestigePoints() from UserRepo.js to get prestige points
    let prestigePoints = await _userRepo.getPrestigePoints(req.body.email)

    // Return the points
    res.json(prestigePoints)
}

// Save the user's prestige points
exports.savePrestigeProgress = async function(req, res){
    // Call savePrestigeProgress() from UserRepo.js to save their prestige points
    let respond = await _userRepo.savePrestigeProgress(req.body.email, req.body.prestigePoints)

    // return whatever lol
    res.json(respond)
}

exports.resetGainPrestige = async function(req, res){
    let respond = await _userRepo.resetGainPrestige(req.body.email)

    res.json(respond)
}

exports.makePrestigeTransaction = async function(req, res){
    let index = await _prestigeRepo.getPrestigeIndex(req.body.name)
    let respond = await _userRepo.makePrestigeTransaction(req.body.email, index)

    res.json(respond)
}

exports.getUserPrestigeItems = async function(req, res){
    let prestigeItems = await _userRepo.getUserPrestigeItems(req.body.email)

    res.json(prestigeItems)
}
