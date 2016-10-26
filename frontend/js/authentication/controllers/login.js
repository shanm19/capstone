/* BookReviewSite login.js */

angular.module('MockReddit.Auth')
    .controller('LoginController', ["$scope", "$location", "$timeout", "$document", "UserService", "$mdDialog", function ($scope, $location, $timeout, $document, UserService, $mdDialog) {
        $scope.user = {};
        $scope.user.email = UserService.user.email;
        $scope.invalidForm = false;
        
        $scope.login = function (e) {
            e.preventDefault();
            if ($scope.loginForm.$invalid) {
                $scope.invalidForm = true;
                $timeout(function () {
                    $scope.invalidForm = false;
                }, 2500);
                return;
            } else {
                UserService.login($scope.user)
                    .then(function (response) {
                        if (response.status === 401) {
                            $scope.message = response.data.message;
                            $scope.loginError = true;
                            $timeout(function () {
                                $scope.loginError = false;
                                $scope.user.password = '';
                                if (response.data.cause === 'username') {
                                    var el = $document.find('input');
                                    el[0].focus();
                                }
                            }, 3000);
                        } else {
                             $location.path('/')
                            }
                            console.log('login ', response);

                    })
            }
        }

    }])
