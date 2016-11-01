'use strict';

var app = angular.module('MockReddit');

app.directive('sideBar', function () {
    return {
        restrict: 'E',
        templateUrl: './js/directives/sideBar/sideBar.html',
        controller: ['$scope', '$mdDialog', function ($scope, $mdDialog) {
            $scope.showAuthForm = function ($event) {
                $mdDialog.show({
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    templateUrl: 'templates/loginAndSignUp.html',
                    controller: ['$scope', 'UserService', function ($scope, UserService) {
                        $scope.userService = UserService;
                        $scope.close = function () {
                            $mdDialog.hide();
                        }
                    }]
                })
            };
        }]
    }
});