'use strict';

var app = angular.module('MockReddit');

app.service('PostService', ['$http', 'Upload', function ($http, Upload) {

    this.getPosts = function () {
        return $http.get('/post')
            .then(function (response) {
                return response.data;
            }, function (err) {
                console.log("Error could not get posts:", err.status);
            });
    };

    this.getSubForumList = function () {
        return $http.get('/subreddit')
            .then(function (response) {
                console.log(response.data);
                return response.data;
            })
    };

    this.createNewTextPost = function (textPostObj) {
        console.log(textPostObj);
        return $http.post('/api/post', textPostObj)
            .then(function (response) {
                console.log(response.data);
                return response.data;
            })
    };

    this.createNewLinkPost = function (linkPostObj) {
        if (linkPostObj.image) {
            Upload.upload({
                url: '/api/post',
                data: linkPostObj
            }).then(function (response) {
                console.log(response)
                return response.data
            }, function (response) {
                console.log('Error status: ' + response.status);
            }, function (evt) {
                // var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            })
        } else {
            return $http.post('/api/post', linkPostObj)
                .then(function (response) {
                    console.log(response.data);
                    return response.data;
                })
        }
    };

    this.submitNewPost = function (newPost, url) {
        Upload.upload({
            url: url,
            data: newPost
        }).then(function (response) {
            console.log('Success ' + response.config.data.file.name + 'uploaded. Response: ' + response.data);
            return response.data;
        }, function (err) {
            console.log('Error status: ' + err.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    }
}]);