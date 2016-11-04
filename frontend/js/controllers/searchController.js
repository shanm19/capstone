'use strict';

var app = angular.module('MockReddit');

app.controller('SearchController', ['$scope', '$routeParams', 'SearchService', function ($scope, $routeParams, SearchService) {

    (function () {
        var keyword = $scope.keyword = $routeParams.keyword;
        SearchService.searchForSub(keyword)
            .then(function (response) {
                $scope.results = response;
            });
    }());
}]);