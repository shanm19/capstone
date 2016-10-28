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
        $http.delete(baseUrl + "/api/post/:postID")
        return user's deleted post
    ---
    sub route: /comment/:postID
        $http.post(baseUrl + "/api/post/comment/:postID, { content: "I like cheese" })
        return comment

*/

var express = require('express');
var postRouteProtected = express.Router();



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