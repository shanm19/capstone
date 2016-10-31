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

postRoute.route("/")
// $http.get(baseUrl + "/api/post")
// return user's post history
.get(function(req, res){
    User.findById(req.user._id)
    .populate('postHistory')
    .exec(function(err, foundUser){
        if(err) res.status(500).send(err);
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
.post(function(req, res){

    var newPost = new Post(req.body);

    newPost.save(function(err, savedPost){
        if(err) {
            res.status(500).send(err);
        } else {
            Subreddit.findById(req.body.subreddit, function(err, foundSub){
                if(err) res.status(500).send(err);
                foundSub.posts.push(savedPost._id);
                foundSub.save(function(err, savedSub){
                    if(err) res.status(500).send(err);
                })
                User.findById(req.user._id, function(err, foundUser){
                    if(err) res.status(500).send(err);
                    foundUser.postHistory.push(savedPost._id);
                    foundUser.save(function(err, savedUser){
                        if(err) res.status(500).send(err);
                        res.send(savedPost);
                    })
                })
            })
        }
    });

});


// $http.put(baseUrl + "/api/post/:postID", { updated post Obj })
// return user's updated post object in full
postRoute.route("/:postID")
.put(function(req, res){
    Post.findByIdAndUpdate(req.params.postID, 
    req.body, 
    { new:true }, 
    function(err, updatedPost){
        if(err) res.status(500).send(err);
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

// This is for posting primary level comments, directly to the Post object
postRoute.route("/comment/:postID")
// $http.post(baseUrl + "/api/post/comment/:postID, { content: "I like cheese" })
// return comment
.post(function(req, res){
	var postID = req.params.postID;
	Post.findById(postID, function(err, foundPost){
		if(err) {
			res.status(500).send(err);
		} else {
            req.body.originalPoster = req.user._id;
            var newComment = new Comment(req.body);
			newComment.save(function(err, savedComment){
				if(err) res.status(500).send(err);
				foundPost.comments.push(newComment);
				res.send(newComment);
			});
		}
	});
});

module.exports = postRouteProtected;