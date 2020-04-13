var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
    name: String,
    email: String,
    default_music_app: String,
    music_app_id: String,
    created_at: Date,
    updated_at: Date
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
