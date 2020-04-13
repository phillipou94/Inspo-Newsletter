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
                Spotify.ArtistService.get_top_artists(music_app.access_token, time_range = "short_term", limit=10).then(response => {
                    console.log("reocmmendation controller");
                    return res.status(200).json({
                        success: true,
                        response: response
                    });
                    
                }).catch(error => {
                    return res.status(404).json({
                        error,
                        message: 'could not retrieve top artists',
                    })
                });

                Spotify.TrackService.get_top_tracks(music_app.access_token, time_range = "short_term", limit=10).then(response => {
                    console.log("getting tracks!");
                    return res.status(200).json({
                        success: true,
                        response: response
                    });
                    
                }).catch(error => {
                    return res.status(404).json({
                        error,
                        message: 'could not retrieve top artists',
                    })
                });
            }
    
        })
    }

    

    return that;
})();

module.exports = RecommendationController;