// Capstone userProtected.js

var express = require('express');
var User = require("../models/userSchema");
var userRouteProtected = express.Router();

// Get the user object from user collection based on user id and return.
userRouteProtected.route("/api/user") // .route("/")
    .get(function(req, res) {

        var user_id = req.user._id;

        User.find(user_id, function(err, user) { // User.findById; you can just do find, but you'd have to send a search object {_id: user_id}

            if (err) res.status(500).send(err);
            res.send(user);
        });
    })
    // Save the updated user object in the user collection.
    .put(function(req, res) {

        var user_id = req.user._id;

        User.findOneAndUpdate(user_id, req.body, function(err, updatedUser) { // findByIdAndUpdate; also, adding {new:true} as a parameter after req.body will return the updated user

            if (err) res.status(500).send(err);
            res.send(updatedUser);
        });
    })

    // Delete the user object from the user collection.
    .delete(function(req, res) {

        var user_id = req.user._id;

        User.findOneAndRemove(user_id, function(err, user) { // findByIdAndRemove

            if (err) req.status(500).send(err);
            res.send(user);
        });
    });

module.exports =  userRouteProtected;

/*

User Protected

file name: "userRouteProtected"
base route: /api/user
purpose: Endpoints a user can access after logging in for personal information
note: req.user._id will carry the specific user's _id after loggin in, it's added on in the backend with middleware

sub route: /
    $http.get(baseUrl + "/api/user")
    return user object 
    ---
    $http.put(baseUrl + "/api/user", { user Obj with updated info })
     return user object with updated info
    ---
    $http.delete(baseUrl + "/api/user")
    return deleted user obj 

*/
