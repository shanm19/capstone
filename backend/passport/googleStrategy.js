var passport = require('passport');
// load the user model
var User = require('../models/userSchema');

// load the auth variables
var config = require('../config');


var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function () {

    passport.use(new GoogleStrategy({
            clientID: config.googleAuth.clientID,
            clientSecret: config.googleAuth.clientSecret,
            callbackURL: config.googleAuth.callbackURL,
            passReqToCallback: true,
        },
        function (req, accessToken, refreshToken, profile, done) {
            var user = {}
            done(null, profile)
        }))
}