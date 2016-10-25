var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = require('./userSchema').Schema;
var PostSchema = require('./postSchema').Schema;

var subredditSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    posts: [{
        type: Schema.Type.ObjectId,
        ref: 'Post'
    }],
    creator: {
        type: Schema.Type.ObjectId,
        ref: 'User',
        required: true
    },
    subscribers: [{
        type: Schema.Type.ObjectId,
        ref: 'User'
    }],
    // in this site's current state, rules aren't enforceable
    rules: [String],
    // also not available in this current state, moderators would enforce the rules and ensure post quality
    moderators: [{
        type: Schema.Type.ObjectId,
        ref: 'User'
    }]
});


module.exports = mongoose.model('Subreddit', subredditSchema);