import React from 'react';

import Field from './Field';

import './E621Filters.css';


class E621Filters extends React.Component {
  constructor(props) {
    super(props);
    this.handleTagsChange = this.handleTagsChange.bind(this);
    this.search = this.search.bind(this);
    this.state = {tags: ''};
  }

  render() {
    return (
      <div className="form">
        <Field label="Tags" type="text" onChange={this.handleTagsChange} onKeyPress={this.handleTagsKey} />
        <button onClick={this.search}>
          Search
        </button>
        <button onClick={this.props.escape}>
          Close
        </button>
      </div>
    );
  }

  handleTagsChange(e) {
    this.setState({ tags: e.target.value });
  }

  handleTagsKey(e) {
    if (e.key === 'Enter') {
      this.search();
    }
  }

  search() {
    let filters = {
      tags: this.state.tags
    };
    this.props.searchCallback(filters);
  }
}

export default E621Filters;
