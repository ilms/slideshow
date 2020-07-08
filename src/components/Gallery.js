import React from 'react';
import { Slideshow } from './Slideshow';
import { E621Filters } from './E621Filters';


class Gallery extends React.component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'search',
      filters: {},
      settings: {},
    };
  }

  render() {
    switch (this.state.mode) {
      default:
      case 'search':
        return (
          <E621Filters searchCallback={this.search.bind(this)} />
        );
      case 'gallery':
        return 
    }
  }

  search() {

  }
}
