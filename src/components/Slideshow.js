import React from 'react';

import './Slideshow.css';


export class Slideshow extends React.Component {
  render() {
    return (
      <div className="slide-wrapper">
        <div className="slide">
          <img className="current-image" src={this.props.post.contentURL} alt="" />
        </div>
        <div className="slide-controls">
          <button className="prev-button" onClick={this.props.prev}>Previous</button>
          <button className="escape-button" onClick={this.props.escape}>Close</button>
          <a className="source-button" href={this.props.post.link} 
             target="_blank" rel="noopener noreferrer">Link</a>
          <button className="next-button" onClick={this.props.next}>Next</button>
        </div>
      </div>
    );
  }
}

export default Slideshow;
