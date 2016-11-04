'use strict';

var app = angular.module('MockReddit');

app.controller('PostController', ['$scope', '$routeParams', 'PostService', 'UserService', function($scope, $routeParams, PostService, UserService) {

// test for user login to show or hide applicable features
$scope.isAuthenticated = UserService.isAuthenticated;

// get all comments for the post with the id passed as a url parameter
    (function getPostComments () {
        PostService.getPostComments($routeParams.id)
        .then(function(response){
            $scope.post = response;
        })
    })();

var test = function(){
    console.log('hello world from test function');
}

// Save a new comment associated with an existing Postsend
// Pass an object to PostService 
// that contains the comment text and id of the parent Post as postID
    $scope.submitComment = function(){
        PostService.addCommentToPost($scope.newComment, $scope.post._id)
        .then(function(response){
            console.log('adding comment ')
            $scope.post = response;
            $scope.newComment.content = ""
        })
    }

    $scope.addPostVote = function(post, direction) {

        if (direction === "up") {

            post.netVotes++;
            post.upVotes++;
        }
        else {

            post.netVotes--;
            post.downVotes++;
        }
        PostService.updatePost(post);
    };

    $scope.addCommentVote = function(comment, direction) {

        if (direction === 'up') {

            comment.netVotes++;
            comment.upVotes++;
        }
        else {

            comment.netVotes--;
            comment.downVotes++;
        }
        PostService.updateComment(comment);
    };

}]);