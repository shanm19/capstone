var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = require('./userSchema').Schema;
var SubredditSchema = require('./subredditSchema').Schema;
var CommentSchema = require('./commentSchema').Schema;

var commentSchema = new Schema({
    originalPoster: {
        type: Schema.Type.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    childComments: [{
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
    netVotes: {
        type: Number,
        default: 0
    }
});


module.exports = mongoose.model('Comment', commentSchema);