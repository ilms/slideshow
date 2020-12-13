import React from 'react';
import Authentication from '../helpers/Authentication';

import Field from './Field';


class E621Settings extends React.Component {
  constructor(props) {
    super(props);
    this.handleLocalChange = this.handleLocalChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSaveLogin = this.handleSaveLogin.bind(this);
    this.state = {
      username: '',
      apiKey: '',
      userBlacklist: true,
      avoidAnonBlacklist: false,
      setID: '',
    };
  }

  render() {
    return (
      <div className="form">
        <Field label="Username" type="text" 
               name="username" value={this.state.username}
               onChange={this.handleLocalChange} />
        <Field label="API Key" type="password" 
               name="apiKey" value={this.state.apiKey}
               onChange={this.handleLocalChange} />
        <button id="e621-save-login-button" onClick={this.handleSaveLogin}>
          Store Login Locally
        </button>
        <Field label="User Blacklist" type="checkbox" 
               name="userBlacklist" checked={this.state.userBlacklist}
               onChange={this.handleChange} />
        <Field label="Avoid Anon Blacklist" type="checkbox" 
               name="avoidAnonBlacklist" checked={this.state.avoidAnonBlacklist}
               onChange={this.handleChange} />
        <Field label="Set ID" type="text" 
               name="setID" value={this.state.setID}
               onChange={this.handleChange} />
      </div>
    );
  }

  handleLocalChange(event) {
    let target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({[target.name]: value});
  }

  handleChange(event) {
    let target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({[target.name]: value});
    this.props.onSettingsChange({[target.name]: value});
  }

  handleSaveLogin() {
    Authentication.storeLogin(this.state.username, this.state.apiKey);
    this.setState({ username: '', apiKey: '' });
  }
}

export default E621Settings;
