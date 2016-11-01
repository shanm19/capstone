'use strict';

var app = angular.module('MockReddit');

app.filter('when', [function () {
    return function(time) {
        var now = moment();
        var then = moment(time);
        return then.from(now);
    }
}]);