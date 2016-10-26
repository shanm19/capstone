'use strict';

var app = angular.module('MockReddit');

app.directive('sideBar', function() {
    return {
        restrict: 'E',
        templateUrl: './js/directives/sideBar/sideBar.html',
        transclude: true
    }
});