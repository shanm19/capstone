/*

Post

file name: "postRoute"
base route: /post
purpose: Endpoints that can be accessed without being logged in to fill the front page

sub route: /
    $http.get(baseUrl + "/post")
    return array of current posts
    note:   This will need to be more robust than it seems.
            The GET should be able to query the Post collection limited by it's timestamp.
            Optionally, it can return the information sorted by a default of net votes, but the user will have several 
            options for sorting the return data, so a lot of that sorting can be done front end after the initial query.
    ---
    sub route: /search
        $http.get(baseUrl + "/post/search?" + queryString)
        return array of queried searches
        note:   This is for when a user uses the search bar to find a post by N parameters
        ---
        $http.post(baseUrl + "/post/search/", { queryObj })
        return array of queried searches
        note:   This is an optional way to search that allows you to attach a req.body if the coder desires.

*/