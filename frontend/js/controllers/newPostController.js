'use strict';

var app = angular.module('MockReddit');

app.controller('NewPostController', ['$scope', 'PostService', function ($scope, PostService) {

    $scope.submitTextPost = function () {
        PostService.createNewTextPost($scope.newTextPost);
        $scope.newTextPost = {};
    };

    $scope.submitLinkPost = function () {
        PostService.createNewTextPost($scope.newLinkPost);
        $scope.newLinkPost = {};
    };
}]);