var mongoose = require('mongoose');
//var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;

var subredditSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
        //es_indexed: true
    },
    description: {
        type: String,
        required: true
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
} , { timestamps: true });

//subredditSchema.plugin(mongoosastic);

module.exports = mongoose.model('Subreddit', subredditSchema);