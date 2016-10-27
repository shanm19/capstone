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

postRoute.route("/")
// GET all posts based
// You probably won't really use this endpoint, it will return everything
// $http.get(baseUrl + "/post")
// return all posts
.get(function(req, res){
	Post.find({}, function(err, posts){
		if(err) res.status(500).send(err);
		res.send(posts);
	});
})
// I considered only having logged in users make posts, but this is fine
// It also could just be an option until the authentication is hooked up
// $http.post(baseUrl + "/post", { title: "", subreddit: sub._id, siteUrl: "", image: "", tags: ["nsfw"] })
// return new post object
.post(function(req, res){
	var newPost = new Post(req.body);
	newPost.save(function(err, savedPost){
		if(err) res.status(500).send(err);
		res.send(savedPost);
	});
});


postRoute.route("/search")

// eg: time="day" would return all new posts in the last 24 hours
// and time="hour" would return all new posts in the last hour
// optional feature down the road can be to find posts by specific days, months, etc
.get(function(req, res){  

	// $http.get(baseUrl + "/post/search?time=")
	if(req.query.time){
		var time = req.query.time;    
		var d = new Date();

		// Rewind the clock for the db query
		if(time === "hour") d.setHours(d.getHours() - 1);
		if(time === "day") d.setDate(d.getDate() - 1);
		if(time === "week") d.setDate(d.getDate() - 7);
		if(time === "month") d.setMonth(d.getMonth() - 1);
		if(time === "year") d.setFullYear(d.getFullYear() - 1);

		Post.find({createdAt: {"$gte": d}}, function(err, posts){
			if(err) res.status(500).send(err);
			res.send(posts);
		})
	}

	// documentation at https://www.npmjs.com/package/mongoosastic
	// this is an implementation of mongoosastic, which combines elasticsearch with
	// mongoose to achieve 'fuzzy' search results, or anything that is a partial match
	// on the postSchema you will see es_indexed: true, which takes specified information
	// and places it in an elastic-searchable index file and ties everything together
	// note: make sure to npm install, it's been added as a dependency in the package.json
	// $http.get(baseUrl + "/post/search?title=")
	if(req.query.title){
		var title = req.query.title;
		Post.search({
  			query_string: {
    			query: title
  			}
			  // by default, only the indexed data is returned
			  // this will 'hydrate' the results with the full object data
		}, { hydrate: true }, function(err, foundPosts){ 
			if(err) res.status(500).send(err);
			res.send(foundPosts);
		});
	}

});

postRoute.route("/:postID")
// $http.get(baseUrl + "/post/:postID")
// return post object with deeply populated comments
.get(function(req, res){
	var postID = req.params.postID;
	Post.findById(postID)
	// documentation for deepPopulate at https://www.npmjs.com/package/mongoose-deep-populate
	.deepPopulate('comments')
	.exec(function(err, post){
		if(err) res.status(500).send(err);
		res.send(post);
	});
});

module.exports = postRoute;