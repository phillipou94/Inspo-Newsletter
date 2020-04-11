var Spotify = require('../services/spotify_service.js');
var MusicApp = require('../models/MusicApp.js');

const DEV_REDIRECT_URI = "http://localhost:3000/callback";


var MusicAppManager = (function() {
    var that = {};

    that.start_authentication = function(req, res) {
        var app = req.params.app;
        if (app == "spotify") {
            // create music app object
            SpotifyManager.start_authentication().then(response => {
                console.log("Manager: "+response);
                return res.status(200).json({
                    success: true,
                    redirect_uri: response.redirect_uri
                })
            }).catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Error Starting Authetnication',
                })
            });
        }

    }

    that.register_music_app = function(app, auth_code) {
        if (app == "spotify") {
            var redirect_uri = DEV_REDIRECT_URI;
            return new Promise (
                (resolve, reject) => {
                    SpotifyManager.get_authentication_tokens(auth_code, redirect_uri)
                    .then(response => {
                        var credentials = response.credentials;
                        var music_app = new MusicApp({

                            app:app,
                            access_token:credentials.access_token,
                            refresh_token:credentials.refresh_token,
                            expires_in:credentials.expires_in
                        });

                        console.log("music app:"+music_app);
                        music_app.save().then(doc => {
                            
                            console.log(doc)
                        })
                        .catch(err => {
                            console.error(err)
                        });



        
                    }).catch(error => {
                        reject({error:error});
                    });
            });
            
        }
    }

    return that;
})();

var SpotifyManager = (function() {
    var that = {}
    
    that.start_authentication = function() {
        var spotify_auth_promise = Spotify.AuthService.request_authorization(Spotify.client_id, "code", DEV_REDIRECT_URI, {})
        return spotify_auth_promise;

    }

    that.get_authentication_tokens = function(auth_code, redirect_uri) {
        return Spotify.AuthService.get_tokens(auth_code,redirect_uri);
    }

    return that;
})();

module.exports = MusicAppManager;