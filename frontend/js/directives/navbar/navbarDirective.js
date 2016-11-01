'use strict';

var app = angular.module('MockReddit');

app.directive('navbar', [function () {
    return {
        restrict: 'E',
        templateUrl: './js/directives/navbar/navbar.html',
        controller: 'AuthController'
    }
}]);