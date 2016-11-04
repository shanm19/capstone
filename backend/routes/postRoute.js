/*
 Post
 file name: "postRoute"
 base route: /post
 purpose: Endpoints that can be accessed without being logged in to fill the front page
 sub route: /
 $http.get(baseUrl + "/post")
 return array of current posts
 Note:   This will need to be more robust than it seems.
 The GET should be able to query the Post collection limited by it's timestamp.
 Optionally, it can return the information sorted by a default of net votes, but the user will have several
 options for sorting the return data, so a lot of that sorting can be done front end after the initial query.
 ---
 sub route: /search
 $http.get(baseUrl + "/post/search?" + queryString)
 return array of queried searches
 Note:   This is for when a user uses the search bar to find a post by N parameters
 ---
 $http.post(baseUrl + "/post/search/", { queryObj })
 return array of queried searches
 Note:   This is an optional way to search that allows you to attach a req.body if the coder desires.
 However, it's not written. We're staying traditional.
 ---
 sub route: /:postID
 $http.get(baseUrl + "/post/:postID")
 return full post object with populated comments
 Note: 	The front page or subreddit is just filled with posts with basic data, and references to comments
 It's not until the 'comments' button is clicked that it will make a second call for the post
 and deep populate the comments
 */

var express = require('express');
var postRoute = express.Router();
var Post = require('../models/postSchema');
var Comment = require('../models/commentSchema');

// Mongoosastic indexing not working
// Post.createMapping(function(err, mapping) {
//   if (err) {
//     console.log('error creating mapping (you can safely ignore this)');
//     console.log(err);
//   } else {
//     console.log('mapping created!');
//     console.log(mapping);
//   }
// });

postRoute.route("/")
// You probably won't really use this endpoint, it will return everything
// $http.get(baseUrl + "/post")
// return all posts
    .get(function (req, res) { // ~ (this is my way of saying the endpoint is tested and proved)
        Post.find(req.query) // changed to req.query, if empty return all posts, if queries it'll return matches
            .sort({createdAt: -1})
            .limit(10)
            .populate('originalPoster', 'username')
            .populate('subreddit', 'name')
            .exec(function (err, posts) {
                if (err) res.status(500).send(err);
                res.send(posts);
            })
    });


postRoute.route("/search")
// eg: time="day" would return all new posts in the last 24 hours
// and time="hour" would return all new posts in the last hour
// optional feature down the road can be to find posts by specific days, months, etc
    .get(function (req, res) {

        // $http.get(baseUrl + "/post/search?time=")
        if (req.query.time) {
            var time = req.query.time;
            var d = new Date();

            // Rewind the clock for the db query
            if (time === "minute") d.setMinutes(d.getMinutes() - 1);
            if (time === "hour") d.setHours(d.getHours() - 1);
            if (time === "day") d.setDate(d.getDate() - 1);
            if (time === "week") d.setDate(d.getDate() - 7);
            if (time === "month") d.setMonth(d.getMonth() - 1);
            if (time === "year") d.setFullYear(d.getFullYear() - 1);

            Post.find({createdAt: {"$gte": d}}, function (err, posts) {
                if (err) res.status(500).send(err);
                res.send(posts);
            })
        }

        // Ref: https://www.npmjs.com/package/mongoosastic
        // This is an implementation of mongoosastic, which combines elasticsearch with
        // mongoose to achieve 'fuzzy' search results, or anything that is a partial match
        // on the postSchema you will see es_indexed: true, which takes specified information
        // and places it in an elastic-searchable index file and ties everything together
        // Note: make sure to npm install, it's been added as a dependency in the package.json
        // $http.get(baseUrl + "/post/search?title=")
        // if(req.query.title){ //
        // 	var title = req.query.title;
        // 	console.log("title",title);
        // 	Post.search({
        // 		query_string: {
        // 			query: title
        // 		}
        // 		  // by default, only the indexed data is returned
        // 		  // this will 'hydrate' the results with the full object data
        // 	}, { hydrate: true }, function(err, foundPosts){
        // 		console.log("foundPosts",foundPosts);
        // 		if(err) res.status(500).send(err);
        // 		res.send(foundPosts);
        // 	});
        // }

        // Mongoosastic not working, this is for finding exact matches
        if (req.query.title) { // ~
            var title = req.query.title;
            Post.find({
                title: title
            }, function (err, foundPosts) {
                if (err) res.status(500).send(err);
                res.send(foundPosts);
            });
        }

    });

postRoute.route("/:postID")
// $http.get(baseUrl + "/post/:postID")
// return post object with deeply populated comments
    .get(function (req, res) {
        var postID = req.params.postID;
        //var populateSections = ["comments", "comments.comments", "comments.comments.comments"];
        Post.findById(postID)
        // Ref for deepPopulate: https://www.npmjs.com/package/mongoose-deep-populate
        // Second Ref: http://stackoverflow.com/questions/27407080/mongoose-nested-deep-populate
        // I'm sure there's a better way, but for now this works
        // It only populates ternary comments, but this is similar to Reddit where you have to make
        // a subsequent call for deeper levels
            .deepPopulate("originalPoster comments comments.originalPoster comments.comments comments.comments.originalPoster comments.comments.comments comments.comments.comments.originalPoster")
            // Disclaimer: NO idea if this is right yet, hasn't been tested
            // The idea is to also deeply populate the comments and also fill out
            // only the person's username and _id who submitted the comment
            // Ref: http://stackoverflow.com/questions/26691543/return-certain-fields-with-populate-from-mongoose
            //.deepPopulate('comments.originalPoster', 'username _id')
            .exec(function (err, post) {
                if (err) res.status(500).send(err);
                res.send(post);
            });
    });

// This is for posting primary level comments, directly to the Post object
// Note: this method is a temp bypass, originalPoster should be grabbed by req.user._id and be under postRouteProtected
postRoute.route("/comment/:postID")
// $http.post(baseUrl + "/post/comment/:postID, { originalPoster: _id, content: "I like cheese" })
// return comment
    .post(function (req, res) { // ~
        var postID = req.params.postID;
        Post.findById(postID, function (err, foundPost) {
            if (err) {
                res.status(500).send(err);
            } else {
                var newComment = new Comment(req.body);
                newComment.save(function (err, savedComment) {
                    if (err) res.status(500).send(err);
                    foundPost.comments.push(newComment);
                    foundPost.save(function (err, savedPost) {
                        if (err) res.status(500).send(err);
                        res.send(newComment);
                    })
                });
            }
        });
    });

module.exports = postRoute;