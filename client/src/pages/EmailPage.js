import React, {Component} from 'react';
import queryString from 'query-string'

import {user_api} from '../api'

class EmailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name:"",
      email:"",
      authorization_code:"",
      errorMessage:null,
      loading:false,
    }

  }


  componentDidMount() {
     const values = queryString.parse(this.props.location.search)
     var authorization_code = values.code;
     this.state.authorization_code = authorization_code;


  }

  updateInputValue(event) {
    var field = event.target.name;
    var value = event.target.value;
    this.setState((prevState) => {
      prevState[field] = value;
      return prevState;
    });
  }

  signup(event) {
    event.preventDefault();
    const email = this.state.email;
    const authorization_code = this.state.authorization_code;
    user_api.create_user({email:email}).then(response => {
      var user_id = response.data._id;
      sessionStorage.setItem("user_id", user_id);
      var redirect_uri = "/connect"
      window.location.href = redirect_uri;
    }).catch(error => {
      console.log(error)
    });;

  }



  render() {
    return (
      <div>
        <h2>Email</h2>
        <p> Email!</p>
        <div>
            <form onSubmit = {this.signup.bind(this)}>
            <input name='email' placeholder='Email' onChange={this.updateInputValue.bind(this)}/>
            <button onClick= {this.signup.bind(this)}>Sign Up</button>
            </form>
          </div>
      </div>
    );
  }
}

export default EmailPage;