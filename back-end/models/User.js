const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    hash: {type: String}
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;