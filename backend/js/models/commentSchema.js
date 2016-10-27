var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    originalPoster: {
        type: Schema.Type.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        es_indexed: true
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
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    editHistory: [ String ],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

commentSchema.plugin(mongoosastic);

module.exports = mongoose.model('Comment', commentSchema);