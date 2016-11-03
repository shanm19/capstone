/* capstone subredditRoute.js */

var express = require("express");
var Subreddit = require("../models/subredditSchema");
var subredditRoute = express.Router();

subredditRoute.route("/")
    .get(function (req, res) {
        Subreddit.find({}, 'name', function (err, subreddits) {
            if (err) return res.status(500).send(err);

            res.send(subreddits);
        });
    });

subredditRoute.route("/search")
    .get(function (req, res) {

        Subreddit.findOne({name: req.query.name})

            .populate("posts")
            .exec(function (err, subredditFound) {

                if (err) res.status(500).send(err);
                res.send(subredditFound);
            });
    });

subredditRoute.route("/:SubredditID")
    .get(function (req, res) {

        Subreddit.findOne({_id: req.params.id}, function (err, subredditFound) {

            if (err) res.status(500).send(err);
            res.send(subredditFound);
        });
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