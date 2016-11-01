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
        PostService.createNewTextPost(newLinkPost);
        $scope.newLinkPost = {};
    };
}]);