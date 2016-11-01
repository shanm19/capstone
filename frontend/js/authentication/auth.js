/* BookReviewSite auth.js */

var app = angular.module('MockReddit.Auth', ['ngRoute', 'ngAnimate']);

// only the Logout has a route with a view because signup and login are handled in pop-up modals
app.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when('/logout', {
            templateUrl: 'js/authentication/templates/logout.html',
            controller: 'LogoutController'
        })
        .when('/auth/profile', {
            templateUrl: 'js/authentication/templates/profile.html',
            controller: 'ProfileController'
        })
}])

// Controller for the login/signup navbar
app.controller('AuthController', ["$scope", "$mdDialog", "UserService", function ($scope, $mdDialog, UserService) {
    $scope.userService = UserService;

    


    // Retrieve the logged-in user's' information after a page reload using the Authentication Token
    $scope.getUserFromToken = function () {
        if (UserService.isAuthenticated()) {
            UserService.getUserFromToken()
                .then(function (response) {
                    UserService.user = response
                });
        }
    }();

}]);

// Set, Get and Remove Token for user authentication
app.service('TokenService', function () {
    var userToken = 'token';
    this.setToken = function (token) {
        localStorage[userToken] = token;
    }

    this.getToken = function () {
        return localStorage[userToken];
    }

    this.removeToken = function () {
        localStorage.removeItem(userToken);
    }
});

// Service to handle user signup, login, and logout
app.service('UserService', ["$http", "$location", "TokenService", function ($http, $location, TokenService) {
    var self = this;
    self.user = {};
    self.newSignin = null;

    // signup/login with Facebook
    this.FBlogin = function(){
        return $http.get('/auth/facebook')
        .then(function(response){
            console.log('Userservice facebook res ', response)
            this.user = response.data
            return response.data;
        }, function(error){
            console.log('Userservice facebook error ', error);
        })
    }

    
 // signup with local auth   
    this.signup = function (userObj) {
        return $http.post('/auth/signup', userObj)
            .then(function (response) {
                return (response.data);
            }, function (error) {
                console.log('UserService signup error ', error);
            });
    }

    this.login = function (userObj) {
        return $http.post('/auth/login', userObj)
            .then(function (response) {
                TokenService.setToken(response.data.token);
                self.user = response.data.user;
                return (response)
            }, function (error) {
                console.log('UserService login error ', error);
                return error
            })
    }

    this.logout = function () {
        TokenService.removeToken();
        $location.path('/logout');
    }

    this.isAuthenticated = function () {
        return !!TokenService.getToken();
    }

    this.getUserFromToken = function () {
        if (this.user.email) {
            return this.user
        } else if (this.isAuthenticated()) {
            return $http.post('/auth/verifyuser', {
                    token: TokenService.getToken()
                })
                .then(function (response) {
                    return response.data
                }, function (error) {
                    console.log('Error verifying loggedin user: ', error)
                    $location.path('/');
                })
        } else {
            return 'user not logged in';
        }
    }

}]);

// interceptor to add the user authentication token to all CRUD methods
app.factory("AuthInterceptor", ["$q", "$location", "TokenService", function ($q, $location, TokenService) {
    return {
        request: function (config) {
            var token = TokenService.getToken();
            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = "Bearer " + token;
            }
            return config;
        },
        responseError: function (response) {
            if (response.status === 401) {
                TokenService.removeToken();
                $location.path('/login');
            }
            return $q.reject(response);
        }

    }
}]);

// add the AuthInterceptor to the httpProvider settings. 
app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
});