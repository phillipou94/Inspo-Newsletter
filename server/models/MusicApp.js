var mongoose = require('mongoose');


var MusicAppSchema = mongoose.Schema({
    name: String,
    user_id:{type:String, default: null},
    app: String,
    access_token: String,
    refresh_token: String,
    expires_in: {type: Number}

});

var MusicAppModel = mongoose.model("MusicApp", MusicAppSchema);

var MusicApp = (MusicAppModel) => {
    that = {}

    that.create = function(app, access_token, refresh_token, expires_in) {
        var music_app = MusicAppModel();
        music_app.app = app;
        music_app.access_token = access_token;
        music_app.refresh_token = refresh_token;
        music_app.expires_in = expires_in;

        return new Promise (
            (resolve, reject) => {
                music_app.save(function(err, music_app) {
                    if (err) reject(err);
                    resolve(music_app);
                });
            }
        );


    }
};

module.exports = MusicApp;
