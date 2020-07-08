import React from 'react';


class E621Settings extends React.Component {
  constructor(props) {
    super(props);
    this.handleTagsChange = this.handleTagsChange.bind(this);
    this.state = {tags: ''};
  }

  render() {
    return (
      <div className="form">
        <input id="e621-username" type="text" />
        <input id="e621-api-key" type="password" />
        <button id="e621-apply-button">Apply</button>
        <button id="e621-save-login-button">Store Login Locally</button>
      </div>
    );
  }

  handleTagsChange(e) {
    this.setState({ tags: e.target.value });
  }

  handleTagsKey(e) {
    if (e.key === 'Enter') {
      this.serachCallback();
    }
  }
}

export default E621Settings;
