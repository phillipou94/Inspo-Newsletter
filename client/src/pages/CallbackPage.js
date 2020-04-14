import React, {Component} from 'react';
import queryString from 'query-string'

import {user_api, music_app_api, recommendation_api} from '../api/index.js'

class CallbackPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage:null,
      loading:false,
    }

  }


  componentDidMount() {
     const values = queryString.parse(this.props.location.search)
     console.log(values);
     var authorization_code = values.code;
     var user_id = sessionStorage.getItem("user_id");
      if (!user_id || !authorization_code) {
        //do something here
      }
      music_app_api.register_music_app({app:"spotify", auth_code: authorization_code, user_id:user_id}).then(response => {
          var music_app = response.data.music_app;
          user_api.update_user(user_id, {music_app_id: music_app._id, default_music_app: "spotify"}).then(response => {
            var user = response.data.user;
            recommendation_api.create_recommendation(user.music_app_id, {recommendation_type: "SPOTIFY_RANDOM_TOP_10_TRACKS_AND_ARTISTS"}).then(response => {
              var tracks = response.data.tracks;
              console.log(tracks)
            }).catch(error => {
              console.log(error);
            })
            
          }).catch(error => {
            console.log(error)
          });
      }).catch(error => {
        console.log(error)
      });


  }

  render() {
    return (
      <div>
        <h2>Callback!</h2>
        <p> This is the callback page</p>
      </div>
    );
  }
}

export default CallbackPage;