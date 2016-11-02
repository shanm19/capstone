var mongoose = require('mongoose');
//var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');


var userSchema = new Schema({
    firstName: {
        type: String
        // required: true
    },
    lastName: {
        type: String
        // required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
        //es_indexed: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    facebookId: String,
    facebook: {
        accessToken: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    // users can moderate subreddits to control quality and enforce rules
    moderating: [{
        type: Schema.Types.ObjectId,
        ref: 'Subreddit'
    }],
    // the list of subreddits to call and populate personal feed
    subscribedSubreddits: [{
        type: Schema.Types.ObjectId,
        ref: 'Subreddit' // default subreddits could be added
    }],
    postHistory: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    commentHistory: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    // optionally, the user can have a list of content they no longer want to see to prevent a stale page
    // perhaps the user can choose to reset this array if they want to undo what they've dismissed
    dismissedContent: [{
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
        // timestamps: true NOTE: I do not know if this works
    }],
    // this tracks what the user has already viewed to visually track history
    visitedContent: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    // shadow banning means the user can continue commenting on posts and comments, 
    // but those comments are actually invisible to other users and get filtered out
    // they are banned by entire subreddits at a time
    // optionally, we could just prevent them from commenting altogether, this method just softens the blow
    // because they aren't necessarily aware they are no longer contributing
    shadowBans: [{
        type: Schema.Types.ObjectId,
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

} , { timestamps: true });

//userSchema.plugin(mongoosastic);

userSchema.pre("save", function(next){
    var user = this;
    if(!user.isModified('password')) return next();
    bcrypt.hash(user.password, 10, function(err, hash){
        if(err) return next(err);
        user.password = hash;
        next();
    })
})

userSchema.methods.checkPassword = function(passwordAttempt, callback){
    bcrypt.compare(passwordAttempt, this.password, function(err, isMatch){
        if(err) return callback(err);
        callback(null, isMatch);
    });
}

userSchema.methods.withoutPassword = function(){
    var user = this.toObject();
    delete user.password;
    return user;
}

module.exports = mongoose.model('User', userSchema);