'use strict';

var app = angular.module('MockReddit');

app.controller('PostController', ['$scope', '$routeParams', 'PostService', function($scope, $routeParams, PostService) {

    (function getPostComments () {
        PostService.getPostComments($routeParams.id)
        .then(function(response){
            $scope.post = response;
        })
    })();

}]);