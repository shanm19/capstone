/* capstone post.js */

var express = require("express");
var Post = require("../models/user");
var postRoute = express.Router;

postRoute.route("/")
.get(function(req, res) {

    Post.find({}, function(err, posts) {

        if (err) res.status(500).send(err);
        res.send(posts);
    })
});