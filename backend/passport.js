// passport.js config

var FacebookStrategy = require('passport-facebook').Strategy;

// load the user model
var User = require('./models/userSchema');

// load the auth variables
var config = require('./config');

module.exports = function(passport) {

    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user) {
            done(err, user);
        })
    });

    ////////////////////////////////////
    ///         FACEBOOK            ///
    //////////////////////////////////
    passport.use(new FacebookStrategy({

        //pull in the FB app credetials from config file
        clientID: config.facebookAuth.clientID,
        clientSecret: config.facebookAuth.clientSecret,
        callbackURL: config.facebookAuth.callbackURL
    },
    
    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            //find the user in the database based on facebook id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                if(err) return done(err);

                if(user) {
                    return done(null, user);
                } else {
                    // if no user found with the facebook id, create one
                    var newUser = new User();

                    newUser.facebook.id = profile.id; // set the users facebook id
                    newUser.facebook.token = token; // save the token that facebook provides
                    newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName
                    newUser.facebook.email = profile.emails[0].value; // facebook may return multiple emails

                    newUser.save(function(err, savedUser){
                        if(err) throw err;
                        return done(null, newUser);
                    })
                }
            })
        })
    }
    
    ))    
}