/* capstone commentProtected */

var express = require("express");
var Comment = require("../models/comment");
var User = require("../models/userSchema");
var Post = require("../models/post");
var commentRouteProtected = express.Router();
var userRouteProtected = express.Router();


userRouteProtected.route = ("/api/user")
    .get(function(req, res) {

        var user_id = req.user._id;
        // difference between find and findONe and error checking?
        User.findOne(user_id)

            .populate("commentHistory")
            .exec(function(err, userComments) {

                if (err) res.status(500).send(err);
                res.send(userComments);
            })
    });

commentRouteProtected.route = ("/api/comment")

    .post(function(req, res) {

        // Is all the following code correct?
        var newComment = new Comment(req.body);

        newComment.save(newComment, function(err, newComment) {

            if (err) res.status(500).send(err);
            res.send(newComment);

        });

        var post_id = req.post._id;

        if (post_id) {

            Post.findOne(post_id, function (err, post) {
                if (err) res.status(500).send(err);
                else {
                    // Why push here?
                    post.comments.push(newComment._id);
                    post.save();
                }
            })
        }
        else {

            var comment_id = req.comment._id;

            Comment.findOne(comment_id, function (err, comment) {

                if (err) res.status(500).send(err);
                else {

                    comment.childComments.push(comment_id);
                    comment.save();
                }
            })
        }
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
 post._id
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
 */