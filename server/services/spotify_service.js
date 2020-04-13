var buildUrl = require('build-url');
var Client = require('node-rest-client').Client;
var request = new Client();
var Artist = require('../models/Artist.js');
var Track = require('../models/Track.js');

const SPOTIFY_CLIENT_ID = "87e249ddf5a64a7480cb60b65f01a4ac";
const SPOTIFY_CLIENT_SECRET = "fc79e36a7ebd4309b4145561b564f61a";



var Spotify = (function() {

    var that = {};
    that.client_id = SPOTIFY_CLIENT_ID;
    that.client_secret = SPOTIFY_CLIENT_SECRET;

    var AuthService = {};
    AuthService.request_authorization = function(client_id, response_type, redirect_uri, options = { state: "", scope: "" }) {
        var state = options.state;
        var scope = options.scope;
        var uri = buildUrl('https://accounts.spotify.com', {
            path: 'authorize',
            queryParams: {
                client_id: client_id,
                response_type: response_type,
                redirect_uri: redirect_uri,
                state: state,
                scope: scope
            }
        });

        return new Promise (
            (resolve, reject) => {
                if (uri) {
                    resolve({redirect_uri:uri});
                } else {
                    reject({error: "could not return uri"});
                }
                
            }
        );
    }

    AuthService.get_tokens = function(authorization_code, redirect_uri) {
        var uri = buildUrl('https://accounts.spotify.com', {
            path: 'api/token'
        });
        var body = {
            grant_type: "authorization_code",
            code: authorization_code,
            redirect_uri:redirect_uri,
            client_id:that.client_id,
            client_secret:that.client_secret
        }

        var args = {
            data: body,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        };

        console.log(args);

        return new Promise (
            (resolve, reject) => {
                request.post(uri, args, function(response) {
                    // parsed response body as js object
                    if (response.error || response.error_description) {
                        console.log("error: "+response.error_description)
                        reject({error: response.error_description})
                    }
                    var credentials = {
                        access_token : response.access_token,
                        refresh_token: response.refresh_token,
                        expires_in: response.expires_in
                    }
                    resolve({credentials:credentials})
                });

            }
        )
    }

    AuthService.refresh_token = function(refresh_token) {
        var uri = buildUrl('https://accounts.spotify.com', {
            path: 'api/token'
        });
        
        var body = {
            grant_type: "refresh_token",
            refresh_token: refresh_token,
            client_id: that.client_id,
            client_secret: that.client_secret
        }

        var args = {
            data: body,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        };

        return new Promise (
            (resolve, reject) => {
                request.post(uri, args, function(response) {
                    // parsed response body as js object
                    if (response.error || response.error_description) {
                        console.log("error: "+response.error_description)
                        reject({error: response.error_description})
                    }
                    var credentials = {
                        access_token : response.access_token,
                        expires_in: response.expires_in
                    }
                    console.log("resolving!!!");
                    console.log(credentials);
                    resolve({credentials:credentials})
                });

            }
        )
        
    }

    var ArtistService = {};
    ArtistService.get_top_artists = function(access_token, time_range = "short_term", limit=10) {
        var uri = buildUrl('https://api.spotify.com/v1/me/top/artists', {
            queryParams: {
                time_range: time_range,
                limit: 10
            }
        });

        var args = {
            headers: { "Content-Type": "application/json",
                       "Accept": "application/json",
                       "Authorization": "Bearer "+access_token
                     }
        };

        console.log("URI:"+uri);


        return new Promise (
            (resolve, reject) => {
                request.get(uri, args, function(response) {
                    // parsed response body as js object
                    if (response.error || response.error_description) {
                        console.log("error: "+response.error_description)
                        reject({error: response.error_description})
                    }
                    console.log("inside artists Service!!");
                    console.log(response);
                    var artists = response.items.map(item => {
                        return Artist(item);
                    });
                    var url_for_next_artists = response.next;
                    resolve({artists:artists});
                });

            }
        )

    }

    var TrackService = {};
    TrackService.get_top_tracks = function(access_token, time_range = "short_term", limit=10) {
        var uri = buildUrl('https://api.spotify.com/v1/me/top/tracks', {
            queryParams: {
                time_range: time_range,
                limit: limit
            }
        });

        var args = {
            headers: { "Content-Type": "application/json",
                       "Accept": "application/json",
                       "Authorization": "Bearer "+access_token
                     }
        };


        return new Promise (
            (resolve, reject) => {
                request.get(uri, args, function(response) {
                    // parsed response body as js object
                    if (response.error || response.error_description) {
                        console.log("error: "+response.error_description)
                        reject({error: response.error_description})
                    }
                    console.log("inside Tracks Service!!");
                    console.log(response);
                    resolve({tracks:response.items});
                    var tracks = response.items.map(item => {
                        return Track(item);
                    });
                    var url_for_next_artists = response.next;
                    resolve({tracks:tracks});
                });

            }
        )

    }

    that.AuthService = AuthService;
    that.ArtistService = ArtistService;
    that.TrackService = TrackService;

    return that;
})();


module.exports = Spotify;