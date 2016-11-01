/* BookReviewSite login.js */

angular.module('MockReddit.Auth')
    .controller('LoginController', ["$scope", "$location", "$timeout", "$document", "UserService", "$mdDialog", function ($scope, $location, $timeout, $document, UserService, $mdDialog) {
            $scope.user = {};

            $scope.login = function (e) {
                console.log('logging in ', $scope.user)
                e.preventDefault();
                UserService.login($scope.user)
                    .then(function (response) {
                        if (response.status === 401 && response.statusText === 'Unauthorized') {
                            $scope.message = response.data.message;
                            $scope.loginError = true;
                            $timeout(function () {
                                $scope.loginError = false;
                            }, 3000);
                        } 
                        console.log('login ', response);

                    })
            
        }

    }])