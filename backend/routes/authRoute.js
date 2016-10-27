/*

Auth

file name: "authRoute"
base route: /auth
purpose: Signing up and loggin in a new user

sub route: /signup
    $http.post(baseUrl + "/auth/signup", { firstName: "John", lastName: "Smith", username: "johnjohn", password: "1234"})
    return user object 

sub route: /login
    $http.post(baseUrl + "/auth/login", { username: "johnjohn", password: "1234" } )
    return user object

*/

var express = require('express');
var authRoute = express.Router();





module.exports = authRoute;