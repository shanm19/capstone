/* capstone userRoute.js */

var express = require('express');
var User = require("../models/userSchema");
var Post = require("../models/post");
var userRoute = express.Router;

// Get all posts belonging to currently logged in user.
// Populated the post field with post and subreddits.
userRoute.route("/")
.get(function(req, res) {

    User.find({user: req.user._id})

        .populate("post")
            .exec(function(err, userPosts) {

                if (err) res.status(500).send(err);
                res.send(userPosts);
            });
});

// Save a user post.
userRoute.route("/post")
.put(function(req, res) {

    var post = new Post(req.body);
    var user_id = req.user._id;

    User.findOneAndUpdate(user_id, {postHistory: post}, function(err, updatedUser) {

        if (err) res.status(500).send(err);
        res.send(updatedUser);
    });
});