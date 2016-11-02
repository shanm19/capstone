'use strict';

var app = angular.module('MockReddit');

app.directive('sideBar', function () {
    return {
        restrict: 'E',
        templateUrl: './js/directives/sideBar/sideBar.html',
        controller: ['$scope', '$mdDialog', "$timeout", 'UserService', function ($scope, $mdDialog, $timeout, UserService) {
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
                        $scope.signup = function () {
                            $scope.duplicate = false;
                            console.log('new user ', $scope.newUser)
                            UserService.signup($scope.newUser)
                                .then(function (response) {
                                    if (response.success === false && response.cause === 'username or email') {
                                        $scope.message = response.message;
                                        $scope.duplicate = true;
                                        $timeout(function () {
                                            $scope.duplicate = false
                                        }, 3000)

                                    } else {
                                        $scope.success = true
                                        UserService.newSignup = response.user;

                                    }
                                })
                        }

                    }]
                })
            };
        }]
    }
});