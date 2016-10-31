angular.module('MockReddit.Auth')
.controller('ProfileController', ["$scope", "UserService", "TokenService", function($scope, UserService, TokenService) {


    $scope.user = UserService.user;
    $scope.loadUser = function(){
        UserService.loadUser()
        .then(function(response){
            console.log(response)
            $scope.user = response;
        })
    }()

}])