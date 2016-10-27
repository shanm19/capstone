/*

User Protected

file name: "userRouteProtected"
base route: /api/user
purpose: Endpoints a user can access after logging in for personal information
note: req.user._id will carry the specific user's _id after loggin in, it's added on in the backend with middleware

sub route: /
    $http.get(baseUrl + "/api/user")
    return user object 
    ---
    $http.put(baseUrl + "/api/user", { user Obj with updated info })
     return user object with updated info
    ---
    $http.delete(baseUrl + "/api/user")
    return deleted user obj 

*/