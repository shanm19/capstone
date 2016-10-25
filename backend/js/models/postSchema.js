var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = require('./userSchema').Schema;
var SubredditSchema = require('./subredditSchema').Schema;
var CommentSchema = require('./commentSchema').Schema;

var postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    // in modern vernacular, referred to as OP
    originalPoster: {
        type: Schema.Type.ObjectId,
        ref: 'User',
        required: true
    },
    subreddit: {
        type: Schema.Type.ObjectId,
        ref: 'Subreddit',
        required: true
    },
    // posts can just be images, gifs, or videos, so this isn't required
    siteUrl: String,
    // it's currently unclear how we're hosting images
    // Evan is exploring a 3rd party option, like Imgur
    image: String,
    comments: [{
        type: Schema.Type.ObjectId,
        ref: 'Comment'
    }],
    upVotes: {
        type: Number,
        default: 0
    },
    downVotes: {
        type: Number,
        default: 0
    },
    // this number can optionally just be calculated on the front end
    netVotes: {
        type: Number,
        default: 0
    },
    // optional tags for filtering content, can add more later, I just can't think of any other
    // NSFW means 'Not Safe For Work', which is a common way to say 'You probably shouldn't open this link around other people'
    // SFW means 'Safe For Work', but most posts are generally safe and trusted
    // someone would mark a post as SFW if, by the title, the post appears to be NSFW and you want to ensure it's okay to look at
    tags: [{
        type: String,
        enum: ['nsfw', 'sfw', 'none'],
        default: 'none'
    }]
});

module.exports = mongoose.model('Post', postSchema);