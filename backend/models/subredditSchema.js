var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var subredditSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subscribers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    // in this site's current state, rules aren't enforceable
    rules: [String],
    // also not available in this current state, moderators would enforce the rules and ensure post quality
    moderators: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});


module.exports = mongoose.model('Subreddit', subredditSchema);