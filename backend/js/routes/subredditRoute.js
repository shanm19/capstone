/*

/ $http.get(baseUrl + "/subreddit/posts?" + queryString)

*/

/*

Subreddit

file name: "subredditRoute"
base route: /subreddit
purpose: Access subreddit data without being logged in

sub route: /
    $http.get(baseUrl + "/subreddit")
    return an array of all subreddit names
    ---
    sub route: /search
        $http.get(baseUrl + "/subreddit/search?" + queryString)
        return array of searched subreddit titles w/o posts populated
        note:   This is for when a user uses the search bar to find a specific subreddit by name,
                but it should return fuzzy matches (non-exact matches).
                If this is not doable, it'll just return an exact match, and the return type should be a single subreddit object
    ---
    sub route: /:subredditID
        $http.get(baseUrl + "/subreddit/:subredditID")
        return array of current posts, limited to the specific subreddit

*/