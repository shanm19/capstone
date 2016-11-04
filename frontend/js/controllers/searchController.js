'use strict';

var app = angular.module('MockReddit');

app.controller('SearchController', ['$scope', '$routeParams', 'SearchService', function ($scope, $routeParams, SearchService) {

    (function () {
        SearchService.searchForSub($scope.search.query)
            .then(function (response) {
                $scope.results = response;
            });
    }())
}]);