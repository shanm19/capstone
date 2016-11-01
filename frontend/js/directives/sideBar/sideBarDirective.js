'use strict';

var app = angular.module('MockReddit');

app.directive('sideBar', function () {
    return {
        restrict: 'E',
        templateUrl: './js/directives/sideBar/sideBar.html',
        controller: ['$scope', '$mdDialog', 'UserService', function ($scope, $mdDialog, UserService) {
            $scope.showAuthForm = function ($event) {
                $mdDialog.show({
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    templateUrl: 'templates/loginAndSignUp.html',
                    scope: $scope
                })
            };
            $scope.userService = UserService;

            $scope.signup = function () {
                UserService.signup($scope.newUser)
                    .then(function (response) {
                        console.log(response);
                        $scope.close();
                    });
            };

            $scope.login = function () {
                UserService.login($scope.user)
                    .then(function (response) {
                        console.log(response);
                        $scope.close();
                    })
            };

            $scope.close = function () {
                $mdDialog.hide();
            }
        }]
    }
});