'use strict';

var app = angular.module('MockReddit');

app.service('PostService', ['Upload', function (Upload) {

    this.createNewTextPost = function (textPostObj) {
        console.log(textPostObj);
        // do stuff then submit call submitNewPost
    };

    this.createNewLinkPost = function (linkPostObj) {
        console.log(linkPostObj);
        // do stuff then submit call submitNewPost
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