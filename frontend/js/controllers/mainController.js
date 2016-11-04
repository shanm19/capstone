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
    

    /// used temporarily during development
    (function getSubforumList() {
        PostService.getSubForumList()
        .then(function(response){
            $scope.subforumList = response
        })
    })();

    /// end temproary dev function

}]);