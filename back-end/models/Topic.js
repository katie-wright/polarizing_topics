const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

const topicSchema = new Schema({
    text: {type: String, require: true, unique: true},
    upVotes: Number,
    downVotes: Number,
    totalVotes: Number,
    include: Boolean,
    user: {type: ObjectId, ref: 'User', required: true}
});

const TopicModel = mongoose.model('Topic', topicSchema);

module.exports = TopicModel;