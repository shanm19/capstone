/*

Subreddit

file name: "subredditRoute"
base route: /subreddit
purpose: Access subreddit data without being logged in

sub route: /
    $http.get(baseUrl + "/subreddit")
    return an array of all subreddit names, could be used for an autocomplete feature
    ---
    sub route: /search
        $http.get(baseUrl + "/subreddit/search?" + queryString)
        return subreddit object with posts populated
        note:   This is for when a user uses the search bar OR dropdown list of 
        subreddit names to find a specific subreddit by name
    ---
    sub route: /:subredditID
        $http.get(baseUrl + "/subreddit/:subredditID")
        return subreddit object found by ID

*/

var express = require('express');
var subredditRoute = express.Router();





module.exports = subredditRoute;