'use strict';

var app = angular.module('MockReddit');

app.controller('NewPostController', ['$scope', 'PostService', function ($scope, PostService) {

    $scope.submitTextPost = function () {
        var newTextPost = $scope.newTextPost;
        newTextPost.type = 'text';
        PostService.createNewTextPost(newTextPost);
        $scope.newTextPost = {};
    };

    $scope.submitLinkPost = function () {
        var newLinkPost = $scope.newLinkPost;
        newLinkPost.type = 'link';
        PostService.createNewLinkPost(newLinkPost);
        $scope.newLinkPost = {};
    };

    PostService.getSubForumList()
        .then(function(response) {
            $scope.subForums = response;
            console.log($scope.subForums)
        });

    $scope.show = function(item) {
        console.log(item)
    };
}]);