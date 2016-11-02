/* BookReviewSite signup.js */

angular.module('MockReddit.Auth')
    .controller('SignupController', ["$scope", "$timeout", "$location", "$mdDialog", "UserService", function ($scope, $timeout, $location, $mdDialog, UserService) {


        $scope.user = {};
        $scope.invalidForm = false;

        
        $scope.close = function () {
            console.log('hide');
            $mdDialog.hide();
        }

        $scope.signup = function (e) {
            e.preventDefault();
           
        }

    }])