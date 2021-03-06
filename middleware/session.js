const User = require('../models/user');

// redered rounte

function loggedIn(req, res, next) {
    
    if(req.session && req.session.userId) {

        User.findById(req.session.userId, function(err, user){
            if(user.admin){
                return res.redirect('/admin');

            }else{
                return res.redirect('/ideas');
            }
            return next();
        });

    }else{
        return next();
    }

}

function loginRequired(req, res, next) {
    if(req.session && req.session.userId) {
        return next();
    }
    return res.redirect('/');
}

// json routes

// function jsonLoginInAdmin(req, res, next){
    
// }

function jsonLoginRequired(req, res, next){
    if(req.session && req.session.userId) {
        return next();
    }
    res.status(401);
    return res.json({
        error: 'unauthorized'
    });
}

// function requiresApiKey(req, res, next){

//     if(req.method == "GET"){
//         const apikey = 
//     }

//     if(req.method == "POST"){

//     }

//     let err = new Error('unknown method');
//     err.status(500);
//     return next(err);

// }

module.exports.loggedIn = loggedIn;
module.exports.loginRequired = loginRequired;
module.exports.jsonLoginRequired = jsonLoginRequired;