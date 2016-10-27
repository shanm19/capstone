/*

Subreddit Protected

file name: "subredditRouteProtected"
base route: /api/subreddit
purpose: Endpoints that can access subreddits only by a logged in user

sub route: /
    $http.get(baseUrl + "/api/subreddit")
    return array of current posts, limited to the specific subreddits to which the user is subscribed
    note:   The logged in user will be passed on req.user, which will contain an array of 
            subscribed subreddit _id's. Use this information to query against the Subreddit collection,
            along with the timestamp parameter.
    
*/

var express = require('express');
var subredditRouteProtected = express.Router();





module.exports = subredditRouteProtected;