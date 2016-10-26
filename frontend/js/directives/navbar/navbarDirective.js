'use strict';

var app = angular.module('MockReddit');

app.directive('navbar', [function() {
    return {
        templateUrl: './js/directives/navbar/navbar.html'
    }
}]);