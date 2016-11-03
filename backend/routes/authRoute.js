/*

Auth

file name: "authRoute"
base route: /auth
purpose: Signing up and loggin in a new user

*/

var express = require('express');
var authRouter = express.Router();
var User = require('../models/userSchema');
var config = require('../config');
var jwt = require('jsonwebtoken');

authRouter.route('/profile')
    .get(function (req, res) {
        // console.log('profile route ', req)
        console.log('profile req.user ', req.user)
        console.log('profile req.authUser ', req.authUser)
            // console.log('profile req.body ', req.body)
        console.log('profile serializeuser ', req._passport.instance._userProperty)
        var user = req._passport.instance._userProperty
    
        res.redirect('http://localhost:8080/helloworld')
    })

/*********************************
            SIGNUP ROUTE
**********************************/

authRouter.post('/signup', function (req, res) {
    User.find({
        username: req.body.username.toLowerCase()
    }, (function (err, existingUser) {
        if (err) res.status(500).send(err);
        if (existingUser.length) res.json({
            success: false,
            cause: 'username or email',
            message: "That username is already taken."
        });
        else {
            User.find({
                email: req.body.email.toLowerCase()
            }, (function (err, existingUser) {
                if (err) res.status(500).send(err);
                if (existingUser.length) res.json({
                    success: false,
                    cause: 'username or email',
                    message: "That email belongs to an existing account"
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
            }))
        }
    }));
});


/**********************************
            LOGIN ROUTE
**********************************/

authRouter.post('/login', function (req, res) {
    console.log('login user ', req.body)
    User.findOne({
        username: req.body.username.toLowerCase()
    }, function (err, user) {
        if (err) res.status(500).send(err);

        // If user isn't in the database'
        if (!user) res.status(401).send({
            success: false,
            message: 'incorrect username or password'
        });

        // If user is found, check password and create token
        else if (user) {

            // Check password
            user.checkPassword(req.body.password, function (err, match) {
                if (err) {
                    res.status(500).send(err)
                } else if (!match) { res.status(401).send({
                    success: false,
                    message: 'incorrect username or password'
                });
                } else {
                    var token = jwt.sign(user.toObject(), config.db_secret, {
                        expiresIn: "24h"
                    });
                    res.send({
                        user: user.withoutPassword(),
                        token: token,
                        success: true,
                        message: 'Here is your token'
                    })
                }
            })
        }
    })
})

// delete user account route
authRouter.delete('/delete/:userId', function (req, res) {
    var userId = req.params.userId;
    User.findOneAndRemove({
        _id: userId
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
