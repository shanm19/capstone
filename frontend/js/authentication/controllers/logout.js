/* BookReviewSite logout.js */

angular.module('MockReddit.Auth')
.controller('LogoutController', ["$scope", "UserService", "TokenService", function($scope, UserService, TokenService) {
    $scope.user = UserService.user;
    UserService.user = {};
    TokenService.removeToken();

}])