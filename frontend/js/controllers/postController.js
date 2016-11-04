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
        .then(function(){
            $scope.post.comments.unshift($scope.newComment.content)
            $scope.newComment.content = ""
        })
    }

}]);