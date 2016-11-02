var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    originalPoster: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    childComments: [{
        type: Schema.Types.ObjectId,
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
});


module.exports = mongoose.model('Comment', commentSchema);