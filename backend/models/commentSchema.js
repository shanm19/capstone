var mongoose = require('mongoose');
//var mongoosastic = require('mongoosastic');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
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
        //es_indexed: true
    },
    comments: [{
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
}, { timestamps: true });

//commentSchema.plugin(mongoosastic);
commentSchema.plugin(deepPopulate);

module.exports = mongoose.model('Comment', commentSchema);