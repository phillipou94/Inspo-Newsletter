import React, {Component} from 'react';
import {music_app_api} from '../api'


class ConnectMusicAppPage extends Component {
  constructor(props) {
    super(props);

  }


  componentDidMount() {
    var user_id = sessionStorage.getItem("user_id");
    if (!user_id) {
      //do something here
    }
    if (user_id) {
      console.log(user_id);
    }
  }

  getLocation(callback) {

  }

  redirectToURI = (uri) => {
    window.location.replace(uri);
  }

  didClickLogin(event) {
    event.preventDefault();
    console.log("lcicked!")
    var self = this;
    
    music_app_api.start_authentication("spotify")
    .then(response => {
      var uri = response.data.redirect_uri;
      self.redirectToURI(uri);

    }).catch(error => {
      console.log(error)
    });

  }

  render() {

    return (
      <div>
        <h2>Home!!!!</h2>
        <p> ConnectMusicAppPage</p>
        <button onClick= {this.didClickLogin.bind(this)}> spotify login </button>
      </div>
    );
  }
}

export default ConnectMusicAppPage;