/* capstone commentProtected */

var express = require("express");
var Comment = require("../models/commentSchema");
var Post = require("../models/postSchema");
var commentRouteProtected = express.Router();

commentRouteProtected.route = ("/api/comment")  // "/api/comment" is written in the server.js, so anything getting to this file already has '/api/comment' prefixed to it
   .get(function(req, res) {                    // commentRouteProtected.route("/")

       Comment.find({originalPoster: req.user_id},function(err, userComments) { // req.user._id

           if (err) res.status(500).send(err);
           res.send(userComments);
       });
   })

   .post(function(req, res) {

       var newComment = new Comment(req.body);

       var post_id = req.post._id; // req.body.postID

       if (post_id) {

           Post.findOne({_id:post_id}, function (err, post) {
               if (err) res.status(500).send(err);
               else {

                   post.comments.push(newComment._id);
                   post.save();
                   res.send(newComment);
               }
           })
       }
       else {

           Comment.findOne({_id:req.comment._id}, function (err, comment) { // _id: req.body.parentCommentID

               if (err) res.status(500).send(err);
               else {

                   comment.childComments.push(comment_id); // this is my fault; I changed it to just be 'comments' to be easier to deep populate; also, it should push newComment._id
                   comment.save();
                   res.send(newComment);
               }
           })
       }
   });

commentRouteProtected.route = ("/api/comment/:id") // commentRouteProtected.route("/:commentID")
   .put(function(req, res) {

       Comment.findOne({_id:req.params.id}, function(err, comment) {

           if (err) res.status(500).send(err);
           else if (req.user._id === comment.originalPoster.user._id) { // 'comment.originalPoster' is already Reference ID

               comment.editHistory.push(comment.content); // .unshift(comment.content); it works fine with .push, but unshift will place the most recent comment at the front of the array so the most recent edit is first
               comment.content = req.body.content; // req.body.editedComment
               res.send(comment); // comment.save();
           }
       });
   })

   .delete(function(req, res) {

       Comment.findOne({_id:req.params.id}, function(err, comment) {

               if (err) res.status(500).send(err);
               else {

                   comment.isDeleted = true; // comment.save();
                   res.send(comment);
               }
       })
   });

module.exports = commentRouteProtected;

/*

 Comment Protected

 file name: "commentRouteProtected"
 base route: /api/comment
 purpose: Endpoints that can access a user's comments

 sub route: /
 $http.get(baseUrl + "/api/comment")
 return array of all the user's comment history
 ---
 $http.post(baseUrl + "/api/comment", {
 content: "Stupid pun comment for cheap laughs.",
 parentComment: comment._id,
 postID: _id
 })
 return comment object
 Note:  This one is highly debatable. Frankly, I don't know how to do nested comments the best way.
 Conceptually, this is my thinking. There are two options (buttons) for submitting comments:
 1. The user submits a comment directly to the post, making isPrimaryComment = true
 2. The user submits a comment as a child of another comment
 Now, the parentComment and isPrimaryComment properties aren't being stored in the collection,
 they are just there for the backend to sort out where the comment goes, and then trims it off
 before being stored.
 If there is a post id, then the comment's ._id will be stored in the commentArray for the post.
 If the comment is being added as a child to another comment, you will create and set parentComment: parent._id
 Then, if it works, there is a mongoose deep populate npm package that appears capable of recursively
 retrieving and populating nested objects.

 sub route: /:commentID
 $http.put(baseUrl + "/api/comment/:commentID", {
 editedComment: ""
 })
 return comment object
 Note:   The comment schema now supports an edit history. You will send back the comment,
 find it in the collection, push the current comment to the editHistory array,
 overwrite the previous comment, and change isEdited to true. This allows the frontend
 to set a visual flag if a comment has been edited so users can check the history against
 the logic of the comment flow. Also, only allow if the originalPoster's ._id matches
 the req.user._id
 ---
 $http.delete(baseUrl + "/api/comment/:commentID")
 return deleted comment
 Note:   This is tricky. In a linked list, this can break connection to ALL children. So really,
 you just change comment.isDeleted to true and this will get filtered on the frontend
 to read DELETED. It still exists, but maintaining it preserves the connection to its children.

 agustin - we should also delete the actual comment key value pair, some comments can get really long, no
 sense in bogging up the db with "deleted" content
 */