var buildUrl = require('build-url');
var Client = require('node-rest-client').Client;
 
var client = new Client();
var request = new Client();

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
                    console.log("resolving!!!");
                    console.log(credentials);
                    resolve({credentials:credentials})
                });

            }
        )
    }

    that.AuthService = AuthService;

    return that;
})();


module.exports = Spotify;