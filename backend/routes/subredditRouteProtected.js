/* capstone subredditRouteProtected */

var express = require("express");
var Subreddit = require("../models/subredditSchema");
var User = require("../models/userSchema");
var subredditRouteProtected = express.Router();

subredditRouteProtected.route("/search")
    .get(function(req, res) {

        var time = req.query.time;
        var date = new Date();

        switch (time) {
            case "minutes":
                date.setMinutes(date.getMinutes() -1);
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

        // there's a better way to do this with the query using $in
        Subreddit.find({subscribers: req.user_id}, function(err, subreddits) {

            if (err) res.status(500).send(err);
            else {

                var postsArray = [];

                subreddits.forEach(function(subreddit) {

                    Subreddit.findOne({_id: subreddit._id})

                        .populate("posts")
                            .exec(function(err, subredditFound) {

                                if (err) res.status(500).send(err);
                                else {

                                    if (subredditFound.posts.length) {

                                        subredditFound.posts.forEach(function (post) {

                                            if (post.timestamps.createdAt >= date)
                                                postsArray.push(subredditFound.post);
                                        });
                                    }
                                }
                            });
                });
                res.send(postsArray);
            }
        });
    });

subredditRouteProtected.route("/")
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