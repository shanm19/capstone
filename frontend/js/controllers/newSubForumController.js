'use strict';

var app = angular.module('MockReddit');

app.controller('NewSubForumController', ['$scope', 'SubForumService', function ($scope, SubForumService) {
    $scope.createNewSubForum = function () {
        SubForumService.createNewSubForum($scope.newSubForum)
            .then(function (response) {
                console.log(response);
            })
    }
}]);