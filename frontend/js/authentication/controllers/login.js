/* BookReviewSite login.js */

angular.module('myApp.Auth')
    .controller('LoginController', ["$scope", "$location", "$timeout", "$document", "$uibModal", "$uibModalInstance", "UserService", function ($scope, $location, $timeout, $document, $uibModal, $uibModalInstance, UserService) {
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
                            $uibModalInstance.close({
                            resolve: $location.path('/')
                            })
                            console.log('login ', response);
                        }
                    })
            }
        }
        $scope.dismiss = function () {
            $uibModalInstance.dismiss();
        }
    }])
