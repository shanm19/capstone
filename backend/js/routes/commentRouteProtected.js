/*

Comment Protected

file name: "commentRouteProtected"
base route: /api/comment
purpose: Endpoints that can access a user's comments

sub route: /
    $http.get(baseUrl + "/api/comment")
    return array of all the user's comment history
    ---
    $http.post(baseUrl + "/api/comment", { 
        content: "Stupid pun comment for cheap laughs.",
        parentComment: comment._id,
        isPrimaryComment: Boolean
    })
    return comment object
    Note:  This one is highly debatable. Frankly, I don't know how to do nested comments the best way.
            Conceptually, this is my thinking. There are two options (buttons) for submitting comments:
                1. The user submits a comment directly to the post, making isPrimaryComment = true
                2. The user submits a comment as a child of another comment
            Now, the parentComment and isPrimaryComment properties aren't being stored in the collection,
            they are just there for the backend to sort out where the comment goes, and then trims it off
            before being stored.
            If isPrimaryComment === true, then the comment's ._id will be stored in the commentArray for the post.
            If the comment is being added as a child to another comment, you will create and set parentComment: parent._id
            Then, if it works, there is a mongoose deep populate npm package that appears capable of recursively
            retrieving and populating nested objects.
    
    sub route: /:commentID
        $http.put(baseUrl + "/api/comment/:commentID", { 
            editedComment: ""
        })
        return comment object
        Note:   The comment schema now supports an edit history. You will send back the comment,
                find it in the collection, push the current comment to the editHistory array, 
                overwrite the previous comment, and change isEdited to true. This allows the frontend
                to set a visual flag if a comment has been edited so users can check the history against
                the logic of the comment flow. Also, only allow if the originalPoster's ._id matches
                the req.user._id
        ---
        $http.delete(baseUrl + "/api/comment/:commentID")
        return deleted comment
        Note:   This is tricky. In a linked list, this can break connection to ALL children. So really,
                you just change comment.isDeleted to true and this will get filtered on the frontend
                to read DELETED. It still exists, but maintaining it preserves the connection to its children. 
*/