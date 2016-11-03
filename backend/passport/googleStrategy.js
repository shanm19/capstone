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

             var user = {};
            user.email = profile.emails[0].value;
            // user.image = profile._json.image.url;
            user.firstName = profile.name.givenName;
            user.lastName = profile.name.familyName;
            user.username = profile.name.givenName.slice(0,2) + profile.name.familyName.slice(0,3);
            user.facebook = {};
            user.facebookId = profile.id;
            user.facebook.accessToken = accessToken;

            done(null, profile)
        }))
}