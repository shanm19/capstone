var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    // users can moderate subreddits to control quality and enforce rules
    moderating: [{
        type: Schema.Type.ObjectId,
        ref: 'Subreddit'
    }],
    // the list of subreddits to call and populate personal feed
    subscribedSubreddits: [{
        type: Schema.Type.ObjectId,
        ref: 'Subreddit' // default subreddits could be added
    }],
    postHistory: [{
        type: Schema.Type.ObjectId,
        ref: 'Post'
    }],
    commentHistory: [{
        type: Schema.Type.ObjectId,
        ref: 'Comment'
    }],
    // optionally, the user can have a list of content they no longer want to see to prevent a stale page
    // perhaps the user can choose to reset this array if they want to undo what they've dismissed
    dismissedContent: [{
        post: {
            type: Schema.Type.ObjectId,
            ref: 'Post'
        },
        timestamps: true // NOTE: I do not know if this works
    }],
    // this tracks what the user has already viewed to visually track history
    visitedContent: [{
        type: Schema.Type.ObjectId,
        ref: 'Post'
    }],
    // shadow banning means the user can continue commenting on posts and comments, 
    // but those comments are actually invisible to other users and get filtered out
    // they are banned by entire subreddits at a time
    // optionally, we could just prevent them from commenting altogether, this method just softens the blow
    // because they aren't necessarily aware they are no longer contributing
    shadowBans: [{
        type: Schema.Type.ObjectId,
        ref: 'Subreddit'
    }],
    // Admins can block users from commenting and posting for being dillweeds
    isBlocked: {
        type: Boolean,
        default: false
    },
    // Karma is the net amount of upvotes and downvotes the user has from posts or comments
    postKarma: {
        type: Number,
        default: 0
    },
    commentKarma: {
        type: Number,
        default: 0
    }

});


module.exports = mongoose.model('User', userSchema);