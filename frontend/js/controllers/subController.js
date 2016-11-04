'use strict';

var app = angular.module('MockReddit');

app.controller('SubController', ['$scope','$routeParams', 'SubForumService', function ($scope, $routeParams, SubForumService) {
    SubForumService.getSubForum($routeParams.id)
        .then(function(response) {
            $scope.sub = response;
            console.log(response)
        })
}]);