'use strict';

var app = angular.module('MockReddit');

app.config(['$routeProvider', '$mdThemingProvider', function ($routeProvider, $mdThemingProvider) {
    $routeProvider
        .when('/', {
            templateUrl: './templates/main.html',
            controller: 'MainController'
        });

    $mdThemingProvider.theme('cyan')
        .primaryPalette('cyan', {
            'default': '600',
            'hue-1': '100',
            'hue-2': '600',
            'hue-3': 'A100'
        })
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
        })
        .dark();

    $mdThemingProvider.theme('blue')
        .primaryPalette('blue-grey')
        .accentPalette('grey');

}]);
