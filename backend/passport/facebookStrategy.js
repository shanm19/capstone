    ////////////////////////////////////
    ///         FACEBOOK  OAUTH     ///
    //////////////////////////////////

// Passport OAuth Strategy

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

// load the user model
var User = require('../models/userSchema');

// load the auth variables
var config = require('../config');

module.exports = function () {

    passport.use(new FacebookStrategy({

            //pass in the options for the strategy, in this case
            // the facebook credetials from config file
            clientID: config.facebookAuth.clientID,
            clientSecret: config.facebookAuth.clientSecret,
            callbackURL: config.facebookAuth.callbackURL,
            passReqToCallback: true,
            profileFields: ['id', 'emails', 'name']
        },

        // facebook sends back the token and profile
        function (req, accessToken, refreshToken, profile, done) {
            
            var user = {};
            user.email = profile.emails[0].value;
            // user.image = profile._json.image.url;
            user.firstName = profile.name.givenName;
            user.lastName = profile.name.familyName;
            user.username = profile.name.givenName.slice(0,2) + profile.name.familyName.slice(0,3);
            user.facebook = {};
            user.facebookId = profile.id;
            user.facebook.accessToken = accessToken;

            User.find({
                facebookId: profile.id
            }, function (err, existingUser) {
                if (err) {
                      return done(err);
                }
                else { 
                    if (!existingUser.length) {
                    console.log('saving new user ')
                    // if no user found with the facebook id, create one
                    var newUser = new User(user);
                    newUser.save(function (err, savedUser) {
                        if (err) {
                            throw err;
                        } else {
                            req._passport.instance._userProperty = savedUser
                            return done(null, savedUser);
                        }
                    });
                } else {
                    
                    console.log('user already exists', existingUser[0]);
                    // add the user to req
                    req._passport.instance._userProperty = existingUser[0]
                     return done(null, existingUser[0]);
                }
            }});
        }
    ));
}