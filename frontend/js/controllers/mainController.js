'use strict';

var app = angular.module('MockReddit');

app.controller('MainController', ['$scope', 'PostService', function ($scope, PostService) {

    
    
    function getPosts() {
        PostService.getPosts()
            .then(function (response) {
                $scope.posts = response;
                console.log($scope.posts);
            });
    }
    getPosts();


    $scope.FBlogin = function () {
        UserService.FBlogin()
            .then(function (response) {
                console.log('Maincontroller ', response);
                $scope.user = response;
            })
    };

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
}]);
