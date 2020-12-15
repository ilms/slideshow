import React from 'react';

import Field from './Field';

import './E621Filters.css';


class E621Filters extends React.Component {
  constructor(props) {
    super(props);
    this.handleTagsChange = this.handleTagsChange.bind(this);
    this.handleTagsKey = this.handleTagsKey.bind(this);
    this.search = this.search.bind(this);
    // TODO fix fields not filling with old data
    this.state = {tags: ''};
  }

  render() {
    return (
      <div className="form filter-form">
        <Field label="Tags" type="text" 
               onChange={this.handleTagsChange} 
               onKeyPress={this.handleTagsKey} />
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
      e.target.blur();
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
