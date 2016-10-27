/* BookReviewSite signup.js */

angular.module('MockReddit.Auth')
    .controller('SignupController', ["$scope", "$timeout", "$location", "$mdDialog", "UserService", function ($scope, $timeout, $location, $mdDialog, UserService) {
        $scope.button = "I'm a button"
        
$scope.showPrompt = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    $mdDialog.show({
        templateUrl: '/js/authentication/templates/signup.html',
        targetEvent: ev,
        clickOutsidetoClose: true 
    })
    .then(function(result) {
      $scope.status =  result.firstName;
    }, function() {
      $scope.status = result.username;
    });
  };



        $scope.user = {};
        $scope.invalidForm = false;
        
        $scope.signup = function (e) {
            e.preventDefault();
            $scope.duplicate = false;
            if ($scope.signupForm.$invalid) {
                $scope.invalidForm = true;
                $timeout(function () {
                    $scope.invalidForm = false;
                }, 3500);
                return;
            } else {
                UserService.signup($scope.user)
                    .then(function (response) {
                        if (response.success === false  && response.message === 'username or email already in use') {
                            $scope.cause = response.cause;
                            $scope.duplicate = true;
                        } else {
                            $scope.success = true
                            UserService.newSignin = true;
                            $timeout(function () {
                                $location.path('/login')
                            }, 2000);
                        }
                    })
            }
        }

        $scope.oauthSignup = function(provider) {
            $location.path('/auth/' + provider)
        }

        

        
    }])