/* capstone subredditRouteProtected */

var express = require("express");
var Subreddit = require("../models/subredditSchema");
var User = require("../models/userSchema");
var Post = require("../models/postSchema");
var subredditRouteProtected = express.Router();

subredditRouteProtected.route("/")
    .get(function(req, res) {

        var date = new Date();

        if (req.query.time) {

            var time = req.query.time;

            switch (time) {
                case "minutes":
                    date.setMinutes(date.getMinutes() - 1);
                    break;
                case "hour":
                    date.setHours(date.getHours() - 1);
                    break;
                case "day":
                    date.setDate(date.getDate() - 1);
                    break;
                case "week":
                    date.setDate(date.getDate() - 7);
                    break;
                case "month":
                    date.setMonth(date.getMonth() - 1);
                    break;
                case "year":
                    date.setFullYear(date.getFullYear());
                    break;
            }

            Post.find({_id: {$in: req.user.subscribedSubreddits}, createdAt: {"$gte": date}}, function (err, postArray) {

                if (err) res.status(500).send(err);
                res.send(postArray);
            });
        }
        else {

            Post.find({_id: {$in: req.user.subscribedSubreddits}, createdAt: {"$gte": date.setDate(date.getDate()) - 1}}, function (err, postArray) {

                if (err) res.status(500).send(err);
                res.send(postArray);
            });
        }
    })

    .post(function(req, res) {

        var newSubreddit = new Subreddit(req.body);

        newSubreddit.creator = req.user;
        newSubreddit.save(function(err, newSubredditSaved) {

            if (err) res.status(500).send(err);

            User.findById(newSubredditSaved.creator, function(err, user) {

                if (err) return res.status(500).send(err);

                // auto subscribe user to their created subreddit
                user.subscribedSubreddits.push(newSubredditSaved);
                user.save();
            });

            res.send(newSubredditSaved);
        });
    });

module.exports = subredditRouteProtected;

/*

Subreddit Protected

file name: "subredditRouteProtected"
base route: /api/subreddit
purpose: Endpoints that can access subreddits only by a logged in user

sub route: /
    $http.get(baseUrl + "/api/subreddit")
    return array of current posts, limited to the specific subreddits to which the user is subscribed
    note:   The logged in user will be passed on req.user, which will contain an array of
            subscribed subreddit _id's. Use this information to query against the Subreddit collection,
            along with the timestamp parameter.

*/

module.exports = subredditRouteProtected;