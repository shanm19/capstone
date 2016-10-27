/*

Post Protected

file name: "postRouteProtected"
base route: /api/post
purpose: Endpoints a user can access after logging in for posting
note: req.user._id will carry the specific user's _id after loggin in, it's added on in the backend with middleware

sub route: /
    $http.get(baseUrl + "/api/post");
    return array of all personal posts 
    ---
    $http.post(baseUrl + "/api/post", { 
        title: "Bananas are bananas",
        subreddit: currentSubreddit._id,
        siteUrl: "http://www.something.com",
        image: "asdfaewetw123sdfq35",
        tags: "nsfw"
     })
     return user's new post object
     ---
     sub route: /:postID
        $http.put(baseUrl + "/api/post/:postID", { updated post Obj })
        return user's updated post object in full
        ---
        $http.delete(baseUrl + "/api/post/:postID")
        return user's deleted post

*/