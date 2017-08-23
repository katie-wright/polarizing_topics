const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

const gameSchema = new Schema({
    name: {type: String, required: true, unique: true},
    topics: [{type: ObjectId, ref: 'Topic', required: true}],
    players: Number,
    connections: Number,
    votes: {
        total: Number,
        upVotes: Number,
        downVotes: Number
    },
    index: Number,
    status: String,
    users: [{type: ObjectId, ref: 'User'}]
});

const GameModel = mongoose.model('Game', gameSchema);

module.exports = {model: GameModel,
                 schema: gameSchema};