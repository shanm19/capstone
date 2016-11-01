var express = require('express');
var commentRoute = express.Router();
var Comment = require('../models/commentSchema');

// This is for posting secondary+ level comments, directly to the parent comment object
// Note: this is a temp bypass, you should be making nested comments to commentRouteProtected when logged in
//commentRoute.route("/:commentID")
// $http.post(baseUrl + "/comment/:commentID, { content: "I like cheese", originalPoster: user._id })
// return comment
// .post(function(req, res){
// 	var commentID = req.params.commentID;
// 	Comment.findById(commentID, function(err, foundComment){
// 		if(err) {
// 			res.status(500).send(err);
// 		} else {
//             //req.body.originalPoster = req.user._id;
//             var newComment = new Comment(req.body);
// 			newComment.save(function(err, savedComment){
// 				if(err) res.status(500).send(err);
// 				foundComment.comments.push(newComment);
//                 foundComment.save(function(err, savedParentComment){
//                     if(err) res.status(500).send(err);
//                     res.send(newComment);
//                 })
// 			});
// 		}
// 	});
// });

module.exports = commentRoute;