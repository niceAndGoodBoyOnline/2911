const User           = require('../models/User');
const UserRepo       = require('../data/UserRepo');
const _userRepo      = new UserRepo();

const ItemRepo = require('../data/ItemRepo');
const _itemRepo = new ItemRepo();

var   passport       = require('passport');
const RequestService = require('../services/RequestService');

var timer = false;

// This function returns data to authenticated users only.
exports.SecureAreaJwt  = async function(req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req);

    if(reqInfo.authenticated) {
        res.json({errorMessage:"", reqInfo:reqInfo,
                  secureData: "Congratulations! You are authenticated and you have "
                           +  "successfully accessed this message."})
    }
    else {
        res.json( {errorMessage:'/user/Login?errorMessage=You ' + 
                  'must be logged in to view this page.'})
    }
}

// This function returns data to logged in managers only.
exports.ManagerAreaJwt  = async function(req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req, ['Admin', 'Manager']);

    if(reqInfo.rolePermitted) {
        res.json({errorMessage:"", reqInfo:reqInfo})
    }
    else {
        res.json({errorMessage:'You must be logged in with proper ' +
                'permissions to view this page.'});
    }
}

// This function receives a post from logged in users only.
exports.PostAreaJwt = async function(req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req, []);
    console.log(req.body.obj.msgFromClient);
    res.json({errorMessage:"", reqInfo:reqInfo, 
              msgFromServer:"Hi from server"})
};


// Displays registration form.
exports.Register = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    res.render('user/Register', {errorMessage:"", user:{}, reqInfo:reqInfo})
};

// Handles 'POST' with registration form submission.
exports.RegisterUser  = async function(req, res){
    // var specials = '!@#$%^&*'
    // var letters = /^[0-9a-zA-Z]+$/;
    var validation = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

    var password        = req.body.password;
    var passwordConfirm = req.body.passwordConfirm;


    if(validation.test(password) != true){
        res.json({message:'Password must have 1 lowercase and uppercase, 1 number, 1 special character, and at least 8 characters long.'})
    }

    let checkUser = await _userRepo.checkUser(req.body.email, req.body.username)
    if(checkUser){
        res.json({message: checkUser})
    }

    // if(password.value.match(validation) == false){

    // }

    // if(password.length < 8){
    //     return res.json("Password must have at least 8 characters")
    // }
    // if(password.value.match(letters) == false){
    //     return res.json("Password must have at least 1 letter and 1 number")
    // }
    // if(password)

    if (password == passwordConfirm) {

        // Creates user object with mongoose model.
        // Note that the password is not present.
        var newUser = new User({
            email:        req.body.email,
            username:     req.body.username,
            bitcoin:      0
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
exports.Login = async function(req, res) {
    let reqInfo      = RequestService.reqHelper(req);
    let errorMessage = req.query.errorMessage; 

    res.render('user/Login', { user:{}, errorMessage:errorMessage, 
                               reqInfo:reqInfo});
}

// Receives login information & redirects 
// depending on pass or fail.
exports.LoginUser = async function(req, res, next) {
    let roles = await _userRepo.getRolesByUsername(req.body.username);
    sessionData = req.session;
    sessionData.roles  = roles;
  
  passport.authenticate('local', {
      successRedirect : '/user/SecureArea', 
      failureRedirect : '/user/Login?errorMessage=Invalid login.', 
  }) (req, res, next);
};

// Log user out and direct them to the login screen.
exports.Logout = (req, res) => {
    req.logout();
    let reqInfo = RequestService.reqHelper(req);

    res.render('user/Login', { user:{}, isLoggedIn:false, errorMessage : "", 
                               reqInfo:reqInfo});
};

// This displays a view called 'securearea' but only 
// if user is authenticated.
exports.SecureArea  = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);

    if(reqInfo.authenticated) {
        res.render('user/SecureArea', {errorMessage:"", reqInfo:reqInfo})
    }
    else {
        res.redirect('/user/Login?errorMessage=You ' + 
                     'must be logged in to view this page.')
    }
}


exports.getBitcoin = async function(req, res) {
    let bitcoin = await _userRepo.getBitcoin(req.body.email)

    res.json(bitcoin)
}

exports.saveProgress = async function(req, res){
    let response = await _userRepo.saveProgress(req.body.email, req.body.bitcoin)

    res.json(response)
}


exports.makeTransaction = async function(req, res){
    console.log('hi')
    let index = await _itemRepo.getIndex(req.body.name)
    let response = await _userRepo.makeTransaction(req.body.email, index)

    res.json(response)
}

exports.getItemArray = async function(req, res){
    let itemArray = await _userRepo.getItemArray(req.body.email)
    
    res.json(itemArray)
}

exports.autoBitcoin = async function(req, res){
    if(timer == false){
        timer = true
        setInterval(async function(){
            let response = await _userRepo.autoBitcoin()
        }, 5000)
    } else {
        res.json('Bitcoins already incrementing automatically.')
    }

}
