import React from 'react';
import Authentication from '../helpers/Authentication';

import E621API from '../api/E621API';
import Field from './Field';


class E621Settings extends React.Component {
  constructor(props) {
    super(props);
    this.handleLocalChange = this.handleLocalChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSaveLogin = this.handleSaveLogin.bind(this);
    this.fetchBlacklist = this.fetchBlacklist.bind(this);
    this.state = E621Settings.initialState;
    this.fetchBlacklist();
    this.fetchSets();
  }

  static get initialState() {
    return {
      username: '',
      apiKey: '',
      userBlacklist: '',
      avoidAnonBlacklist: false,
      setID: '',
      sets: E621Settings._defaultSets(),
    };
  }

  render() {
    return (
      <div className="form settings-form">
        <button onClick={this.props.close}>
          Close Settings
        </button>
        <Field label="Username" type="text" 
               name="username" value={this.state.username}
               onChange={this.handleLocalChange} />
        <Field label="API Key" type="password" 
               name="apiKey" value={this.state.apiKey}
               onChange={this.handleLocalChange} />
        <button id="e621-save-login-button" onClick={this.handleSaveLogin}>
          Store Login Locally
        </button>
        <Field label="Avoid Anon Blacklist" type="checkbox" 
               name="avoidAnonBlacklist" checked={this.state.avoidAnonBlacklist}
               onChange={this.handleChange} />
        <h2>Blacklist</h2>
        <button id="fetch-user-blacklist-button" onClick={this.fetchBlacklist}>
          Get blacklist
        </button>
        <textarea name="userBlacklist" value={this.state.userBlacklist}
               onChange={this.handleChange} />
        <h2>Selected Set</h2>
        {this._getSetSelection()}
        <button onClick={this.props.close}>
          Close Settings
        </button>
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    // Because React does not auto update on select option changes
    if (prevState.sets !== this.state.sets) {
      // Select the first element of the available sets
      let owned = this.state.sets['Owned'];
      let maintained = this.state.sets['Maintained'];
      let allSets = owned.concat(maintained);
      if (allSets.length > 0) {
        this.setState({setID: allSets[0][1]});
      } else {
        this.setState({setID: ""});
      }
    }
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
    this.fetchBlacklist();
    this.fetchSets();
  }

  fetchBlacklist() {
    let setBlacklist = this._setBlacklist.bind(this);
    let username = Authentication.username;
    E621API.getUser({
      user: username,
      success: (json) => {
        if (json.hasOwnProperty('blacklisted_tags')) {
          setBlacklist(json['blacklisted_tags']);
        } else {
          setBlacklist('(error_not_logged_in:' + username + ')');
        }
      },
      failure: () => {
        setBlacklist('(error_invalid_user:' + username + ')');
      },
    });
  }

  _setBlacklist(value) {
    this.setState({userBlacklist: value});
    this.props.onSettingsChange({userBlacklist: value});
  }

  fetchSets() {
    let setState = this.setState.bind(this);
    E621API.getSets({
      success: (json) => { setState({sets: json}); },
      failure: () => { setState({sets: E621Settings._defaultSets()}); },
    });
  }

  static _defaultSets() {
    return {Owned: [], Maintained: []};
  }

  _getSetSelection() {
    return (
      <select name="setID" value={this.state.setID}
              onChange={this.handleChange}>
        <optgroup label="Owned">
          {this._getSetSelectionGroup(this.state.sets['Owned'])}
        </optgroup>
        <optgroup label="Maintained">
          {this._getSetSelectionGroup(this.state.sets['Maintained'])}
        </optgroup>
      </select>
    );
  }

  _getSetSelectionGroup(group) {
    let options = [];
    for (let i = 0; i < group.length; ++i) {
      options.push(this._getSetSelectionOption(group[i][0], group[i][1]));
    }
    return options;
  }

  _getSetSelectionOption(name, id) {
    return <option value={id} key={id}>{name}</option>;
  }
}

export default E621Settings;
