'use strict';

var app = angular.module('MockReddit');

app.service('SubForumService', ['$http', function ($http) {
    this.createNewSubForum = function (subForumObj) {
        return $http.post('/api/subreddit', subForumObj)
            .then(function (response) {
                console.log(response.data);
                return response.data;
            });
    };

    this.getSubForum = function (id) {
        return $http.get('/subreddit/' + id)
            .then(function (response) {
                return response.data;
            })
    }
}]);