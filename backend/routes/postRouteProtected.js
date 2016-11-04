    /*


 Post Protected

 file name: "postRouteProtected"
 base route: /api/post
 purpose: Endpoints a user can access after logging in for posting
 note: req.user._id will carry the specific user's _id after loggin in, it's added on in the backend with middleware

 sub route: /
 $http.get(baseUrl + "/api/post");
 return array of all personal posts
 ---
 $http.post(baseUrl + "/api/post", {
 title: "Bananas are bananas",
 subreddit: currentSubreddit._id,
 siteUrl: "http://www.something.com",
 image: "asdfaewetw123sdfq35",
 tags: "nsfw"
 })
 return user's new post object
 ---
 sub route: /:postID
 $http.put(baseUrl + "/api/post/:postID", { updated post Obj })
 return user's updated post object in full
 ---
 sub route: /comment/:postID
 $http.post(baseUrl + "/api/post/comment/:postID, { content: "I like cheese" })
 return comment

 */

var express = require('express');
var postRouteProtected = express.Router();
var User = require('../models/userSchema');
var Subreddit = require('../models/subredditSchema');
var Post = require('../models/postSchema');
var Comment = require('../models/commentSchema');
var multipart = require('connect-multiparty');
var multipartyMiddleWare = multipart();
var fs = require('fs');

// needed for the req.file for images
// protected route
postRouteProtected.use('*', multipartyMiddleWare);


postRouteProtected.route('/')
// $http.get(baseUrl + "/api/post")
// return user's post history
    .get(function (req, res) {
        User.findById(req.user._id)
            .populate('postHistory')
            .exec(function (err, foundUser) {
                if (err) res.status(500).send(err);
                res.send(foundUser.postHistory);
            });
    })
    // $http.post(baseUrl + "/api/post", { 
    //         title: "Bananas are bananas",
    //         subreddit: currentSubreddit._id,
    //         siteUrl: "http://www.something.com",
    //         image: "asdfaewetw123sdfq35",
    //         tags: "nsfw"
    //      })
    //      return user's new post object
    .post(function (req, res) {

        var newPost = new Post(req.body);
        newPost.originalPoster = req.user;
        if (newPost.type === 'link') {
            if (req.files.image) {
                var data = fs.readFileSync(req.files.image.path);
                var contentType = req.files.image.type;
                newPost.image = 'data:' + contentType + ';base64,' + data.toString('base64');
            } else {
                newPost.image = '../assets/text.png';
            }

        newPost.save(function (err, savedPost) {
            if (err) return res.status(500).send(err);

            Subreddit.findById(req.body.subreddit, function (err, foundSub) {
                if (err) return res.status(500).send(err);

                Subreddit.findOne(req.body.subreddit, function (err, foundSub) {
                    if (err) return res.status(500).send(err);
                    foundSub.posts.push(savedPost._id);
                    foundSub.save(function (err, savedSub) {
                        if (err) res.status(500).send(err);
                    });
                    User.findById(req.user._id, function (err, foundUser) {
                        if (err) res.status(500).send(err);
                        foundUser.postHistory.push(savedPost._id);
                        foundUser.save(function (err, savedUser) {
                            if (err) res.status(500).send(err);
                            res.send(savedPost);
                        })
                    })
                })
            });
        });
        }
    });

    // $http.put(baseUrl + "/api/post/:postID", { updated post Obj })
    // return user's updated post object in full
    postRouteProtected.route("/:postID")
        .put(function (req, res) {
            Post.findByIdAndUpdate(req.params.postID,
                req.body, {
                    new: true
                },
                function (err, updatedPost) {
                    if (err) res.status(500).send(err);
                    res.send(updatedPost);
                });
        })
        // there will not be a delete method
        // consider this...
        // a user wants to delete a single post
        // that post's reference id is located in the user's post history,
        // the post's subreddit,
        // the post itself,
        // and EVERY comment that belongs to the post
        // that would be way too much overhead for deleting when it's safer to allow the post
        // to be downvoted into oblivion instead of potentially being negligent enough to allow
        // comments to be orphaned in the collection and be an unremovable hindrance

    // add a new Comment related to an existing Post
    postRouteProtected.route("/:postID/comments")
        .post(function (req, res) {
            var postID = req.params.postID;

            var newComment = new Comment(req.body);

            newComment.originalPoster = req.user._id

            newComment.save();


            Post.findById(postID, function (err, foundPost) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    foundPost.comments.push(newComment._id)
                    Post.findByIdAndUpdate(postID, foundPost, {
                            new: true
                        })
                        .populate('originalPoster')
                        .deepPopulate("comments comments.originalPoster comments.comments comments.comments.comments")
                        // Disclaimer: NO idea if this is right yet, hasn't been tested
                        // The idea is to also deeply populate the comments and also fill out
                        // only the person's username and _id who submitted the comment
                        // Ref: http://stackoverflow.com/questions/26691543/return-certain-fields-with-populate-from-mongoose
                        //.deepPopulate('comments.originalPoster', 'username _id')
                        .exec(function (err, updatedPost) {
                            if (err) {
                                res.status(500).send(err);
                            } else {
                                res.send(updatedPost)
                            }

                        });
                }
            })
        })

    module.exports = postRouteProtected;