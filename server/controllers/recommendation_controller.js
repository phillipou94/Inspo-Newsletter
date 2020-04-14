const MusicApp = require('../models/MusicApp.js');
var Spotify = require('../services/spotify_service.js');

var RecommendationController = (function() {
    var that = {};

    that.create_recommendation = function(req, res) {
        var music_app_id = req.params.music_app_id;
        var recommendation_type = req.body.recommendation_type;

        MusicApp.findOne({ _id: music_app_id}, (err, music_app) => {
            if (err) {
                return res.status(404).json({
                    err,
                    message: 'User not found!',
                })
            }

            if (recommendation_type == "SPOTIFY_RANDOM_TOP_10_TRACKS_AND_ARTISTS") {


                var access_token = music_app.access_token;
                var top_artist_promise = Spotify.ArtistService.get_top_artists(access_token, time_range = "short_term", limit=10);
                var top_tracks_promise = Spotify.TrackService.get_top_tracks(access_token, time_range = "short_term", limit=10);

                Promise.all([top_artist_promise,top_tracks_promise].map(promise => promise.catch(error =>error)))
                .then(response => {
                    var top_artists = response[0].artists;
                    var top_tracks = response[1].tracks;

                    var seed_ids = get_seed_ids(top_artists, top_tracks, 5);
                    var seed_artists =seed_ids.artist_seed_ids;
                    var seed_tracks = seed_ids.track_seed_ids;

                    Spotify.RecommendationService.get_recommendations(access_token, seed_artists, seed_tracks)
                    .then(response => {
                        var tracks = response.tracks
                        return res.status(200).json({
                            success: true,
                            tracks: tracks
                        });
                    }).catch(error => {
                        return res.status(404).json({
                            error,
                            message: 'could not retrieve recommendations from Spotify',
                        })
                    });

                    
                }).catch(error => {
                    return res.status(404).json({
                        error,
                        message: 'could not provide  recommendations',
                    })
                });

                
            }
    
        })
    }
 
    //pass in artists and tracks and it'll randomly pick n of the 2 lists. 
    // n must be smaller then the length of both lists combined
    var get_seed_ids = function(artists, tracks, n) {
        var items = artists.concat(tracks);
        // make sure n is less than summed size of arrays
        var how_many = n > artists.length + tracks.length - 1 ? artists.length + tracks.length - 1 : n;

        //shuffle
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }
        
        var seeds = items.slice(0,how_many);
        var artist_seed_ids = []
        var track_seed_ids = []
        seeds.forEach(item => {
            if (item.type=="artist") {
                artist_seed_ids.push(item.id);
            }
            if (item.type == "track") {
                track_seed_ids.push(item.id);
            }
        });

        return {artist_seed_ids:artist_seed_ids, track_seed_ids:track_seed_ids}
    }

    return that;
})();

module.exports = RecommendationController;