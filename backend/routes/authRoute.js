/*

Auth

file name: "authRoute"
base route: /auth
purpose: Signing up and loggin in a new user

sub route: /signup
    $http.post(baseUrl + "/auth/signup", { firstName: "John", lastName: "Smith", username: "johnjohn", password: "1234"})
    return user object 

sub route: /login
    $http.post(baseUrl + "/auth/login", { username: "johnjohn", password: "1234" } )
    return user object

*/

var express = require('express');
var authRouter = express.Router();
var User = require('../models/userSchema');
var config = require('../config');

authRouter.route('/profile')
    .get(function (req, res) {
        // console.log('profile route ', req)
        console.log('profile req.user ', req.user)
        console.log('profile req.authUser ', req.authUser)
        // console.log('profile req.body ', req.body)
        console.log('profile serializeuser ', req._passport.instance._userProperty)
        var user = req._passport.instance._userProperty
        res.send(user)
    })

authRouter.post('/signup', function (req, res) {
    User.find({
        username: req.body.username
    }, (function (err, existingUser) {
        if (err) res.status(500).send(err);
        if (existingUser.length) res.json({
            success: false,
            message: "That username is already taken."
        });
        else {
            var newUser = new User(req.body);
            newUser.save(function (err, userObj) {
                if (err) res.status(500).send(err);
                if (userObj) res.send({
                    user: userObj,
                    message: "Successfully created new account.",
                    success: true
                });
                else {
                    console.log('user saved, but nothing returned ', userObj);
                }
            });
        }

    }));
});

authRouter.delete('/delete/:userId', function (req, res) {
    var userId = req.params.userId;
    User.findOneAndRemove({
        _id: uId
    }, function (err, deletedUser) {
        if (err) res.status(500).send(err);
        res.send({
            success: true,
            message: "User account was successfully deleted.",
            user: deletedUser
        });
    });
})

//////////////////////////////////////////////////
///                 FACEBOOK                   ///
//////////////////////////////////////////////////
// route for Facebook authentication and login
// passport
var passport = require('passport');

authRouter.get('/facebook', passport.authenticate('facebook', {
    session: false,
    scope: ['email']
}));


// handle the callback after facebook has authenticated the user
authRouter.get('/facebook/callback', passport.authenticate('facebook', {
    session: false,
    successRedirect: '/auth/profile',
    failureRedirect: '/'
}));


//////////////////////////////////////////////////
///                 GOOGLE                     ///
//////////////////////////////////////////////////
// route for Google authentication and login
authRouter.get('/google/', passport.authenticate('google', {
    session: false,
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
}));


authRouter.get('/google/callback', passport.authenticate('google', {
    session: false,
    successRedirect: '/auth/profile',
    failureRedirect: '/'
}))


module.exports = authRouter;