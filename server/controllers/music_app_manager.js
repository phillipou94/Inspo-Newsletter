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

    that.register_music_app = function(req, res) {
        var app = req.body.app;
        var auth_code = req.body.auth_code;
        var user_id = req.body.user_id;
        if (app == "spotify") {
            var redirect_uri = DEV_REDIRECT_URI;
            SpotifyManager.get_authentication_tokens(auth_code, redirect_uri)
            .then(response => {
                var credentials = response.credentials;
                var music_app = new MusicApp({
                    user_id:user_id,
                    app:app,
                    access_token:credentials.access_token,
                    refresh_token:credentials.refresh_token,
                    expires_in:credentials.expires_in
                });

                music_app.save().then(music_app => {
                    console.log("resgister_music_app");
                    console.log(response);
                    return res.status(200).json({
                        success: true,
                        music_app: music_app
                    })
                })
                .catch(error => {
                    return res.status(404).json({
                        error,
                        message: 'could not create music object',
                    })
                });




            }).catch(error => {
                return res.status(404).json({
                    error,
                    message: 'could not retrieve authentication tokens',
                })
            });

            
        }
    }

    that.refresh_token = function(req, res) {
        var music_app_id = req.body.music_app_id;
        MusicApp.findOne({ _id: music_app_id }, (err, music_app) => {
            if (err) {
                return res.status(404).json({
                    err,
                    message: 'MusicApp not found!',
                })
            }
            if (music_app.app == "spotify") {
                var refresh_token = music_app.refresh_token;
                SpotifyManager.refresh_token(refresh_token).then(response => {
                    //update access token and expires in
                    var access_token = response.body.access_token;
                    var expires_in = response.body.expires_in;
                    
                    music_app.access_token = access_token;
                    music_app.expires_in = expires_in;
                    music_app.save().then(() => {
                        return res.status(200).json({
                            success: true,
                            music_app: music_app,
                            message: 'mMsic app updated with new token!',
                        })
                    })
                    .catch(error => {
                        return res.status(404).json({
                            error,
                            message: 'Music app not updated!',
                        })
                    })


                }).catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Could not refresh token',
                })
            });
                
            }
        })
        
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

    that.refresh_token = function(refresh_token) {
        return Spotify.AuthService.refresh_token(refresh_token)
    }



    var needs_token_refresh = function(date_updated,expires_in) {
        var now = new Date().now();
        var expiration_date = moment(date_updated).add(expires_in, 'seconds');
        var needs_token_refresh = moment(now).diff(expiration_date) < 0;
        console.log("needs token refresh?:"+needs_token_refresh);
        return needs_token_refresh;
    }

    return that;
})();

module.exports = MusicAppManager;