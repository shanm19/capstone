/* capstone subredditRoute.js */

var express = require("express");
var Subreddit = require("../models/subredditSchema");
var Post = require("../models/postSchema");
var subredditRoute = express.Router();

// find all subreddits, return the names
subredditRoute.route("/")
    .get(function (req, res) {
        Subreddit.find({}, 'name', function (err, subreddits) {
            if (err) return res.status(500).send(err);

            res.send(subreddits);
        });
    });

// search for a subreddit by name
subredditRoute.route("/search")
    .get(function (req, res) {

        Subreddit.findOne({name: req.query.name})
            .populate("posts")
            .exec(function (err, subredditFound) {

                if (err) res.status(500).send(err);
                res.send(subredditFound);
            });
    });

// search for a sub matching any pattern of the keyword
subredditRoute.route("/query/:keyword")
    .get(function (req, res) {
        Subreddit.find({name: new RegExp(req.params.keyword, 'i')}, 'name', function (err, subReddits) {
            if (err) return res.status(500).send(err);
            res.send(subReddits);
        })
    });

// return a subreddit object
subredditRoute.route("/:subredditID")
    .get(function (req, res) {

        Subreddit.findById(req.params.subredditID)
            .populate({
                path: 'posts',
                populate: {
                    path: 'originalPoster subreddit',
                    select: 'username name'
                }
            })
            .exec(function (err, subredditFound) {

                if (err) res.status(500).send(err);
                res.send(subredditFound);
            });
    });

// find all posts in a subreddit created in the last 24 hours
subredditRoute.route("/posts/:subredditID")
    .get(function (req, res) {

        var subID = req.params.subredditID;

        var d = new Date();

        if (req.query.time) {

            if (req.query.time === "hour") d.setDate(d.getHours() - 1);
            if (req.query.time === "day") d.setDate(d.getDate() - 1);
            if (req.query.time === "week") d.setDate(d.getDate() - 7);
            if (req.query.time === "month") d.setDate(d.getMonth() - 1);
            if (req.query.time === "year") d.setDate(d.getFullYear() - 1);

            Post.find({subreddit: subID, createdAt: {"$gte": d}}, function (err, foundPosts) {
                if (err) res.status(500).send(err);
                res.send(foundPosts);
            });
        } else {
            Post.find({subreddit: subID, createdAt: {"$gte": d.setDate(d.getDate() - 1)}}, function (err, foundPosts) {
                if (err) res.status(500).send(err);
                res.send(foundPosts);
            });
        }
    });

module.exports = subredditRoute;

/*

 Subreddit

 file name: "subredditRoute"
 base route: /subreddit
 purpose: Access subreddit data without being logged in

 sub route: /
 $http.get(baseUrl + "/subreddit")
 return an array of all subreddit names, could be used for an autocomplete feature
 ---
 sub route: /search
 $http.get(baseUrl + "/subreddit/search?" + queryString)
 return subreddit object with posts populated
 note:   This is for when a user uses the search bar OR dropdown list of
 subreddit names to find a specific subreddit by name
 ---
 sub route: /:subredditID
 $http.get(baseUrl + "/subreddit/:subredditID")
 return subreddit object found by ID

 */

module.exports = subredditRoute;