'use strict';

var app = angular.module('MockReddit');

app.config(['$routeProvider', '$mdThemingProvider', function ($routeProvider, $mdThemingProvider) {
    $routeProvider
        .when('/', {
            templateUrl: './templates/main.html',
            controller: 'MainController'
        })
        .when('/newpost', {
            templateUrl: './templates/createPost.html',
            controller: 'NewPostController'
        })
        .when('/messages', {
            templateUrl: './templates/messages.html'
        })
        .when('/newsubforum', {
            templateUrl: './templates/createSubForum.html',
            controller: 'NewSubForumController'
        })
        .when('/post/:id', {
            templateUrl: './templates/singlePost.html',
            controller: 'PostController'
        })
        .when('/search/:keyword', {
            templateUrl: './templates/results.html',
            controller: 'SearchController'
        })
        .when('/sub/:id', {
            templateUrl: './templates/subForumMain.html',
            controller: 'SubController'
        });

    $mdThemingProvider.theme('forms')
        .primaryPalette('blue-grey', {
            'default': '600'
        })
        .accentPalette('blue-grey', {
            'default': '500'
        });

    $mdThemingProvider.theme('cyan')
        .primaryPalette('cyan', {
                'default': '600',
                'hue-1': '100',
                'hue-2': '600',
                'hue-3': 'A100'
            }
        )
        .accentPalette('grey', {
            'default': '300',
            'hue-1': '500',
            'hue-2': '700',
            'hue-3': 'A100'
        })
        .backgroundPalette('blue-grey', {
            'default': '500',
            'hue-1': '100',
            'hue-2': '600',
            'hue-3': 'A100'
        }).dark();

    $mdThemingProvider.theme('blue')
        .primaryPalette('blue-grey')
        .accentPalette('grey', {
            'default': '400'
        });

}]);
