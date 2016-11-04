/* BookReviewSite auth.js */

var app = angular.module('MockReddit.Auth', ['ngRoute', 'ngAnimate']);

// only the Logout has a route with a view because signup and login are handled in pop-up modals
app.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when('/auth/profile', {
            templateUrl: 'js/authentication/templates/profile.html',
            controller: 'ProfileController'
        })
}])

// Controller for the login/signup navbar
app.controller('AuthController', ["$scope", "UserService", function ($scope, UserService) {

    $scope.facebookLogin = function () {
        UserService.facebook()
            .then(function (response) {
                console.log('controller response ', response);
            })
    }

    $scope.googleLogin = function () {
        UserService.google()
            .then(function (response) {
                console.log('controller response ', response);
            })
    }

    $scope.userService = UserService;
    $scope.permission = UserService.isAuthenticated();
    $scope.$on('authenticate', function () {
        console.log('auth')
        $scope.permission = UserService.isAuthenticated();
    });
    // Retrieve the logged-in user's' information after a page reload using the Authentication Token
    // $scope.getUserFromToken = function () {
    //     if (UserService.isAuthenticated()) {
    //         UserService.getUserFromToken()
    //             .then(function (response) {
    //                 UserService.user = response;
    //             });
    //     }
    // }();

}]);

// Set, Get and Remove Token for user authentication
app.service('TokenService', function () {
    var userToken = 'token';
    this.setToken = function (token) {
        localStorage[userToken] = token;
    }

    this.getToken = function () {
        // console.log(userToken)
        return localStorage[userToken];
    }

    this.removeToken = function () {
        localStorage.removeItem(userToken);
    }
});

// Service to handle user signup, login, and logout
app.service('UserService', ["$rootScope", "$http", "$location", "TokenService", function ($rootScope, $http, $location, TokenService) {
    var self = this;
    self.user = {};

    /**
     * Broadcast event to scopes that are listening
     * for it. Updates authentication status.
     */
    function updateAuthentication() {
        $rootScope.$broadcast('authenticate');
    }

///////////////////////////////////////
///             OAUTH               ///
///////////////////////////////////////

    // SIGNUP/LOGIN WITH FACEBOOK
    this.facebook = function () {
        return $http.get('/auth/facebook')
            .then(function (response) {
                console.log('Userservice facebook res ', response)
                this.user = response.data
                return response.data;
            }, function (error) {
                console.log('Userservice facebook error ', error);
            })
    }

    // SIGNUP/LOGIN WITH GOOGLE - this is still developmental 
    this.google = function () {
        return $http.get('/auth/google')
            .then(function (response) {
                console.log('Userservice google res ', response)
                this.user = response.data
                return response.data;
            }, function (error) {
                console.log('Userservice google error ', error);
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
                updateAuthentication();
                return (response)
            }, function (error) {
                console.log('UserService login error ', error);
                return error;
            })
    }

    this.logout = function () {
        TokenService.removeToken();
        $location.path('/');
        updateAuthentication();
    };

    this.isAuthenticated = function () {
        return !!TokenService.getToken();
    };

    // this.getUserFromToken = function () {
    //     if (this.user.email) {
    //         return this.user
    //     } else if (this.isAuthenticated()) {
    //         return $http.post('/auth/verifyuser', {
    //                 token: TokenService.getToken()
    //             })
    //             .then(function (response) {
    //                 return response.data
    //             }, function (error) {
    //                 console.log('Error verifying loggedin user: ', error)
    //                 $location.path('/');
    //             })
    //     } else {
    //         return 'user not logged in';
    //     }
    // }

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
                $location.path('/');
            }
            return $q.reject(response);
        }

    }
}]);

// add the AuthInterceptor to the httpProvider settings. 
app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
});