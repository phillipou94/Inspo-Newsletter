var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MusicAppSchema = new Schema({
    name: String,
    user_id:{type:String, default: null},
    app: String,
    access_token: String,
    refresh_token: String,
    expires_in: {type: Number}
}, { timestamps: true },);

// var User = mongoose.model("User", UserSchema);

var MusicApp = mongoose.model('MusicApp', MusicAppSchema);

module.exports = MusicApp;

